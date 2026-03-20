import { NextRequest, NextResponse } from 'next/server';
import compute from '@google-cloud/compute';
import { OAuth2Client } from 'google-auth-library';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    if (!data.gcpProjectId || !data.telegramToken || !data.gcpAccessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log(`Starting GCE VM provisioning for ${data.gcpProjectId}...`);

    // Authenticate using the provided short-lived OAuth access token
    const authClient = new OAuth2Client();
    authClient.setCredentials({ access_token: data.gcpAccessToken });
    
    // Initialize Compute Engine Client
    const instancesClient = new compute.InstancesClient({ projectId: data.gcpProjectId, authClient });

    const zone = 'us-central1-a';
    const instanceName = `openclaw-agent-${Math.floor(Math.random() * 100000)}`;

    // Build the robust startup script
    const startupScript = `#!/bin/bash
exec > /var/log/openclaw-startup.log 2>&1
echo "Starting OpenClaw Initialization..."

echo "Installing Node.js 22 and dependencies..."
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get update
sudo apt-get install -y nodejs git curl docker.io

echo "Installing process manager and pnpm..."
sudo npm install -g pnpm pm2

echo "Cloning official OpenClaw repository..."
git clone https://github.com/openclaw/openclaw.git /opt/openclaw
cd /opt/openclaw

echo "Writing environment configurations..."
cat <<EOF > .env
LLM_PROVIDER=${data.llmProvider}
LLM_API_KEY=${data.llmApiKey}
TELEGRAM_BOT_TOKEN=${data.telegramToken}
TELEGRAM_USERNAME=${data.telegramUsername}
CONFIRMATION_MODE=${data.confirmationMode}
EOF

echo "Building and starting OpenClaw agent..."
pnpm install
pnpm run build || true
pm2 start pnpm --name openclaw -- start

echo "Saving process list so OpenClaw survives reboots..."
pm2 save
pm2 startup | tail -n 1 | bash

echo "OpenClaw VM initialization complete."
`;

    const instanceResource = {
      name: instanceName,
      machineType: `zones/${zone}/machineTypes/e2-standard-2`,
      disks: [
        {
          boot: true,
          autoDelete: true,
          initializeParams: {
            sourceImage: 'projects/ubuntu-os-cloud/global/images/family/ubuntu-2204-lts',
            diskSizeGb: '30'
          }
        }
      ],
      networkInterfaces: [
        {
          network: 'global/networks/default',
          accessConfigs: [
            {
              type: 'ONE_TO_ONE_NAT',
              name: 'External NAT'
            }
          ]
        }
      ],
      metadata: {
        items: [
          {
            key: 'startup-script',
            value: startupScript
          }
        ]
      },
      // Give the VM minimal scopes, relying strictly on its own env keys for OpenClaw abilities 
      // rather than giving the VM overarching cloud admin access automatically.
      serviceAccounts: [
        {
          email: 'default',
          scopes: ['https://www.googleapis.com/auth/devstorage.read_only']
        }
      ]
    };

    console.log('Sending insert request to Google Compute API...');
    
    const [response] = await instancesClient.insert({
      instanceResource,
      project: data.gcpProjectId,
      zone,
    });

    console.log('VM Insert operation created:', response.name);

    // Provide the user with the generated instance link
    const instanceUrl = `https://console.cloud.google.com/compute/instancesDetail/zones/${zone}/instances/${instanceName}?project=${data.gcpProjectId}`;

    return NextResponse.json({ 
      success: true, 
      url: instanceUrl 
    });

  } catch (error: any) {
    console.error('Compute Engine Provisioning error:', error);
    return NextResponse.json({ error: error.message || String(error) }, { status: 500 });
  }
}
