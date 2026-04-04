import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import Badge from '../components/ui/Badge'
import { fetchPortfolioBySlug, fetchPortfolio } from '../services/api'
import API from '../services/api'

const isObjectId = (str) => /^[a-f\d]{24}$/i.test(String(str))
const fetchById = (id) => API.get(`/portfolio/${id}`).then((r) => r.data.data)

/* ─── Scroll progress bar ──────────────────────────────────────────── */
function ScrollProgress() {
  const [pct, setPct] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? (el.scrollTop / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-black/10 pointer-events-none">
      <div className="h-full bg-brand-red" style={{ width: `${pct}%`, transition: 'width 50ms linear' }} />
    </div>
  )
}

/* ─── Parallax hero image ───────────────────────────────────────────── */
function ParallaxImage({ src, alt }) {
  const [offset, setOffset] = useState(0)
  useEffect(() => {
    const onScroll = () => setOffset(window.scrollY * 0.35)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full object-cover"
        style={{
          height: '125%',
          top: '-12.5%',
          transform: `translateY(${offset}px)`,
          willChange: 'transform',
        }}
      />
    </div>
  )
}

/* ─── Word-stagger animated title ──────────────────────────────────── */
function AnimatedTitle({ text, className }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  const words = (text || '').split(' ')
  return (
    <h1 ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.22em] last:mr-0">
          <span
            className="inline-block transition-all duration-700 ease-out"
            style={{
              transform: isVisible ? 'translateY(0)' : 'translateY(105%)',
              opacity: isVisible ? 1 : 0,
              transitionDelay: `${i * 70}ms`,
            }}
          >
            {word}
          </span>
        </span>
      ))}
    </h1>
  )
}

/* ─── Reveal wrapper ────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className = '' }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/* ─── Meta datum (dark strip) ───────────────────────────────────────── */
function MetaDatum({ label, value, delay = 0 }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  return (
    <div
      ref={ref}
      className="transition-all duration-600 ease-out"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(16px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-1.5">{label}</p>
      <p className="font-display text-white text-lg md:text-xl tracking-wide">{value}</p>
    </div>
  )
}

/* ─── Gallery item ──────────────────────────────────────────────────── */
function GalleryItem({ src, alt, index, onClick, className = '' }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  return (
    <div
      ref={ref}
      className={`overflow-hidden rounded-2xl cursor-zoom-in group relative ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(24px)',
        transition: 'opacity 0.7s ease, transform 0.7s ease',
        transitionDelay: `${index * 80}ms`,
      }}
      onClick={() => onClick(src)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-400 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
          <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
          </svg>
        </div>
      </div>
    </div>
  )
}

/* ─── Lightbox ──────────────────────────────────────────────────────── */
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/96 flex items-center justify-center p-4 md:p-12 animate-[fadeIn_200ms_ease]"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img
        src={src}
        alt="Gallery preview"
        className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}

/* ─── Loading skeleton ──────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white">
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-brand-red"
            style={{ animation: `bounce 1s infinite`, animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </main>
  )
}

/* ─── Main page ─────────────────────────────────────────────────────── */
export default function PortfolioDetail() {
  const { slug } = useParams()
  const { lang } = useLang()

  const [item, setItem] = useState(null)
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)

  const openLightbox = useCallback((src) => setLightbox(src), [])
  const closeLightbox = useCallback(() => setLightbox(null), [])

  useEffect(() => {
    setLoading(true)
    // Pick the right fetch strategy: ObjectId → /portfolio/:id, else → /portfolio/slug/:slug
    const fetchItem = isObjectId(slug) ? fetchById(slug) : fetchPortfolioBySlug(slug)

    fetchItem
      .then((data) => {
        setItem(data)
        fetchPortfolio().then(setAllItems).catch(() => {})
      })
      .catch(() => {
        // Last resort: scan all items client-side (covers static data with numeric ids)
        fetchPortfolio()
          .then((data) => {
            setAllItems(data)
            const found = data.find(
              (p) => p.slug === slug || p._id === slug || String(p.id) === String(slug)
            )
            setItem(found || null)
          })
          .catch(() => setItem(null))
      })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <LoadingScreen />

  if (!item) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-lg">{t('portfolio_not_found', lang)}</p>
        <Link to="/portfolio" className="text-brand-red text-sm font-semibold hover:underline">
          {t('portfolio_back', lang)}
        </Link>
      </main>
    )
  }

  /* Derived values */
  const title       = lang === 'ar' ? (item.titleAr || item.titleEn) : item.titleEn
  const description = lang === 'ar' ? (item.descriptionAr || item.descriptionEn) : item.descriptionEn
  const body        = lang === 'ar' ? (item.bodyAr || item.bodyEn) : item.bodyEn
  const clientName  = lang === 'ar' ? item.client?.ar : item.client?.en
  const category    = lang === 'ar' ? item.category?.ar : item.category?.en
  const gallery     = item.gallery || []

  /* Next project */
  const nextItem = (() => {
    if (allItems.length < 2) return null
    const idx = allItems.findIndex((p) => p.slug === slug || p._id === item._id)
    const next = allItems[(idx + 1) % allItems.length]
    return next && next._id !== item._id ? next : null
  })()

  /* Gallery layout pattern (12-col grid spans) */
  const gallerySpans = [
    'md:col-span-12 aspect-[21/8]',
    'md:col-span-7 aspect-[4/3]',
    'md:col-span-5 aspect-[4/3]',
    'md:col-span-5 aspect-[4/3]',
    'md:col-span-7 aspect-[4/3]',
    'md:col-span-4 aspect-square',
    'md:col-span-4 aspect-square',
    'md:col-span-4 aspect-square',
  ]

  return (
    <>
      <ScrollProgress />
      {lightbox && <Lightbox src={lightbox} onClose={closeLightbox} />}

      <main className="min-h-screen bg-white" dir={lang === 'ar' ? 'rtl' : 'ltr'}>

        {/* ══ HERO ════════════════════════════════════════════════════ */}
        <section className="relative h-screen min-h-[600px] overflow-hidden">
          {item.image
            ? <ParallaxImage src={item.image} alt={title} />
            : <div className="absolute inset-0 bg-brand-dark" />
          }

          {/* Gradient overlay — bottom-heavy + left vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />

          {/* Top badges */}
          <div className="absolute top-8 left-8 rtl:left-auto rtl:right-8 z-10 flex items-center gap-3">
            {category && (
              <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white">
                {category}
              </span>
            )}
          </div>
          {item.featured && (
            <div className="absolute top-8 right-8 rtl:right-auto rtl:left-8 z-10">
              <Badge className="text-white/80 border-white/30 bg-white/10 backdrop-blur-sm">
                {t('label_featured', lang)}
              </Badge>
            </div>
          )}

          {/* Title block */}
          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 pb-16 max-w-[1400px] mx-auto">
            <AnimatedTitle
              text={title}
              className="font-display text-white text-5xl md:text-7xl xl:text-8xl tracking-widest leading-none mb-5"
            />
            <Reveal delay={500}>
              <div className="flex items-center gap-5 flex-wrap">
                {item.year && (
                  <span className="text-white/40 text-xs tracking-[0.3em] uppercase">{item.year}</span>
                )}
                {clientName && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/40 text-xs tracking-[0.3em] uppercase">{clientName}</span>
                  </>
                )}
              </div>
            </Reveal>
          </div>

          {/* Scroll hint */}
          <div className="absolute bottom-10 right-10 rtl:right-auto rtl:left-10 flex flex-col items-center gap-3">
            <div className="w-px h-14 bg-gradient-to-b from-transparent via-white/40 to-transparent animate-pulse" />
            <span className="text-white/25 text-[9px] tracking-[0.25em] uppercase writing-mode-vertical">
              {t('hero_scroll_hint', lang)}
            </span>
          </div>
        </section>

        {/* ══ META STRIP ══════════════════════════════════════════════ */}
        <section className="bg-[#111] border-t border-white/5">
          <div className="max-w-[1400px] mx-auto px-8 md:px-16 py-10 flex flex-wrap gap-10 md:gap-16">
            {clientName && (
              <MetaDatum label={t('portfolio_client', lang)} value={clientName} delay={0} />
            )}
            {item.year && (
              <MetaDatum label={t('portfolio_year', lang)} value={String(item.year)} delay={80} />
            )}
            {category && (
              <MetaDatum label={t('portfolio_category_label', lang)} value={category} delay={160} />
            )}
            {item.services && item.services.length > 0 && (
              <div className="flex-1 min-w-[180px]">
                <p className="text-[10px] tracking-[0.25em] uppercase text-white/30 mb-3">
                  {t('portfolio_services_label', lang)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.services.map((s, i) => (
                    <span
                      key={s}
                      className="text-[10px] tracking-widest uppercase px-3 py-1 border border-white/15 rounded-full text-white/50 hover:border-brand-red hover:text-brand-red transition-colors duration-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ══ OVERVIEW ════════════════════════════════════════════════ */}
        {(description || body) && (
          <section className="max-w-[1400px] mx-auto px-8 md:px-16 py-24 md:py-32">
            <Reveal>
              <span className="text-brand-red text-xs font-semibold tracking-[0.3em] uppercase">
                {t('portfolio_overview', lang)}
              </span>
            </Reveal>

            {description && (
              <Reveal delay={100}>
                <p className="font-display text-brand-dark text-3xl md:text-4xl xl:text-5xl tracking-wide leading-snug mt-5 max-w-5xl">
                  {description}
                </p>
              </Reveal>
            )}

            {body && (
              <Reveal delay={200}>
                <p className="text-black/55 text-sm md:text-base leading-loose max-w-3xl mt-8 border-l-[3px] border-brand-red pl-6 rtl:border-l-0 rtl:border-r-[3px] rtl:pl-0 rtl:pr-6">
                  {body}
                </p>
              </Reveal>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <Reveal delay={300} className="mt-10">
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, i) => (
                    <Badge
                      key={tag}
                      className="text-brand-dark/45 border-black/12 text-[10px] px-4 py-1.5 hover:border-brand-red hover:text-brand-red transition-colors duration-200"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Reveal>
            )}
          </section>
        )}

        {/* ══ GALLERY ═════════════════════════════════════════════════ */}
        {gallery.length > 0 && (
          <section className="max-w-[1400px] mx-auto px-8 md:px-16 pb-24 md:pb-32">
            {/* Section header */}
            <Reveal className="mb-12 flex items-end justify-between gap-4 flex-wrap">
              <div>
                <span className="text-brand-red text-xs font-semibold tracking-[0.3em] uppercase">
                  {t('portfolio_gallery', lang)}
                </span>
                <h2 className="font-display text-4xl md:text-5xl tracking-widest text-brand-dark mt-2 leading-none">
                  {t('portfolio_gallery_title', lang)}
                </h2>
              </div>
              <span className="text-black/25 text-sm font-mono">{gallery.length} images</span>
            </Reveal>

            {/* Masonry-inspired 12-col grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4">
              {gallery.map((img, i) => (
                <GalleryItem
                  key={i}
                  src={img}
                  alt={`${title} — ${i + 1}`}
                  index={i}
                  onClick={openLightbox}
                  className={gallerySpans[i % gallerySpans.length]}
                />
              ))}
            </div>
          </section>
        )}

        {/* ══ LIVE PROJECT CTA ════════════════════════════════════════ */}
        {item.url && (
          <section className="max-w-[1400px] mx-auto px-8 md:px-16 pb-24">
            <Reveal>
              <div className="border border-black/8 rounded-3xl p-10 md:p-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 bg-[#fafafa]">
                <div>
                  <p className="text-brand-red text-xs font-semibold tracking-[0.3em] uppercase mb-3">
                    {t('portfolio_live_label', lang)}
                  </p>
                  <h3 className="font-display text-brand-dark text-3xl md:text-4xl tracking-widest leading-none">
                    {t('portfolio_live_title', lang)}
                  </h3>
                </div>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-3 bg-brand-red text-white px-8 py-4 rounded-full text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors duration-300 shrink-0"
                >
                  {t('portfolio_live_cta', lang)}
                  <svg className="w-4 h-4 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>
            </Reveal>
          </section>
        )}

        {/* ══ NEXT PROJECT ════════════════════════════════════════════ */}
        {nextItem && (
          <section className="bg-[#0d0d0d] overflow-hidden">
            <Link
              to={`/portfolio/${nextItem.slug || nextItem._id}`}
              className="group block max-w-[1400px] mx-auto px-8 md:px-16 py-16 md:py-24 relative"
            >
              {/* Background image — very faint */}
              {nextItem.image && (
                <div className="absolute inset-0 opacity-[0.06] overflow-hidden">
                  <img src={nextItem.image} alt="" className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                </div>
              )}

              <div className="relative flex items-center justify-between gap-8 flex-wrap">
                <div>
                  <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase mb-5">
                    {t('portfolio_next', lang)}
                  </p>
                  <h3 className="font-display text-white text-4xl md:text-6xl xl:text-7xl tracking-widest leading-none group-hover:text-brand-red transition-colors duration-400 max-w-3xl">
                    {lang === 'ar' ? (nextItem.titleAr || nextItem.titleEn) : nextItem.titleEn}
                  </h3>
                  {/* Animated underline */}
                  <div className="mt-6 h-[2px] bg-brand-red w-10 group-hover:w-28 transition-all duration-500 ease-out rtl:mr-auto" />
                </div>

                {/* Thumbnail */}
                {nextItem.image && (
                  <div className="w-28 h-28 md:w-40 md:h-40 rounded-2xl overflow-hidden shrink-0 ring-1 ring-white/10 opacity-50 group-hover:opacity-100 group-hover:ring-brand-red transition-all duration-400">
                    <img
                      src={nextItem.image}
                      alt={nextItem.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                    />
                  </div>
                )}
              </div>
            </Link>
          </section>
        )}

        {/* ══ BACK LINK ═══════════════════════════════════════════════ */}
        <section className="max-w-[1400px] mx-auto px-8 md:px-16 py-12 border-t border-black/5">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-2 text-brand-red text-sm font-semibold hover:underline group"
          >
            <svg
              className="w-4 h-4 rotate-180 rtl:rotate-0 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform duration-200"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
            {t('portfolio_back', lang)}
          </Link>
        </section>

      </main>
    </>
  )
}
