import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from '@/components/providers/auth-provider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Voluntaria+ | Conectando ONGs e Voluntários',
  description: 'Plataforma que conecta ONGs a voluntários para transformar comunidades através do trabalho voluntário.',
  keywords: ['voluntariado', 'ONG', 'voluntários', 'solidariedade', 'comunidade'],
  authors: [{ name: 'Voluntaria+' }],
  openGraph: {
    title: 'Voluntaria+ | Conectando ONGs e Voluntários',
    description: 'Transforme vidas através do voluntariado. Conecte-se com ONGs e faça a diferença na sua comunidade.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}