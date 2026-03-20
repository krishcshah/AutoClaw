import React from 'react';
import { WizardData } from '../Wizard';

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function AgentConfig({ data, updateData, nextStep, prevStep }: Props) {
  
  const isComplete = data.llmApiKey.length > 10;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Agent Configuration</h2>
      <p style={{ marginBottom: '2rem' }}>
        Configure the foundation for your OpenClaw agent by selecting the LLM provider and API key.
      </p>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            LLM Provider
          </label>
          <div style={{ display: 'flex', gap: '12px' }}>
            {['openai', 'anthropic', 'gemini'].map(p => (
              <button 
                key={p} 
                onClick={() => updateData({ llmProvider: p as any })}
                style={{ 
                  flex: 1, padding: '12px', borderRadius: '8px', 
                  border: `2px solid ${data.llmProvider === p ? 'var(--accent-primary)' : 'var(--glass-border)'}`,
                  background: data.llmProvider === p ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.2)',
                  color: data.llmProvider === p ? '#fff' : 'var(--text-secondary)',
                  cursor: 'pointer', fontWeight: 600, textTransform: 'capitalize'
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            API Key
          </label>
          <input 
            type="password" 
            placeholder={`Enter your ${data.llmProvider} API Key`}
            value={data.llmApiKey}
            onChange={(e) => updateData({ llmApiKey: e.target.value })}
            autoComplete="new-password"
          />
          <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#64748b' }}>
            This key is securely passed to the Cloud Run instance upon deployment.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid var(--glass-border)' }}>
        <button className="btn-secondary" onClick={prevStep}>
          Back
        </button>
        <button className="btn-primary" onClick={nextStep} disabled={!isComplete}>
          Continue
        </button>
      </div>
    </div>
  );
}
