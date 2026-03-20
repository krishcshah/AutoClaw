import { Wizard } from '@/components/Wizard';

export function generateMetadata() {
  return {
    title: 'OpenClaw Deployment Wizard',
    description: 'Deploy your OpenClaw agent to Google Cloud Platform in minutes.',
  };
}

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', padding: '2rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center', maxWidth: '600px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          OpenClaw Platform
        </h1>
        <p style={{ fontSize: '1.1rem' }}>
          Welcome to the automated deployment wizard. Follow these steps to provision your 
          OpenClaw agent on Google Cloud Run.
        </p>
      </header>
      
      <div style={{ width: '100%', maxWidth: '800px' }} className="animate-fade-in">
        <Wizard />
      </div>
    </main>
  );
}
