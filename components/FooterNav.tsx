'use client'

import Link from 'next/link'
import BackButton from './BackButton'

interface FooterNavProps {
  onBack?: () => void
  onMenu?: () => void
  onHelp?: () => void
}

export default function FooterNav({ onBack, onMenu, onHelp }: FooterNavProps) {
  return (
    <div className="px-8 py-2 flex items-center gap-2">
      <BackButton onBack={onBack} />
      <div className="flex-1"></div>
      {onMenu ? (
        <button
          onClick={onMenu}
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
        >
          MENU
        </button>
      ) : (
        <Link
          href="/"
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
        >
          MENU
        </Link>
      )}
      {onHelp ? (
        <button
          onClick={onHelp}
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm ml-2"
        >
          HELP
        </button>
      ) : (
        <Link
          href="/help"
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm ml-2"
        >
          HELP
        </Link>
      )}
    </div>
  )
}

