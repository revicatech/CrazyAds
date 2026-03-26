import { useEffect, useRef, useState, useCallback } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import '../cssComponents/Taglines.css'

const CLIENTS = [
  { abbr: 'NK', name: 'NovaBrand' },
  { abbr: 'PX', name: 'Pixelate Co.' },
  { abbr: 'RM', name: 'RedMark' },
  { abbr: 'AL', name: 'Alwan Group' },
  { abbr: 'ZN', name: 'Zenova' },
  { abbr: 'FX', name: 'FluxMedia' },
  { abbr: 'DW', name: 'Dawali' },
  { abbr: 'SP', name: 'Spark Labs' },
  { abbr: 'OR', name: 'Orion' },
  { abbr: 'HV', name: 'Hive Digital' },
]

const COUNTERS = [
  { target: 14,  suffix: '+', key: 'counter_years' },
  { target: 300, suffix: '+', key: 'counter_campaigns' },
  { target: 8,   suffix: '',  key: 'counter_markets' },
  { target: 47,  suffix: '',  key: 'counter_awards' },
]

function MarqueeStrip() {
  // Render items twice for seamless loop
  const items = [...CLIENTS, ...CLIENTS]
  return (
    <div className="clients-marquee">
      <div className="marquee-track">
        {items.map((c, i) => (
          <div key={i}>
            <div className="marquee-item">
              <div className="marquee-logo">{c.abbr}</div>
              <span className="marquee-name">{c.name}</span>
            </div>
            <div className="marquee-sep" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Taglines() {
  const { lang } = useLang()
  const sectionRef = useRef(null)
  const counterRef = useRef(null)
  const countedRef = useRef(false)
  const [activeLines, setActiveLines] = useState([false, false, false])
  const [counterStarted, setCounterStarted] = useState(false)
  const [counterValues, setCounterValues] = useState(COUNTERS.map(() => 0))

  // Tagline scroll activation — matches the HTML logic exactly
  const tickTags = useCallback(() => {
    const sec = sectionRef.current
    if (!sec) return
    const rect = sec.getBoundingClientRect()
    const prog = 1 - (rect.top / window.innerHeight)
    setActiveLines([
      prog >= 0.5 / 3,
      prog >= 1.5 / 3,
      prog >= 2.5 / 3,
    ])
  }, [])

  // Counter animation — matches the HTML requestAnimationFrame logic
  const animateCounters = useCallback(() => {
    if (countedRef.current) return
    countedRef.current = true
    setCounterStarted(true)

    const duration = 1200
    const startTime = performance.now()

    function step(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCounterValues(COUNTERS.map(c => Math.floor(progress * c.target)))
      if (progress < 1) {
        requestAnimationFrame(step)
      } else {
        setCounterValues(COUNTERS.map(c => c.target))
      }
    }
    requestAnimationFrame(step)
  }, [])

  const tickCounter = useCallback(() => {
    const el = counterRef.current
    if (!el || countedRef.current) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      animateCounters()
    }
  }, [animateCounters])

  useEffect(() => {
    window.addEventListener('scroll', tickTags, { passive: true })
    window.addEventListener('scroll', tickCounter, { passive: true })
    tickTags()
    tickCounter()
    return () => {
      window.removeEventListener('scroll', tickTags)
      window.removeEventListener('scroll', tickCounter)
    }
  }, [tickTags, tickCounter])

  const taglines = lang === 'ar'
    ? [
        { text: 'لا نتبع الاتجاهات —', red: null },
        { text: 'نحن نصنع ', red: 'الهوس.' },
        { text: 'علامتك تستحق ', red: 'الجنون.' },
      ]
    : [
        { text: "WE DON'T FOLLOW TRENDS —", red: null },
        { text: 'WE BUILD ', red: 'OBSESSIONS.' },
        { text: 'YOUR BRAND DESERVES ', red: 'CRAZY.' },
      ]

  return (
    <section className="taglines" id="taglines" ref={sectionRef}>

      {/* Top client marquee */}
      <MarqueeStrip />

      {/* Tagline text */}
      {taglines.map((line, i) => (
        <span
          key={i}
          className={`tagline-line${activeLines[i] ? ' active' : ''}`}
        >
          {line.text}
          {line.red && <span className="tred">{line.red}</span>}
        </span>
      ))}

      {/* Counters */}
      <div className="about-counter" ref={counterRef}>
        {COUNTERS.map((c, i) => (
          <div
            key={i}
            className={`counter-item${counterStarted ? ' active' : ''}`}
            style={{ transitionDelay: `${i * 0.1}s` }}
          >
            <div className="counter-num">
              {counterValues[i]}{c.suffix}
            </div>
            <div className="counter-label">{t(c.key, lang)}</div>
          </div>
        ))}
      </div>

    </section>
  )
}
