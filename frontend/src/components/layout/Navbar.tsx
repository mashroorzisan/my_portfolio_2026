import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LINKS = ['About','Skills','Projects','Experience','Contact']

export default function Navbar({ resumeUrl }: { resumeUrl?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const handleNav = (id: string) => {
    setOpen(false)
    if (!isHome) { window.location.href = `/#${id.toLowerCase()}`; return }
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 md:px-10 h-16 bg-bg/90 backdrop-blur-md transition-all duration-300 ${scrolled ? 'border-b border-border shadow-sm' : ''}`}>
      {/* Logo */}
      <Link to="/" className="font-serif text-2xl font-extrabold text-navy tracking-tight">
        IA<span className="text-coral">.</span>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {LINKS.map(l => (
          <li key={l}>
            <button
              onClick={() => handleNav(l)}
              className="text-sm font-medium text-mid hover:text-navy transition-colors relative group"
            >
              {l}
              <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-coral transition-all duration-300 group-hover:w-full" />
            </button>
          </li>
        ))}
      </ul>

      {/* Resume button */}
      {resumeUrl && (
        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="hidden md:inline-block font-mono text-xs border-[1.5px] border-navy text-navy px-4 py-1.5 rounded-md hover:bg-navy hover:text-bg transition-all duration-200"
        >
          Resume ↗
        </a>
      )}

      {/* Hamburger */}
      <button
        className="md:hidden flex flex-col gap-1.5 p-1"
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
      >
        <span className={`block w-5 h-0.5 bg-navy transition-all ${open ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-navy transition-all ${open ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-navy transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-bg border-b border-border shadow-lg px-8 py-6 flex flex-col gap-5">
          {LINKS.map(l => (
            <button key={l} onClick={() => handleNav(l)} className="text-left text-sm font-medium text-mid hover:text-navy">
              {l}
            </button>
          ))}
          {resumeUrl && (
            <a href={resumeUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-blue underline">
              Resume ↗
            </a>
          )}
        </div>
      )}
    </nav>
  )
}
