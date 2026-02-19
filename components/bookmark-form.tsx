'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkFormProps {
  userId: string
}

export function BookmarkForm({ userId }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const { addBookmark } = useBookmarks(userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim() || !title.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      new URL(url)
    } catch {
      toast.error('Please enter a valid URL')
      return
    }

    setIsLoading(true)

    try {
      await addBookmark(url, title)
      toast.success('Bookmark added!')
      setUrl('')
      setTitle('')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add bookmark')
    } finally {
      setIsLoading(false)
    }
  }

  const inputStyle = (field: string) => ({
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '12px',
    border: `1px solid ${focusedField === field ? 'rgba(245,166,35,0.5)' : 'var(--border-subtle)'}`,
    background: focusedField === field ? 'rgba(245,166,35,0.04)' : 'var(--bg-glass)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.9rem',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxShadow: focusedField === field ? '0 0 0 3px rgba(245,166,35,0.1)' : 'none',
    opacity: isLoading ? 0.6 : 1,
  })

  const labelStyle = {
    display: 'block',
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.07em',
    marginBottom: '0.5rem',
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <div>
          <label htmlFor="title" style={labelStyle}>Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onFocus={() => setFocusedField('title')}
            onBlur={() => setFocusedField(null)}
            placeholder="My Awesome Article"
            disabled={isLoading}
            style={inputStyle('title')}
            aria-required="true"
          />
        </div>
        <div>
          <label htmlFor="url" style={labelStyle}>URL</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setFocusedField('url')}
            onBlur={() => setFocusedField(null)}
            placeholder="https://example.com"
            disabled={isLoading}
            style={inputStyle('url')}
            aria-required="true"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.97 }}
        aria-label={isLoading ? 'Adding bookmark' : 'Add bookmark'}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.75rem',
          borderRadius: '12px',
          border: 'none',
          background: isLoading
            ? 'rgba(245,166,35,0.4)'
            : 'linear-gradient(135deg, #f5a623 0%, #f7c56a 100%)',
          color: '#0d0f14',
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: isLoading ? 'not-allowed' : 'pointer',
          boxShadow: isLoading ? 'none' : '0 4px 20px rgba(245,166,35,0.3)',
          transition: 'background 0.2s ease, box-shadow 0.2s ease',
          letterSpacing: '0.01em',
        }}
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(13,15,20,0.3)',
                borderTopColor: '#0d0f14',
                borderRadius: '50%',
                animation: 'spin 0.7s linear infinite',
              }}
              aria-hidden="true"
            />
            Saving...
          </>
        ) : (
          <>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 4v16m8-8H4" />
            </svg>
            Save Bookmark
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </motion.button>
    </form>
  )
}
