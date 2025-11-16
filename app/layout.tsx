import React from 'react'
import './globals.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="h-screen overflow-hidden bg-slate-950 text-white antialiased">
        {children}
      </body>
    </html>
  )
}

