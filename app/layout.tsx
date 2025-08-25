import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/components/providers/auth-provider'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Voluntaria+ | Conectando ONGs e Voluntários',
  description: 'Plataforma que conecta ONGs a voluntários para transformar comunidades através do trabalho voluntário.',
  keywords: ['voluntariado', 'ONG', 'voluntários', 'solidariedade', 'comunidade'],
  authors: [{ name: 'Voluntaria+' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  manifest: '/site.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Voluntaria+',
  },
  openGraph: {
    title: 'Voluntaria+ | Conectando ONGs e Voluntários',
    description: 'Transforme vidas através do voluntariado. Conecte-se com ONGs e faça a diferença na sua comunidade.',
    type: 'website',
    url: 'https://voluntariaplus.com',
    siteName: 'Voluntaria+',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Voluntaria+ - Conectando ONGs e Voluntários',
      },
    ],
    locale: 'pt_BR',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Voluntaria+ | Conectando ONGs e Voluntários',
    description: 'Transforme vidas através do voluntariado. Conecte-se com ONGs e faça a diferença na sua comunidade.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // Add your verification codes here when you have them
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Google tag (gtag.js) */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-17507836658"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17507836658');
          `}
        </Script>
      </head>
      <body className={`${inter.className} bg-white text-gray-900`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}