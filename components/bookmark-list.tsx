'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import type { Bookmark } from '@/types/database.types'
import toast from 'react-hot-toast'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkListProps {
  userId: string
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return ''
  }
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return url
  }
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.07,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.85,
    y: -10,
    transition: { duration: 0.25, ease: 'easeIn' },
  },
}

export function BookmarkList({ userId }: BookmarkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const { bookmarks, loading: isLoading, deleteBookmark } = useBookmarks(userId)

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this bookmark?')) return
    setDeletingId(id)
    try {
      await deleteBookmark(id)
      toast.success('Bookmark deleted')
    } catch {
      toast.error('Failed to delete bookmark')
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            style={{
              height: '140px',
              borderRadius: '16px',
              background: 'var(--bg-glass)',
              border: '1px solid var(--border-subtle)',
              animation: `pulse 1.5s ${i * 0.1}s ease-in-out infinite alternate`,
            }}
          />
        ))}
        <style>{`
          @keyframes pulse {
            from { opacity: 0.4; }
            to { opacity: 0.8; }
          }
        `}</style>
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          border: '1px dashed var(--border-subtle)',
          borderRadius: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '18px',
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <svg width="28" height="28" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
        </div>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 0.4rem' }}>
          No bookmarks yet
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0, fontFamily: 'var(--font-body)' }}>
          Add your first bookmark above to get started.
        </p>
      </motion.div>
    )
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
      <AnimatePresence mode="popLayout">
        {bookmarks.map((bookmark, i) => {
          const isHovered = hoveredId === bookmark.id
          const isDeleting = deletingId === bookmark.id
          const faviconUrl = getFaviconUrl(bookmark.url)
          const domain = getDomain(bookmark.url)

          return (
            <motion.div
              key={bookmark.id}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              layout
              whileHover={{ y: -4 }}
              onHoverStart={() => setHoveredId(bookmark.id)}
              onHoverEnd={() => setHoveredId(null)}
              style={{
                borderRadius: '16px',
                background: isHovered ? 'var(--bg-glass-hover)' : 'var(--bg-glass)',
                border: `1px solid ${isHovered ? 'var(--border-glass)' : 'var(--border-subtle)'}`,
                padding: '1.25rem',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: isHovered
                  ? '0 20px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(245,166,35,0.08)'
                  : '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Amber shimmer line on hover */}
              <motion.div
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '2px',
                  background: 'linear-gradient(90deg, transparent, #f5a623, transparent)',
                  borderRadius: '16px 16px 0 0',
                }}
                aria-hidden="true"
              />

              {/* Card header: favicon + title + delete */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.875rem' }}>
                {/* Favicon */}
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    overflow: 'hidden',
                  }}
                >
                  {faviconUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={faviconUrl}
                      alt=""
                      width={20}
                      height={20}
                      style={{ objectFit: 'contain' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                  ) : (
                    <svg width="16" height="16" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                    </svg>
                  )}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    margin: 0,
                    flex: 1,
                    lineHeight: 1.3,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {bookmark.title}
                </h3>

                {/* Delete button */}
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(bookmark.id)
                  }}
                  disabled={isDeleting}
                  animate={{ opacity: isHovered || isDeleting ? 1 : 0 }}
                  transition={{ duration: 0.15 }}
                  aria-label={`Delete bookmark: ${bookmark.title}`}
                  style={{
                    width: '30px',
                    height: '30px',
                    borderRadius: '8px',
                    border: '1px solid var(--red-soft)',
                    background: 'var(--red-soft)',
                    color: 'var(--red-accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: isDeleting ? 'not-allowed' : 'pointer',
                    flexShrink: 0,
                    padding: 0,
                    transition: 'background 0.15s ease',
                  }}
                >
                  {isDeleting ? (
                    <div
                      style={{
                        width: '12px',
                        height: '12px',
                        border: '1.5px solid rgba(239,68,68,0.3)',
                        borderTopColor: '#ef4444',
                        borderRadius: '50%',
                        animation: 'spin 0.7s linear infinite',
                      }}
                      aria-hidden="true"
                    />
                  ) : (
                    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                    </svg>
                  )}
                </motion.button>
              </div>

              {/* URL link */}
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.8rem',
                  color: isHovered ? 'var(--accent)' : 'var(--text-secondary)',
                  textDecoration: 'none',
                  marginBottom: '0.75rem',
                  transition: 'color 0.2s ease',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                }}
              >
                <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                </svg>
                {domain}
              </a>

              {/* Date */}
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', margin: 0, fontFamily: 'var(--font-body)' }}>
                {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
