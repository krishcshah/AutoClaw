import React from 'react';
import { WizardData } from '../Wizard';
import { CheckCircle, Terminal } from 'lucide-react';

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
}

export function GcpCredentials({ data, updateData, nextStep }: Props) {
  
  const isComplete = data.gcpProjectId && data.gcpAccessToken.length > 20;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Google Cloud Settings</h2>
      <p style={{ marginBottom: '2rem' }}>
        Provide a temporary access token from your local CLI so our Vercel deployment can securely assume your identity for deployment.
      </p>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Google Cloud Project ID
          </label>
          <input 
            type="text" 
            placeholder="e.g. my-agent-project-123" 
            value={data.gcpProjectId}
            onChange={(e) => updateData({ gcpProjectId: e.target.value })}
            autoComplete="off"
          />
          <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#64748b' }}>
            Enter the exact Google Cloud Project ID where OpenClaw will be deployed.
          </p>
        </div>

        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
            <Terminal size={18} />
            <span style={{ fontWeight: 600 }}>Secure Authentication Setup</span>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Instead of exposing long-lived JSON keys to a hosted deployment, you can provide a short-lived access token by running the following command in your terminal:
          </p>
          <div style={{ background: '#000', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#a3a3a3', border: '1px solid var(--glass-border)' }}>
            <span style={{ color: 'var(--accent-primary)' }}>$</span> gcloud auth print-access-token
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Access Token
          </label>
          <input 
            type="password" 
            placeholder="ya29.a0..." 
            value={data.gcpAccessToken}
            onChange={(e) => updateData({ gcpAccessToken: e.target.value })}
            autoComplete="off"
          />
          <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#64748b' }}>
            Paste the resulting token here. It will expire shortly after this deployment completes.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
        <button 
          className="btn-primary" 
          onClick={nextStep} 
          disabled={!isComplete}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
