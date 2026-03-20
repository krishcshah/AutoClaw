import React, { useRef, useState } from 'react';
import { WizardData } from '../Wizard';
import { UploadCloud, CheckCircle } from 'lucide-react';

interface Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  nextStep: () => void;
}

export function GcpCredentials({ data, updateData, nextStep }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let file: File | null = null;
    
    if ('dataTransfer' in e) {
      e.preventDefault();
      setIsDragOver(false);
      file = e.dataTransfer.files[0];
    } else if (e.target.files) {
      file = e.target.files[0];
    }

    if (!file) return;

    if (!file.name.endsWith('.json')) {
      setError('Please upload a valid JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (!parsed.project_id || !parsed.private_key) {
          setError('Invalid Service Account JSON. Missing project_id or private_key.');
          return;
        }

        setError('');
        updateData({ 
          gcpServiceAccount: content,
          gcpProjectId: parsed.project_id
        });
      } catch (err) {
        setError('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  const isComplete = data.gcpProjectId && data.gcpServiceAccount;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h2 style={{ fontSize: '1.5rem', color: '#fff' }}>Google Cloud Credentials</h2>
      <p style={{ marginBottom: '2rem' }}>
        We need your GCP Service Account to provision Cloud Run and IAM resources. 
        <a href="https://console.cloud.google.com/iam-admin/serviceaccounts" target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', marginLeft: '4px', textDecoration: 'none' }}>
           Learn how to create one.
        </a>
      </p>

      <div style={{ flex: 1 }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Project ID
          </label>
          <input 
            type="text" 
            placeholder="e.g. my-agent-project-123" 
            value={data.gcpProjectId}
            onChange={(e) => updateData({ gcpProjectId: e.target.value })}
            autoComplete="off"
          />
          <p style={{ fontSize: '0.85rem', marginTop: '6px', color: '#64748b' }}>
            We'll automatically set defaults like region (us-central1) to minimize input.
          </p>
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500, color: 'var(--text-secondary)' }}>
            Service Account Key (.json)
          </label>
          
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            style={{ display: 'none' }} 
          />
          
          <div 
            className={`file-drop-area ${isDragOver ? 'drag-over' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileChange}
          >
            {data.gcpServiceAccount ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={32} color="var(--success)" />
                <span style={{ color: 'var(--success)', fontWeight: 600 }}>Credentials Loaded</span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Click to replace file
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <UploadCloud size={32} color="var(--accent-primary)" />
                <span style={{ fontWeight: 500, color: '#fff' }}>Click or drop JSON file here</span>
                <span style={{ fontSize: '0.85rem' }}>Your credentials remain local and are never stored on our servers.</span>
              </div>
            )}
          </div>
          {error && <div className="text-error">{error}</div>}
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
