'use client'

import Link from 'next/link'
import BackButton from './BackButton'

interface FooterNavProps {
  onBack?: () => void
  onMenu?: () => void
  onHelp?: () => void
  backLabel?: string
  backHref?: string
}

export default function FooterNav({ onBack, onMenu, onHelp, backLabel, backHref }: FooterNavProps) {
  const menuLabel = (
    <>
      <span className="underline">M</span>ENU
    </>
  )

  const helpLabel = (
    <>
      <span className="underline">H</span>ELP
    </>
  )

  return (
    <div className="px-8 py-2 flex items-center gap-2">
      <BackButton onBack={onBack} label={backLabel} href={backHref} />
      <div className="flex-1"></div>
      {onMenu ? (
        <button
          onClick={onMenu}
          aria-label="MENU"
          title="MENU"
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
        >
          {menuLabel}
        </button>
      ) : (
        <Link
          href="/"
          aria-label="MENU"
          title="MENU"
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm"
        >
          {menuLabel}
        </Link>
      )}
      {onHelp ? (
        <button
          onClick={onHelp}
          aria-label="HELP"
          title="HELP"
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm ml-2"
        >
          {helpLabel}
        </button>
      ) : (
        <Link
          href="/help"
          aria-label="HELP"
          title="HELP"
          className="px-4 py-1 border border-terminal-green bg-black text-terminal-green hover:bg-terminal-green hover:text-black transition-all duration-200 font-mono text-sm ml-2"
        >
          {helpLabel}
        </Link>
      )}
    </div>
  )
}

