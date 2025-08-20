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
        {/* Vercel Web Analytics: see requests to /_vercel/insights/view after deploy */}
        <Analytics />
      </body>
    </html>
  )
}
