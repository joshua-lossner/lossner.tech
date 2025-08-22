'use client'

import Link from 'next/link'
import BackButton from './BackButton'

export default function FooterNav() {
  return (
    <div className="px-8 py-2 flex items-center gap-2">
      <BackButton />
      <div className="flex-1"></div>
      <Link
        href="/"
        className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
      >
        MENU
      </Link>
      <Link
        href="/help"
        className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm ml-2"
      >
        HELP
      </Link>
    </div>
  )
}

