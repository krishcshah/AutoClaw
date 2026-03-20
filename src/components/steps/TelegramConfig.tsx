import React from 'react';
import { WizardData } from '../Wizard';
import { Send } from 'lucide-react';

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export function TelegramConfig({ data, updateData, nextStep, prevStep }: Props) {
  
  const isComplete = data.telegramToken.length > 20;
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Telegram Integration</h2>
      <p style={{ marginBottom: '2rem' }}>
        Connect your agent to Telegram so you can interact with it directly.
      </p>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '24px', padding: '16px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent-primary)' }}>
            <Send size={18} />
            <span style={{ fontWeight: 600 }}>How to get a Token?</span>
          </div>
          <ol style={{ marginLeft: '24px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <li style={{ marginBottom: '6px' }}>Open Telegram and search for <strong>@BotFather</strong></li>
            <li style={{ marginBottom: '6px' }}>Send the <code>/newbot</code> command</li>
            <li style={{ marginBottom: '6px' }}>Follow the prompts to name your bot</li>
            <li>Copy the API token provided at the end (e.g., <code>123456:ABC-DEF...</code>)</li>
          </ol>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Bot API Token
          </label>
          <input 
            type="password" 
            placeholder="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            value={data.telegramToken}
            onChange={(e) => updateData({ telegramToken: e.target.value })}
            autoComplete="new-password"
            style={{ marginBottom: '16px' }}
          />

          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Bot Username
          </label>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-color)', borderRadius: '8px', overflow: 'hidden' }}>
            <span style={{ padding: '12px 16px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>@</span>
            <input 
              type="text" 
              placeholder="MyOpenClawBot"
              value={data.telegramUsername}
              onChange={(e) => updateData({ telegramUsername: e.target.value.replace('@', '') })}
              style={{ border: 'none', borderRadius: '0', background: 'transparent' }}
            />
          </div>
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
