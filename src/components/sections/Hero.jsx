import { useEffect, useState } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import ParticleCanvas from '../animations/ParticleCanvas'
import '../cssComponents/Hero.css'

export default function Hero() {
  const { lang } = useLang()
  const [hintHidden, setHintHidden] = useState(false)

  useEffect(() => {
    function onScroll() {
      setHintHidden(window.scrollY > 60)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="hero-clip">
      <section className={`hero${lang === 'ar' ? ' lang-ar' : ''}`} id="hero">

        {/* Video background */}
        <div className="hero-video-wrap">
          <video autoPlay muted loop playsInline
            poster="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1920">
            <source src="video.mp4" type="video/mp4" />
            <source src="https://videos.pexels.com/video-files/1851190/1851190-hd_1920_1080_25fps.mp4" type="video/mp4" />
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
          <div className="hero-eyebrow">— {t('hero_eyebrow', lang)}</div>
          <h1 className="hero-title">
            CRAZY<br />
            <span className="accent-line">ADS</span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-sub" dangerouslySetInnerHTML={{ __html: t('hero_sub', lang) }} />
            <div className="hero-scroll">
              <div className="hero-scroll-line" />
              {t('hero_scroll', lang)}
            </div>
          </div>
        </div>

        {/* Stats bar */}
        {/* <div className="hero-stats">
          <div className="stat">
            <div className="stat-n">150<em>+</em></div>
            <div className="stat-l">{t('hero_campaigns', lang)}</div>
          </div>
          <div className="stat-div" />
          <div className="stat">
            <div className="stat-n">45<em>M</em></div>
            <div className="stat-l">{t('hero_reach', lang)}</div>
          </div>
        </div> */}

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
