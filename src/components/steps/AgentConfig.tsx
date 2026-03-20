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
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Model Version (Exact String)
          </label>
          <input 
            type="text" 
            value={data.llmModel}
            onChange={(e) => updateData({ llmModel: e.target.value })}
            placeholder="e.g. gemini-3.1-pro, claude-3-5-sonnet-20240620"
            style={{ marginBottom: '8px' }}
          />
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Crucial: Use the most advanced models (like <strong>gemini-3.1-pro</strong>) so OpenClaw doesn't get stuck in failure loops.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
            <input 
              type="checkbox" 
              checked={data.confirmationMode} 
              onChange={(e) => updateData({ confirmationMode: e.target.checked })}
              style={{ width: '20px', height: '20px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div>
              <div style={{ fontWeight: 600, color: '#fff' }}>Enable Safety Confirmation Mode</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                If enabled, OpenClaw will ask for explicit permission via Telegram before executing potentially dangerous shell commands or modifying critical files. Assures safe autonomy on the VM.
              </div>
            </div>
          </label>
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
