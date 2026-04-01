import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import SectionHeading from '../ui/SectionHeading'
import Badge from '../ui/Badge'
import useFetch from '../../hooks/useFetch'
import { fetchEvents } from '../../services/api'
import { EVENTS as EVENTS_STATIC } from '../../data/events'

function EventCard({ item, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)
  const { lang } = useLang()
  const isLarge = index === 0 || index === 3

  const formattedDate = item.date
    ? new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-SA' : 'en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
      })
    : null

  return (
    <Link
      to={`/events/${item._id || item.id}`}
      ref={ref}
      className={`
        group block relative overflow-hidden rounded-2xl bg-black
        ${isLarge ? 'md:col-span-2' : ''}
        transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.titleEn}
        className="w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Date badge */}
      {formattedDate && (
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white">
            {formattedDate}
          </span>
        </div>
      )}

      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <Badge className="text-white border-white/40">{t('label_featured', lang)}</Badge>
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-display text-white text-2xl tracking-widest mb-1">
          {lang === 'ar' ? item.titleAr : item.titleEn}
        </h3>
        {(item.locationEn || item.locationAr) && (
          <p className="text-white/60 text-xs mb-2 tracking-wide">
            {lang === 'ar' ? item.locationAr : item.locationEn}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          {item.category && (
            <Badge className="text-white/70 border-white/20 text-[10px]">
              {lang === 'ar' ? item.category.ar : item.category.en}
            </Badge>
          )}
          {item.tags && item.tags.map((tag) => (
            <Badge key={tag} className="text-white/50 border-white/10 text-[10px]">{tag}</Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function Events() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()
  const { data: EVENTS } = useFetch(fetchEvents, EVENTS_STATIC)
  const eventItems = EVENTS.slice(0, 4)

  return (
    <section id="events" className="py-24 px-6 max-w-[1400px] mx-auto">
      <div
        ref={ref}
        className={`mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <SectionHeading
          eyebrow={t('label_events', lang)}
          title={t('label_events', lang)}
          subtitle={t('events_subtitle', lang)}
        />
        <Link to="/events" className="text-brand-red text-sm font-semibold hover:underline shrink-0">
          {t('events_cta', lang)}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {eventItems.map((item, i) => (
          <EventCard key={item._id || item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
