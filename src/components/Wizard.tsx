"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GcpCredentials } from './steps/GcpCredentials';
import { AgentConfig } from './steps/AgentConfig';
import { TelegramConfig } from './steps/TelegramConfig';
import { Review } from './steps/Review';
import { DeployStatus } from './steps/DeployStatus';

export type WizardData = {
  gcpProjectId: string;
  gcpServiceAccount: string; // the JSON key string
  llmProvider: 'openai' | 'anthropic' | 'gemini';
  llmApiKey: string;
  telegramToken: string;
};

const STEPS = [
  { id: 'gcp', title: 'Google Cloud' },
  { id: 'agent', title: 'Agent Config' },
  { id: 'telegram', title: 'Telegram' },
  { id: 'review', title: 'Review' },
  { id: 'deploy', title: 'Deploy' },
];

export function Wizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    gcpProjectId: '',
    gcpServiceAccount: '',
    llmProvider: 'openai',
    llmApiKey: '',
    telegramToken: '',
  });

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));
  const updateData = (newData: Partial<WizardData>) => setData((prev) => ({ ...prev, ...newData }));

  const currentStepData = STEPS[currentStep];

  return (
    <div className="glass-panel" style={{ width: '100%', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
      
      {/* Progress Header */}
      <div style={{ padding: '24px 32px', borderBottom: '1px solid var(--glass-border)', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          {STEPS.map((step, index) => {
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            return (
              <div key={step.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
                <div style={{ 
                  width: '32px', height: '32px', borderRadius: '50%', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: isActive ? 'var(--accent-primary)' : isCompleted ? 'var(--success)' : 'var(--bg-secondary)',
                  color: isActive || isCompleted ? '#fff' : 'var(--text-secondary)',
                  fontWeight: 600, zIndex: 2,
                  transition: 'all 0.3s ease'
                }}>
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span style={{ 
                  marginTop: '8px', fontSize: '0.85rem', fontWeight: 500,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  textAlign: 'center'
                }}>
                  {step.title}
                </span>
                
                {index < STEPS.length - 1 && (
                  <div style={{
                    position: 'absolute', top: '16px', left: '50%', width: '100%', height: '2px',
                    background: isCompleted ? 'var(--success)' : 'var(--glass-border)',
                    zIndex: 1, transform: 'translateX(50%)' // Fixed progress bar positioning
                  }}></div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content Area */}
      <div style={{ flex: 1, padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
          >
            {currentStep === 0 && <GcpCredentials data={data} updateData={updateData} nextStep={nextStep} />}
            {currentStep === 1 && <AgentConfig data={data} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 2 && <TelegramConfig data={data} updateData={updateData} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 3 && <Review data={data} nextStep={nextStep} prevStep={prevStep} />}
            {currentStep === 4 && <DeployStatus data={data} reset={() => setCurrentStep(0)} />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
