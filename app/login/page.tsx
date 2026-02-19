import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginButton } from './login-button'

export default async function LoginPage() {
  const supabase = await createClient()
  
  const { data } = await supabase.auth.getUser()
  
  if (data?.user) {
    redirect('/dashboard')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Animated orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />
      <div className="orb orb-3" aria-hidden="true" />

      {/* Login card */}
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '24px',
          padding: '2.5rem',
          position: 'relative',
          zIndex: 1,
          animation: 'fade-in-up 0.6s ease both',
        }}
      >
        {/* Logo mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #f5a623 0%, #f7c56a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 40px rgba(245, 166, 35, 0.35)',
            }}
          >
            <svg width="30" height="30" fill="none" stroke="#0d0f14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            textAlign: 'center',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
          }}
        >
          Smart{' '}
          <span className="shimmer-text">Bookmarks</span>
        </h1>
        <p
          style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            marginBottom: '2rem',
            fontFamily: 'var(--font-body)',
          }}
        >
          Save, sync, and access your links anywhere.
        </p>

        {/* Sign in button */}
        <LoginButton />

        {/* Feature list */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              'Real-time sync across all devices',
              'Private, secure, and always yours',
              'Lightning fast — no clutter',
            ].map((feature) => (
              <li
                key={feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'var(--accent-dim)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                    <path d="M2 5l2 2 4-4" stroke="#f5a623" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
