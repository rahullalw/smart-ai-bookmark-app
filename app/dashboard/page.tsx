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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
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
              </div>
              <h1 className="ml-3 text-xl font-bold text-slate-900">
                Smart Bookmarks
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-sm text-slate-600">
                {user.email}
              </div>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Add Bookmark Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Add New Bookmark
          </h2>
          <BookmarkForm userId={user.id} />
        </div>

        {/* Bookmarks List Section */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Your Bookmarks
          </h2>
          <BookmarkList userId={user.id} />
        </div>
      </main>
    </div>
  )
}
