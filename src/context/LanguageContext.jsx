import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')
  const isAr = lang === 'ar'

  useEffect(() => {
    // Suppress all CSS transitions while the dir attribute flips,
    // so the layout change is instant instead of visibly sliding.
    const style = document.createElement('style')
    style.textContent = '*, *::before, *::after { transition: none !important; }'
    document.head.appendChild(style)

    document.documentElement.lang = lang
    document.documentElement.dir  = isAr ? 'rtl' : 'ltr'

    // Force a reflow so the new layout is painted without transitions,
    // then remove the override on the next frame to restore animations.
    document.body.offsetHeight // eslint-disable-line no-unused-expressions
    requestAnimationFrame(() => {
      document.head.removeChild(style)
    })
  }, [lang, isAr])

  function toggleLang() {
    setLang(prev => prev === 'en' ? 'ar' : 'en')
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, isAr }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside <LanguageProvider>')
  return ctx
}
