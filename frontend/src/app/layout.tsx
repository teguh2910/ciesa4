import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'] });

// Separate viewport export (Next.js 14+ requirement)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'JSON Response Generator',
    template: '%s | JSON Response Generator',
  },
  description: 'Generate and send JSON responses for Indonesian customs/import API endpoints',
  keywords: ['JSON', 'API', 'Indonesian customs', 'import', 'export', 'customs declaration'],
  authors: [{ name: 'JSON Response Generator Team' }],
  robots: 'index, follow',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'JSON Response Generator',
    description: 'Generate and send JSON responses for Indonesian customs/import API endpoints',
    type: 'website',
    locale: 'en_US',
    siteName: 'JSON Response Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Response Generator',
    description: 'Generate and send JSON responses for Indonesian customs/import API endpoints',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full flex flex-col bg-gray-50`}>
        <Navbar />
        
        <main className="flex-1">
          {children}
        </main>
        
        <Footer />
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10B981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
