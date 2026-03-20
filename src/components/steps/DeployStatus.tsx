import React, { useEffect, useState } from 'react';
import { WizardData } from '../Wizard';
import { CheckCircle, Loader2, AlertCircle, ExternalLink, Bot } from 'lucide-react';

interface Props {
  data: WizardData;
  reset: () => void;
}

export function DeployStatus({ data, reset }: Props) {
  const [status, setStatus] = useState<'deploying' | 'success' | 'error'>('deploying');
  const [logs, setLogs] = useState<string[]>(['Initializing deployment...']);
  const [deployUrl, setDeployUrl] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    async function deploy() {
      try {
        setLogs(prev => [...prev, 'Authenticating with Google Cloud...', 'Enabling Compute and Run APIs...']);
        
        const res = await fetch('/api/deploy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        const body = await res.json();
        
        if (!isMounted) return;

        if (!res.ok) {
          throw new Error(body.error || 'Deployment failed');
        }

        setLogs(prev => [...prev, 'Provisioning Cloud Run Service...', 'Configuring Environment Variables...', 'Setting Telegram Webhook...', 'Deployment Successful!']);
        setDeployUrl(body.url || 'https://openclaw-agent-mock-url.run.app');
        setStatus('success');
      } catch (err: any) {
        if (!isMounted) return;
        setStatus('error');
        setErrorMsg(err.message || String(err));
        setLogs(prev => [...prev, `Error: ${err.message}`]);
      }
    }

    // Delay start slightly for UX
    const t = setTimeout(() => deploy(), 1000);
    return () => { isMounted = false; clearTimeout(t); };
  }, [data]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      
      {status === 'deploying' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Loader2 size={48} color="var(--accent-primary)" style={{ animation: 'spin 2s linear infinite', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>Deploying your Agent</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Please keep this window open. This usually takes 1-2 minutes.</p>
        </div>
      )}

      {status === 'success' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CheckCircle size={64} color="var(--success)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--success)' }}>VM Provisioned!</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Your OpenClaw agent is now booting up on Google Compute Engine.
          </p>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)', marginBottom: '24px', width: '100%', maxWidth: '400px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>Google Compute Engine</div>
            <div style={{ fontSize: '0.9rem', color: '#fff', marginBottom: '4px' }}><strong>Instance:</strong> {deployUrl.split('/').pop() || 'openclaw-vm'}</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)' }}>The startup script is installing dependencies in the background (takes ~3-5 minutes). <strong>You must message your bot first</strong> on Telegram to initiate the session, as bots cannot start conversations!</div>
          </div>

          <a href={`https://t.me/${data.telegramUsername}`} target="_blank" rel="noreferrer" className="btn-primary" style={{ textDecoration: 'none', width: '100%', maxWidth: '400px' }}>
            <Bot size={20} /> Open Telegram & Send Message
          </a>
        </div>
      )}

      {status === 'error' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <AlertCircle size={64} color="var(--error)" style={{ marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1.8rem', marginBottom: '8px', color: 'var(--error)' }}>Deployment Failed</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            We encountered an issue while provisioning your resources.
          </p>
          
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '16px', borderRadius: '8px', color: '#fca5a5', width: '100%', textAlign: 'left', marginBottom: '24px' }}>
            <strong>Error Details:</strong>
            <p style={{ marginTop: '8px', fontFamily: 'monospace', color: 'inherit' }}>{errorMsg}</p>
            <div style={{ marginTop: '16px', fontSize: '0.9rem' }}>
              <strong>Suggested Fix:</strong> Ensure your Service Account has sufficient permissions (e.g., <code>roles/editor</code> or <code>roles/run.admin</code> and <code>roles/iam.serviceAccountUser</code>).
            </div>
          </div>
          
          <button className="btn-secondary" onClick={reset}>
            Try Again
          </button>
        </div>
      )}

      {/* Terminal Logs View */}
      <div style={{ marginTop: '32px', width: '100%', textAlign: 'left', background: '#000', borderRadius: '8px', padding: '16px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a3a3a3', height: '140px', overflowY: 'auto', border: '1px solid var(--glass-border)' }}>
        {logs.map((log, i) => (
          <div key={i} style={{ marginBottom: '4px' }}>
            <span style={{ color: 'var(--accent-primary)' }}>&gt;</span> {log}
          </div>
        ))}
        {status === 'deploying' && <div className="animate-pulse" style={{ display: 'inline-block', width: '8px', height: '16px', background: 'var(--accent-primary)', verticalAlign: 'middle', marginLeft: '6px' }} />}
      </div>

    </div>
  );
}
