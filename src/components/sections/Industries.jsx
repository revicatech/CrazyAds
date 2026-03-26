import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { INDUSTRIES } from '../../data/industries'
import '../cssComponents/Industries.css'

const CARD_COUNT = INDUSTRIES.length
const ANGLE_STEP = 360 / CARD_COUNT // 45deg per card

export default function Industries() {
  const { lang } = useLang()
  const { ref: sectionRef, isVisible: sectionVisible } = useRevealOnScroll(0.05)
  const [currentAngle, setCurrentAngle] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isExpanded] = useState(false)
  const autoPlayRef = useRef(null)
  const touchStartRef = useRef(0)

  // Derive active index from angle
  useEffect(() => {
    const normalized = (((-currentAngle % 360) + 360) % 360)
    const idx = Math.round(normalized / ANGLE_STEP) % CARD_COUNT
    setActiveIndex(idx)
  }, [currentAngle])

  // Auto-rotation
  useEffect(() => {
    if (isPaused || isExpanded || !sectionVisible) {
      clearInterval(autoPlayRef.current)
      return
    }
    autoPlayRef.current = setInterval(() => {
      setCurrentAngle(prev => prev - ANGLE_STEP)
    }, 3500)
    return () => clearInterval(autoPlayRef.current)
  }, [isPaused, isExpanded, sectionVisible])

  const goNext = useCallback(() => {
    setCurrentAngle(prev => prev - ANGLE_STEP)
  }, [])

  const goPrev = useCallback(() => {
    setCurrentAngle(prev => prev + ANGLE_STEP)
  }, [])

  const goToCard = useCallback((index) => {
    setCurrentAngle(-index * ANGLE_STEP)
  }, [])

  // Touch / swipe support
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = e.touches[0].clientX
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const diff = touchStartRef.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev()
    }
  }, [goNext, goPrev])

  // Keyboard
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft') goPrev()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [goNext, goPrev])

  const activeInd = INDUSTRIES[activeIndex]

  return (
    <section
      ref={sectionRef}
      className={`ind-theater${sectionVisible ? ' ind-theater--visible' : ''}`}
      id="industries"
    >
      {/* Background effects */}
      <div className="ind-theater-bg">
        <div className="ind-theater-grid" />
        <div className="ind-theater-glow" />
        <div className="ind-theater-spotlight" />
      </div>

      {/* Header */}
      <div className="ind-theater-header">
        <div className="ind-theater-eyebrow">
          <span />{t('label_industries', lang)}<span />
        </div>
        <h2 className="ind-theater-title">
          {lang === 'ar' ? 'القطاعات التي' : 'Industries We'}
          <em>{lang === 'ar' ? ' نخدمها' : ' Dominate'}</em>
        </h2>
      </div>

      {/* 3D Theater Stage */}
      <div
        className="ind-stage"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* The spinning drum */}
        <div
          className="ind-drum"
          style={{ transform: `rotateY(${currentAngle}deg)` }}
        >
          {INDUSTRIES.map((ind, i) => {
            const angle = i * ANGLE_STEP
            return (
              <div
                key={ind.id}
                className={`ind-panel${i === activeIndex ? ' ind-panel--active' : ''}`}
                style={{
                  transform: `rotateY(${angle}deg) translateZ(var(--drum-radius))`,
                }}
                onClick={() => goToCard(i)}
              >
                <div className="ind-panel-img">
                  <img src={ind.image} alt={lang === 'ar' ? ind.nameAr : ind.name} loading="lazy" />
                </div>
                <div className="ind-panel-overlay" />
                <div className="ind-panel-shine" />
                <div className="ind-panel-edge" />

                <div className="ind-panel-content">
                  <span className="ind-panel-num">{String(i + 1).padStart(2, '0')}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Center floating title inside the drum */}
        <div className="ind-stage-center">
          <div className="ind-stage-ring" />
          <div className="ind-stage-ring ind-stage-ring--2" />
        </div>

        {/* Navigation arrows */}
        <button className="ind-nav ind-nav--prev" onClick={goPrev} aria-label="Previous industry">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button className="ind-nav ind-nav--next" onClick={goNext} aria-label="Next industry">
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>

      {/* Active card detail panel */}
      <div className={`ind-detail${isExpanded ? ' ind-detail--expanded' : ''}`}>
        <div className="ind-detail-inner" key={activeIndex}>
          <div className="ind-detail-left">
            <span className="ind-detail-num">{String(activeIndex + 1).padStart(2, '0')}</span>
            <h3 className="ind-detail-name">{lang === 'ar' ? activeInd.nameAr : activeInd.name}</h3>
            <p className="ind-detail-headline">{activeInd.headlineEn}</p>
          </div>
          <div className="ind-detail-right">
            <p className="ind-detail-desc">{lang === 'ar' ? activeInd.descAr : activeInd.descEn}</p>
            <div className="ind-detail-tags">
              {activeInd.services.map(s => (
                <span key={s} className="ind-detail-tag">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="ind-dots">
        {INDUSTRIES.map((_, i) => (
          <button
            key={i}
            className={`ind-dot${i === activeIndex ? ' ind-dot--active' : ''}`}
            onClick={() => goToCard(i)}
            aria-label={`Go to industry ${i + 1}`}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="ind-theater-stats">
        {[
          { num: '8', label: lang === 'ar' ? 'قطاعات' : 'Sectors' },
          { num: '4', label: lang === 'ar' ? 'دول' : 'Countries' },
          { num: '300+', label: lang === 'ar' ? 'حملة' : 'Campaigns' },
          { num: '100%', label: lang === 'ar' ? 'شغف' : 'Passion' },
        ].map(s => (
          <div key={s.num} className="ind-theater-stat">
            <div className="ind-theater-stat-num">{s.num}</div>
            <div className="ind-theater-stat-label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
