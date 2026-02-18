'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useBookmarks } from '@/hooks/useBookmarks'

interface BookmarkFormProps {
  userId: string
}

export function BookmarkForm({ userId }: BookmarkFormProps) {
  const [url, setUrl] = useState('')
  const [title, setTitle] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { addBookmark } = useBookmarks(userId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url.trim() || !title.trim()) {
      toast.error('Please fill in all fields')
      return
    }

    // Basic URL validation
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1.5">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="My Awesome Article"
          disabled={isLoading}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          aria-required="true"
        />
      </div>

      <div>
        <label htmlFor="url" className="block text-sm font-medium text-slate-700 mb-1.5">
          URL
        </label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          disabled={isLoading}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
          aria-required="true"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        aria-label={isLoading ? 'Adding bookmark' : 'Add bookmark'}
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
        ) : (
          <>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Bookmark
          </>
        )}
      </button>
    </form>
  )
}
