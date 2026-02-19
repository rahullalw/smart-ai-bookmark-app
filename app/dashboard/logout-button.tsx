'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function LogoutButton() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Sign out"
      style={{
        padding: '0.45rem 1rem',
        borderRadius: '10px',
        border: `1px solid ${isHovered ? 'rgba(245,166,35,0.4)' : 'var(--border-subtle)'}`,
        background: isHovered ? 'var(--accent-dim)' : 'transparent',
        color: isHovered ? 'var(--accent)' : 'var(--text-secondary)',
        fontFamily: 'var(--font-body)',
        fontSize: '0.85rem',
        fontWeight: 500,
        cursor: isLoading ? 'not-allowed' : 'pointer',
        opacity: isLoading ? 0.5 : 1,
        transition: 'all 0.2s ease',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
      }}
    >
      {isLoading ? (
        <>
          <div
            style={{
              width: '12px',
              height: '12px',
              border: '1.5px solid rgba(245,166,35,0.3)',
              borderTopColor: '#f5a623',
              borderRadius: '50%',
              animation: 'spin 0.7s linear infinite',
            }}
            aria-hidden="true"
          />
          Signing out
        </>
      ) : (
        <>
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
          </svg>
          Sign out
        </>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  )
}
