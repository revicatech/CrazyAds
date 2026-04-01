import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import Badge from '../components/ui/Badge'
import { fetchEventById } from '../services/api'
import { EVENTS as EVENTS_STATIC } from '../data/events'

function InfoRow({ icon, children }) {
  return (
    <div className="flex items-center gap-3 text-black/60 text-sm">
      <span className="text-brand-red shrink-0">{icon}</span>
      {children}
    </div>
  )
}

function RevealSection({ children, delay = 0 }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

export default function EventDetail() {
  const { id } = useParams()
  const { lang } = useLang()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const { ref: heroRef, isVisible: heroVisible } = useRevealOnScroll(0.05)

  useEffect(() => {
    fetchEventById(id)
      .then(setEvent)
      .catch(() => {
        // Fallback to static data
        const found = EVENTS_STATIC.find((e) => String(e.id) === id || e._id === id)
        setEvent(found || null)
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-black/40 text-lg">Loading...</p>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-lg">{t('events_not_found', lang)}</p>
        <Link to="/events" className="text-brand-red text-sm font-semibold hover:underline">
          {t('events_back', lang)}
        </Link>
      </main>
    )
  }

  const title = lang === 'ar' ? (event.titleAr || event.titleEn) : event.titleEn
  const description = lang === 'ar' ? (event.descriptionAr || event.descriptionEn) : event.descriptionEn

  const formattedDate = event.date
    ? new Date(event.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
        weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  const location = lang === 'ar' ? (event.locationAr || event.locationEn) : event.locationEn
  const category = lang === 'ar' ? event.category?.ar : event.category?.en

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={event.image}
          alt={event.titleEn}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div
          ref={heroRef}
          className={`absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1400px] mx-auto transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {category && (
            <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white mb-4">
              {category}
            </span>
          )}
          <h1 className="font-display text-white text-4xl md:text-6xl xl:text-7xl tracking-widest leading-none mb-3">
            {title}
          </h1>
          {formattedDate && (
            <p className="text-white/50 text-xs tracking-widest uppercase">{formattedDate}</p>
          )}
        </div>
      </section>

      {/* Meta bar */}
      <section className="bg-brand-light border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 py-8 flex flex-wrap gap-8 md:gap-16">
          {formattedDate && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-1">{t('events_date', lang)}</p>
              <p className="font-display text-brand-dark text-xl tracking-wide">{formattedDate}</p>
            </div>
          )}
          {location && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-1">{t('events_location', lang)}</p>
              <p className="font-display text-brand-dark text-xl tracking-wide">{location}</p>
            </div>
          )}
          {category && (
            <div>
              <p className="text-[10px] tracking-[0.2em] uppercase text-black/30 mb-1">Category</p>
              <p className="font-display text-brand-dark text-xl tracking-wide">{category}</p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24 space-y-16">
        {/* About */}
        {description && (
          <RevealSection>
            <h2 className="font-display text-3xl md:text-4xl tracking-widest text-brand-dark mb-4">
              {t('events_about', lang)}
            </h2>
            <p className="text-black/60 text-sm md:text-base leading-relaxed max-w-3xl">{description}</p>
          </RevealSection>
        )}

        {/* Tags */}
        {event.tags && event.tags.length > 0 && (
          <RevealSection delay={100}>
            <div className="flex flex-wrap gap-3">
              {event.tags.map((tag) => (
                <Badge key={tag} className="text-brand-dark/60 border-black/20 text-xs px-4 py-1">
                  {tag}
                </Badge>
              ))}
            </div>
          </RevealSection>
        )}
      </section>

      {/* Back link */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <Link
          to="/events"
          className="inline-flex items-center gap-2 text-brand-red text-sm font-semibold hover:underline"
        >
          <svg className="w-4 h-4 rotate-180 rtl:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          {t('events_back', lang)}
        </Link>
      </section>
    </main>
  )
}
