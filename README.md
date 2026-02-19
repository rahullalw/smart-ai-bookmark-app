# Smart Bookmarks

A modern, visually stunning bookmark manager designed to help you organize your digital life. Built with Next.js and Supabase, it provides real-time synchronization across devices, ensuring your collection is always up to date.

## Features

- **Real-time Sync**: Instant updates across all connected devices using Supabase Realtime.
- **Secure Authentication**: Robust user management and route protection via Supabase Auth.
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile.
- **Interactive Elements**: Smooth hover effects, transitions, and meaningful micro-interactions using Framer Motion.

## Tech Stack

- **Frontend Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Backend & Database**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)


## Challenges & Solutions

### Real-time Communication
One of the key technical hurdles we faced was implementing reliable real-time updates. Initially, we used the standard **broadcast channel subscribe method** to listen for changes. However, this approach resulted in persistent `CHANNEL_ERROR` responses, preventing clients from receiving updates.

**Solution**: We shifted our strategy to leverage the power of **Supabase Database Triggers**. Instead of relying solely on client-side broadcasting, we set up triggers directly in the Supabase dashboard. This allows the database to automatically capture `INSERT`, `UPDATE`, and `DELETE` events and broadcast them to subscribed clients. This server-side approach eliminated the connection errors and provided a robust, lag-free synchronization experience.

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or bun
- A Supabase project (for database and auth)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/smart-ai-bookmark-app.git
    cd smart-ai-bookmark-app
    ```

2.  **Install dependencies**
    ```bash
    npm install
    # or
    yarn install
    # or
    bun install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory:
    ```bash
    cp .env.example .env.local
    ```
    Add your Supabase credentials:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
    > Note: You can find these keys in your Supabase Project Settings > API.

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the application**
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the app.
