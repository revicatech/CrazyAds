import { useEffect, useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { fetchSiteContent } from '../../services/api'
import ParticleCanvas from '../animations/ParticleCanvas'
import '../cssComponents/Hero.css'
const DEFAULTS = {
  hero_title: 'CRAZY ADS',
  hero_video_url: '/video.mp4',
  hero_poster_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920',
}

export default function Hero() {
  const { lang } = useLang()
  const [hintHidden, setHintHidden] = useState(false)
  const [sc, setSc] = useState(DEFAULTS)

  useEffect(() => {
    fetchSiteContent('hero').then((data) => setSc({ ...DEFAULTS, ...data })).catch(() => {})
  }, [])

  useEffect(() => {
    function onScroll() {
      setHintHidden(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const title = (sc.hero_title || 'CRAZY ADS').split(' ')
  const eyebrow = sc[`hero_eyebrow_${lang}`] || t('hero_eyebrow', lang)
  const sub = sc[`hero_sub_${lang}`] || t('hero_sub', lang)

  return (
    <div className="hero-clip">
      <section className={`hero${lang === 'ar' ? ' lang-ar' : ''}`} id="hero">

        {/* Video background */}
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline poster={sc.hero_poster_url}>
            <source src={sc.hero_video_url} type="video/mp4" />
          </video>
        </div>

        {/* Overlays */}
        <div className="ov ov-vignette" />
        <div className="ov ov-bottom" />
        <div className="ov ov-left" />

        {/* Particles */}
        <ParticleCanvas />

        {/* Main content */}
        <div className="hero-content">
          <div className="hero-eyebrow">— {eyebrow}</div>
          <h1 className="hero-title">
            {title[0]}<br />
            <span className="accent-line">{title.slice(1).join(' ')}</span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-sub" dangerouslySetInnerHTML={{ __html: sub }} />
            <div className="hero-scroll">
              <div className="hero-scroll-line" />
              {t('hero_scroll', lang)}
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={`scroll-hint${hintHidden ? ' hidden' : ''}`}>
          <div className="mouse">
            <div className="wheel" />
          </div>
          <span>{t('hero_scroll_hint', lang)}</span>
        </div>

        {/* Red accent line */}
        <div className="redline" />

      </section>
    </div>
  )
}
