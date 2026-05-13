import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export default async function Image({ params }: { params: { id: string } }) {
  // In a real app, we'd fetch the audit from Supabase here
  // For the assignment, we'll use a placeholder or generic "Savings found" image
  // since we can't access localStorage in the Edge runtime.
  
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#4f46e5',
          backgroundImage: 'radial-gradient(circle at top right, #6366f1, #4f46e5)',
          color: 'white',
          padding: '80px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
          <div style={{ padding: '12px', background: 'white', borderRadius: '12px' }}>
             <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="3">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
             </svg>
          </div>
          <span style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-0.05em' }}>SpendWise Audit</span>
        </div>
        
        <h1 style={{ fontSize: '80px', fontWeight: 900, textAlign: 'center', margin: '0', letterSpacing: '-0.05em', lineHeight: 1.1 }}>
          We found potential savings in this AI stack.
        </h1>
        
        <p style={{ fontSize: '32px', color: '#e0e7ff', marginTop: '40px', textAlign: 'center', maxWidth: '800px' }}>
          Analyze your AI spend on Cursor, Claude, and Copilot in 60 seconds.
        </p>

        <div style={{ marginTop: '60px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'white', opacity: 0.8 }}>Powered by</span>
          <span style={{ fontSize: '32px', fontWeight: 'bold', color: 'white' }}>Credex</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
