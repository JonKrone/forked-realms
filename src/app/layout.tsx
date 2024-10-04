import { Navbar } from '@/components/Navbar'
import { UsernameModal } from '@/components/UsernameModal'
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'Forked Realms',
  description:
    'Create and explore an evolving story with AI-generated options and user contributions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`box-border ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <UsernameModal />
        <Navbar />
      </body>
    </html>
  )
}
