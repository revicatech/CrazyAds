import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useScrollProgress } from '../../hooks/useScrollProgress'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import MobileMenu from './MobileMenu'
import Button from '../ui/Button'

const NAV_LINKS = [
  { key: 'nav_services',  to: '/services'      },
  { key: 'nav_portfolio', to: '/portfolio'     },
  { key: 'nav_industries', to: '/industries'   },
  { key: 'nav_cases',     to: '/case-studies'  },
  { key: 'nav_about',     to: '/about'         },
]

export default function Navbar() {
  const { navbarVisible } = useScrollProgress()
  const { lang, toggleLang, isAr } = useLang()
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const showSolid = !isHome || navbarVisible

  return (
    <>
      <header
        dir="ltr"
        className={`
          fixed top-0 left-0 right-0 z-40
          transition-[background-color,box-shadow] duration-500
          ${showSolid
            ? 'bg-black/70 backdrop-blur-md shadow-lg'
            : 'bg-transparent'}
        `}
      >
        <nav className="max-w-[1400px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="font-display text-2xl tracking-widest text-white">
            CRAZY<span className="text-brand-red">ADS</span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden xl:flex items-center gap-8 list-none">
            {NAV_LINKS.map(({ key, to }) => (
              <li key={key}>
                <Link to={to} className={`text-sm font-medium tracking-wide transition-colors ${pathname === to ? 'text-white' : 'text-white/80 hover:text-white'}`}>
                  {t(key, lang)}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="text-white/70 hover:text-white text-sm font-medium tracking-widest transition-colors border border-white/20 px-3 py-1.5 rounded-full"
            >
              {isAr ? 'EN' : 'AR'}
            </button>

            {/* CTA — desktop */}
            <a
              href="/#contact-cta"
              className="hidden xl:inline-flex items-center bg-brand-red text-white px-5 py-2 rounded-full text-sm font-semibold tracking-wide hover:bg-red-700 transition-colors"
            >
              {t('nav_cta', lang)}
            </a>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="xl:hidden flex flex-col gap-[5px] p-2"
              aria-label="Open menu"
            >
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-6 h-0.5 bg-white" />
              <span className="block w-4   h-0.5 bg-white" />
            </button>
          </div>
        </nav>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}
