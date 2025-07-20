import './globals.css'
import { Analytics } from '@vercel/analytics/next'

export const metadata = {
  title: 'Joshua Lossner - Software Engineer',
  description: 'Professional portfolio and resume for Joshua Lossner',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}