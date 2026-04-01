import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'

const NAV_LINKS = [
  { key: 'nav_services',    to: '/services'     },
  { key: 'nav_portfolio',   to: '/portfolio'    },
  { key: 'nav_industries',  to: '/industries'   },
  { key: 'nav_cases',       to: '/case-studies' },
  { key: 'nav_about',       to: '/about'        },
]

export default function MobileMenu({ open, onClose }) {
  const { lang, toggleLang, isAr } = useLang()

  // Close on Escape key
  useEffect(() => {
    if (!open) return
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-brand-dark flex flex-col
        transition-transform duration-500 ease-in-out
        ${open ? 'translate-x-0' : isAr ? '-translate-x-full' : 'translate-x-full'}
      `}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 h-16 border-b border-white/10">
        <span className="font-display text-2xl text-white tracking-widest">
          CRAZY<span className="text-brand-red">ADS</span>
        </span>
        <button
          onClick={onClose}
          className="text-white/70 hover:text-white text-2xl leading-none"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Links */}
      <nav className="flex-1 flex flex-col justify-center px-8 gap-6">
        {NAV_LINKS.map(({ key, to }) => (
          <Link
            key={key}
            to={to}
            onClick={onClose}
            className="font-display text-5xl text-white/80 hover:text-white transition-colors tracking-wider"
          >
            {t(key, lang)}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-8 pb-10 flex items-center justify-between">
        <a
          href="/#contact-cta"
          onClick={onClose}
          className="bg-brand-red text-white px-6 py-3 rounded-full font-semibold"
        >
          {t('nav_cta', lang)}
        </a>
        <button
          onClick={toggleLang}
          className="text-white/60 hover:text-white text-sm tracking-widest border border-white/20 px-4 py-2 rounded-full transition-colors"
        >
          {isAr ? 'English' : 'العربية'}
        </button>
      </div>
    </div>
  )
}
