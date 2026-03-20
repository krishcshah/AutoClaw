import { NextRequest, NextResponse } from 'next/server';
import { ServicesClient } from '@google-cloud/run';
import { ServiceUsageClient } from '@google-cloud/service-usage';
import { OAuth2Client } from 'google-auth-library';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.gcpProjectId || !data.telegramToken || !data.gcpAccessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Starting real deployment for ${data.gcpProjectId}...`);

    // 1. Authenticate using the provided short-lived OAuth access token
    const authClient = new OAuth2Client();
    authClient.setCredentials({ access_token: data.gcpAccessToken });
    const options = { projectId: data.gcpProjectId, authClient };
    
    // Initialize SDK Clients
    const runClient = new ServicesClient(options);
    const serviceUsageClient = new ServiceUsageClient(options);

    // 2. Enable necessary APIs (Cloud Run)
    console.log('Enabling Cloud Run API...');
    try {
      const [operation] = await serviceUsageClient.enableService({
        name: `projects/${data.gcpProjectId}/services/run.googleapis.com`
      });
      await operation.promise();
    } catch (e: any) {
      console.warn('API may already be enabled or insufficient permissions:', e.message);
    }

    const parent = `projects/${data.gcpProjectId}/locations/us-central1`;
    const serviceId = 'openclaw-agent-' + Math.floor(Math.random() * 10000);

    // 3. Deploy OpenClaw container to Cloud Run (v2 API)
    console.log('Provisioning Cloud Run Service...');
    const [createOperation] = await runClient.createService({
      parent,
      serviceId,
      service: {
        template: {
          containers: [{
            image: 'ghcr.io/openclaw/openclaw:latest', // Assuming standard public image
            env: [
              { name: 'LLM_PROVIDER', value: data.llmProvider },
              { name: 'LLM_API_KEY', value: data.llmApiKey },
              { name: 'TELEGRAM_TOKEN', value: data.telegramToken },
              { name: 'PORT', value: '8080' }
            ],
            resources: {
              limits: { memory: '512Mi', cpu: '1' } // Smart default to balance cost/performance
            }
          }]
        }
      }
    });

    const [serviceResponse] = await createOperation.promise();
    const serviceUrl = serviceResponse.uri;

    if (!serviceUrl) {
      throw new Error('Deployment succeeded but no URI was returned by Cloud Run.');
    }

    // 4. Set IAM Policy to allow unauthenticated invocations (Telegram webhooks)
    console.log('Making service public for webhook access...');
    await runClient.setIamPolicy({
      resource: serviceResponse.name,
      policy: {
        bindings: [
          { role: 'roles/run.invoker', members: ['allUsers'] }
        ]
      }
    });

    // 5. Connect Telegram (Webhook) to the new Cloud Run URL
    console.log('Registering Telegram Webhook...');
    const webhookRes = await fetch(`https://api.telegram.org/bot${data.telegramToken}/setWebhook?url=${serviceUrl}/webhook`);
    const webhookData = await webhookRes.json();
    if (!webhookData.ok) {
      console.warn('Failed to register Telegram webhook:', webhookData.description);
      // We don't throw here to ensure the user still gets the URL if the bot token is slightly misconfigured but infrastructure worked.
    }

    console.log('Deployment completely successful. Target URL:', serviceUrl);
    
    return NextResponse.json({ 
      success: true, 
      url: serviceUrl 
    });

  } catch (error: any) {
    console.error('Deployment error:', error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
