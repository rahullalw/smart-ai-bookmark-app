import type { Metadata } from "next";
import { Toaster } from 'react-hot-toast'
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Bookmarks — Save & Sync Your Links",
  description: "A beautiful bookmark manager with real-time sync across all your devices.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#1a1e2a',
              color: '#f0f2f8',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '12px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
            },
            success: {
              iconTheme: {
                primary: '#f5a623',
                secondary: '#1a1e2a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#1a1e2a',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
