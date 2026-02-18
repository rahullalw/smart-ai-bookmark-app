'use client'

import { useState } from 'react'
import type { Bookmark } from '@/types/database.types'
import toast from 'react-hot-toast'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkListProps {
  userId: string
}

export function BookmarkList({ userId }: BookmarkListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { bookmarks, loading: isLoading, deleteBookmark } = useBookmarks(userId)

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this bookmark?')) {
      return
    }

    setDeletingId(id)

    try {
      await deleteBookmark(id)
      toast.success('Bookmark deleted')
    } catch (error) {
      toast.error('Failed to delete bookmark')
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-200 h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 text-slate-300 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
        <h3 className="text-lg font-medium text-slate-700 mb-1">No bookmarks yet</h3>
        <p className="text-slate-500">Add your first bookmark to get started</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-slate-900 line-clamp-2 flex-1 pr-2">
              {bookmark.title}
            </h3>
            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deletingId === bookmark.id}
              className="text-slate-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
              aria-label={`Delete bookmark: ${bookmark.title}`}
            >
              {deletingId === bookmark.id ? (
                <div className="w-5 h-5 border-2 border-red-200 border-t-red-500 rounded-full animate-spin" aria-hidden="true" />
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              )}
            </button>
          </div>

          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-700 truncate block mb-3"
          >
            {bookmark.url}
          </a>

          <p className="text-xs text-slate-500">
            {new Date(bookmark.created_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      ))}
    </div>
  )
}
