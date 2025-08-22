'use client'

import { usePathname, useRouter } from 'next/navigation'

const KNOWN_SECTIONS = ['experience', 'skills', 'projects', 'education', 'journal', 'about'] as const

type Section = typeof KNOWN_SECTIONS[number]

export default function BackButton() {
  const pathname = usePathname()
  const router = useRouter()
  if (pathname === '/') return null

  const segments = pathname.split('/').filter(Boolean)
  const section = segments[0] as Section | undefined
  const depth = segments.length

  let label = 'BACK TO MENU'
  let href = '/'

  if (section && (KNOWN_SECTIONS as readonly string[]).includes(section)) {
    if (depth > 1) {
      label = `BACK TO ${section.toUpperCase()} MENU`
      href = `/${section}`
    }
  }

  return (
    <button
      onClick={() => router.push(href)}
      aria-label={label}
      title={label}
      className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
    >
      {label}
    </button>
  )
}

