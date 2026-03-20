import React from 'react';
import { WizardData } from '../Wizard';

interface Props {
  data: WizardData;
  nextStep: () => void;
  prevStep: () => void;
}

export function Review({ data, nextStep, prevStep }: Props) {
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Review & Deploy</h2>
      <p style={{ marginBottom: '2rem' }}>
        Please verify your configuration before deployment. Our automated system will provision the required resources on Cloud Run.
      </p>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <ReviewRow label="Target Cloud" value="Google Cloud Platform" />
        <ReviewRow label="Project ID" value={data.gcpProjectId} />
        <ReviewRow label="Compute Engine" value="Cloud Run (Managed)" />
        <ReviewRow label="Region" value="us-central1 (Auto-selected)" />
        <ReviewRow label="LLM Provider" value={data.llmProvider.toUpperCase()} />
        <ReviewRow label="Telegram Integration" value="Enabled Configuration" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
        <button className="btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button className="btn-primary" onClick={nextStep}>
          Deploy Instance
        </button>
      </div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ color: '#fff', fontWeight: 500 }}>{value}</span>
    </div>
  );
}
