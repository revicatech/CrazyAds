import { useEffect, useRef, useState, useCallback } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { fetchSiteContent } from '../../services/api'
import '../cssComponents/Taglines.css'

const DEFAULT_CLIENTS = [
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

const DEFAULT_COUNTERS = [
  { target: 14,  suffix: '+', key: 'counter_years' },
  { target: 300, suffix: '+', key: 'counter_campaigns' },
  { target: 8,   suffix: '',  key: 'counter_markets' },
  { target: 47,  suffix: '',  key: 'counter_awards' },
]

function MarqueeStrip({ clients }) {
  const items = [...clients, ...clients]
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
  const [counterValues, setCounterValues] = useState(DEFAULT_COUNTERS.map(() => 0))
  const [sc, setSc] = useState({})
  const countersRef = useRef(DEFAULT_COUNTERS)

  // Fetch site content
  useEffect(() => {
    Promise.all([
      fetchSiteContent('taglines'),
      fetchSiteContent('counters'),
      fetchSiteContent('clients'),
    ]).then(([taglines, counters, clients]) => {
      setSc({ ...taglines, ...counters, ...clients })
      // Update counters ref for animation
      countersRef.current = [
        { target: Number(counters.counter_years_value ?? 14), suffix: counters.counter_years_suffix ?? '+', key: 'counter_years' },
        { target: Number(counters.counter_campaigns_value ?? 300), suffix: counters.counter_campaigns_suffix ?? '+', key: 'counter_campaigns' },
        { target: Number(counters.counter_markets_value ?? 8), suffix: counters.counter_markets_suffix ?? '', key: 'counter_markets' },
        { target: Number(counters.counter_awards_value ?? 47), suffix: counters.counter_awards_suffix ?? '', key: 'counter_awards' },
      ]
      setCounterValues(countersRef.current.map(() => 0))
      countedRef.current = false
    }).catch(() => {})
  }, [])

  const animateCounters = useCallback(() => {
    if (countedRef.current) return
    countedRef.current = true
    setCounterStarted(true)
    const duration = 1200
    const startTime = performance.now()
    const targets = countersRef.current
    function step(timestamp) {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCounterValues(targets.map(c => Math.floor(progress * c.target)))
      if (progress < 1) requestAnimationFrame(step)
      else setCounterValues(targets.map(c => c.target))
    }
    requestAnimationFrame(step)
  }, [])

  const tickTags = useCallback(() => {
    const sec = sectionRef.current
    if (!sec) return
    const rect = sec.getBoundingClientRect()
    const prog = 1 - (rect.top / window.innerHeight)
    setActiveLines([prog >= 0.5 / 3, prog >= 1.5 / 3, prog >= 2.5 / 3])
  }, [])

  const tickCounter = useCallback(() => {
    const el = counterRef.current
    if (!el || countedRef.current) return
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) animateCounters()
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

  const clients = Array.isArray(sc.client_list) && sc.client_list.length > 0 ? sc.client_list : DEFAULT_CLIENTS

  const splitArLine = (text) => {
    const i = text.lastIndexOf(' ')
    return i >= 0
      ? { text: text.slice(0, i + 1), red: text.slice(i + 1) }
      : { text, red: null }
  }

  const arLine2 = sc.tagline_2_ar || 'نحن نصنع الهوس.'
  const arLine3 = sc.tagline_3_ar || 'علامتك تستحق الجنون.'

  const taglines = lang === 'ar'
    ? [
        { text: sc.tagline_1_ar || 'لا نتبع الاتجاهات —', red: null },
        splitArLine(arLine2),
        splitArLine(arLine3),
      ]
    : [
        { text: sc.tagline_1_en || "WE DON'T FOLLOW TRENDS —", red: null },
        { text: 'WE BUILD ', red: (sc.tagline_2_en || 'WE BUILD OBSESSIONS.').replace(/^WE BUILD\s?/, '') || 'OBSESSIONS.' },
        { text: 'YOUR BRAND DESERVES ', red: (sc.tagline_3_en || 'YOUR BRAND DESERVES CRAZY.').replace(/^YOUR BRAND DESERVES\s?/, '') || 'CRAZY.' },
      ]

  const counters = countersRef.current

  return (
    <section className="taglines" id="taglines" ref={sectionRef}>
      <MarqueeStrip clients={clients} />

      {taglines.map((line, i) => (
        <span key={i} className={`tagline-line${activeLines[i] ? ' active' : ''}`}>
          {line.text}
          {line.red && <span className="tred">{line.red}</span>}
        </span>
      ))}

      <div className="about-counter" ref={counterRef}>
        {counters.map((c, i) => (
          <div key={i} className={`counter-item${counterStarted ? ' active' : ''}`} style={{ transitionDelay: `${i * 0.1}s` }}>
            <div className="counter-num">{counterValues[i]}{c.suffix}</div>
            <div className="counter-label">{t(c.key, lang)}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
