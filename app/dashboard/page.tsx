import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BookmarkForm } from '@/components/bookmark-form'
import { BookmarkList } from '@/components/bookmark-list'
import { LogoutButton } from './logout-button'

export default async function DashboardPage() {
  const supabase = await createClient() 

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-base)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Grain overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      {/* Ambient orbs */}
      <div className="orb orb-1" aria-hidden="true" />
      <div className="orb orb-2" aria-hidden="true" />

      {/* Sticky header */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: 'rgba(13, 15, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 1.5rem',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #f5a623 0%, #f7c56a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(245,166,35,0.3)',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" fill="none" stroke="#0d0f14" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h1
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Smart Bookmarks
            </h1>
          </div>

          {/* Right side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span
              style={{
                display: 'none',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                fontFamily: 'var(--font-body)',
                background: 'var(--bg-glass)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '20px',
                padding: '0.3rem 0.75rem',
              }}
              className="sm-show"
            >
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: '2.5rem', animation: 'fade-in-up 0.5s ease both' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              letterSpacing: '-0.03em',
              margin: '0 0 0.4rem 0',
            }}
          >
            Your Collection
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, fontFamily: 'var(--font-body)' }}>
            All your saved links, synced in real-time.
          </p>
        </div>

        {/* Add Bookmark section */}
        <div
          className="glass-card"
          style={{
            borderRadius: '20px',
            padding: '1.75rem',
            marginBottom: '2rem',
            borderTop: '2px solid var(--accent)',
            animation: 'fade-in-up 0.5s 0.1s ease both',
            opacity: 0,
            animationFillMode: 'forwards',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: 'var(--accent)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: '0 0 1.25rem 0',
            }}
          >
            + Add New Bookmark
          </h3>
          <BookmarkForm userId={user.id} />
        </div>

        {/* Bookmarks list */}
        <div style={{ animation: 'fade-in-up 0.5s 0.2s ease both', opacity: 0, animationFillMode: 'forwards' }}>
          <BookmarkList userId={user.id} />
        </div>
      </main>

      <style>{`
        @media (min-width: 640px) {
          .sm-show { display: block !important; }
        }
      `}</style>
    </div>
  )
}
