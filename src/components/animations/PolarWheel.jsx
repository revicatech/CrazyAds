import { useRef, useCallback, useEffect } from 'react'
import { gsap } from 'gsap'
import { usePolarCarousel } from '../../hooks/usePolarCarousel'
import { SERVICES } from '../../data/services'
import { SERVICE_SVGS } from '../../data/serviceSvgs'
import { useLang } from '../../context/LanguageContext'

const RADIUS = 900
const SPREAD = 360 / SERVICES.length

const SHADOW_NORMAL = '0 2px 8px rgba(0,0,0,.06),0 8px 32px rgba(0,0,0,.07),0 24px 64px rgba(0,0,0,.05),inset 0 0 0 1px rgba(0,0,0,.06)'
const SHADOW_HOVER  = '0 4px 12px rgba(0,0,0,.10),0 16px 48px rgba(0,0,0,.12),0 40px 80px rgba(0,0,0,.08),inset 0 0 0 1px rgba(0,0,0,.10)'

export default function PolarWheel() {
  const { lang } = useLang()
  const outerRefs = useRef([])
  const stageRef  = useRef(null)

  const onFrame = useCallback((theta) => {
    SERVICES.forEach((_, i) => {
      const el = outerRefs.current[i]
      if (!el) return

      const angle   = ((i * SPREAD + theta) % 360) * (Math.PI / 180)
      const x       = Math.cos(angle) * RADIUS
      const y       = Math.sin(angle) * RADIUS * 0.28
      const depth   = Math.sin(angle)
      const scale   = 0.55 + 0.45 * ((depth + 1) / 2)
      const opacity = 0.35 + 0.65 * ((depth + 1) / 2)
      const zIndex  = Math.round((depth + 1) * 10)

      el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
      el.style.opacity   = opacity
      el.style.zIndex    = zIndex
    })
  }, [])

  const wheelRef = usePolarCarousel(SERVICES.length, onFrame)

  useEffect(() => {
    const cards = outerRefs.current.filter(Boolean)
    gsap.from(cards, {
      scale: 0.1, opacity: 0, duration: 1.2,
      stagger: 0.07, ease: 'back.out(1.4)', delay: 0.3,
    })
  }, [])

  function setRefs(el) {
    stageRef.current = el
    wheelRef.current = el
  }

  return (
    /* Viewport — clips the ring, shows gradient fade masks on edges */
    <div className="relative w-full overflow-hidden select-none" style={{ height: 480 }}>

      {/* Left fade */}
      <div className="absolute left-0 top-0 h-full z-30 pointer-events-none"
           style={{ width: 180, background: 'linear-gradient(to right,#fff,transparent)' }} />
      {/* Right fade */}
      <div className="absolute right-0 top-0 h-full z-30 pointer-events-none"
           style={{ width: 180, background: 'linear-gradient(to left,#fff,transparent)' }} />

      {/* Stage — drag target */}
      <div ref={setRefs} className="absolute inset-0 cursor-grab active:cursor-grabbing"
           style={{ touchAction: 'none' }}>

        {SERVICES.map((svc, i) => (
          /* Outer: RAF controls position + depth scale */
          <div
            key={svc.id}
            ref={el => (outerRefs.current[i] = el)}
            className="absolute"
            style={{ top: '50%', left: '50%', willChange: 'transform, opacity' }}
          >
            {/* Inner: polaroid card + GSAP hover */}
            <div
              onMouseEnter={e => gsap.to(e.currentTarget, {
                scale: 1.09, boxShadow: SHADOW_HOVER, duration: 0.35, ease: 'power2.out',
              })}
              onMouseLeave={e => gsap.to(e.currentTarget, {
                scale: 1, boxShadow: SHADOW_NORMAL, duration: 0.55, ease: 'elastic.out(1,0.55)',
              })}
              style={{
                width: 340,
                background: '#fff',
                padding: '10px 10px 62px',
                borderRadius: 1,
                boxShadow: SHADOW_NORMAL,
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              {/* SVG image area */}
              <div style={{ width: '100%', aspectRatio: '1/0.62', overflow: 'hidden', borderRadius: 1 }}>
                {SERVICE_SVGS[i]({ uid: `w${i}` })}
              </div>

              {/* Bottom label strip */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                height: 62, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4, padding: '0 12px',
                borderTop: '1px solid rgba(0,0,0,.06)',
              }}>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 10, color: 'rgba(0,0,0,.3)',
                  letterSpacing: '0.3em', lineHeight: 1,
                }}>
                  {svc.num}
                </span>
                <span style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 19, color: '#111',
                  letterSpacing: '0.04em', lineHeight: 1,
                  textAlign: 'center',
                }}>
                  {lang === 'ar' ? svc.ar : svc.en}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
