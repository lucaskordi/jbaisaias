import React from 'react'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ford Ka - Isaias JBA',
  description: 'Lucas Kordi + JBA + Isaias'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="h-screen overflow-hidden bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}

