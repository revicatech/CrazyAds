import { useParams, Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import { useState, useEffect } from 'react'
import { fetchCaseStudyBySlug } from '../services/api'

function MetricBlock({ num, label }) {
  return (
    <div className="text-center">
      <div className="font-display text-brand-red text-5xl md:text-6xl leading-none">{num}</div>
      <div className="text-black/40 text-[11px] tracking-widest uppercase mt-2">{label}</div>
    </div>
  )
}

function Section({ title, children, delay = 0 }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <h3 className="font-display text-3xl md:text-4xl tracking-widest text-brand-dark mb-4">{title}</h3>
      <div className="text-black/60 text-sm md:text-base leading-relaxed max-w-3xl">{children}</div>
    </div>
  )
}

export default function CaseStudyDetail() {
  const { slug } = useParams()
  const { lang } = useLang()
  const [study, setStudy] = useState(null)
  const [loading, setLoading] = useState(true)
  const { ref: heroRef, isVisible: heroVisible } = useRevealOnScroll(0.05)

  useEffect(() => {
    fetchCaseStudyBySlug(slug)
      .then(setStudy)
      .catch(() => setStudy(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return <main className="min-h-screen flex items-center justify-center"><p className="text-black/40 text-lg">Loading...</p></main>
  }

  if (!study) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-black/50 text-lg">{t('cases_not_found', lang)}</p>
        <Link to="/case-studies" className="text-brand-red text-sm font-semibold hover:underline">
          {t('cases_back', lang)}
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img
          src={study.image}
          alt={study.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />

        <div
          ref={heroRef}
          className={`absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-[1400px] mx-auto transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white mb-4">
            {lang === 'ar' ? study.category.ar : study.category.en}
          </span>
          <h1 className="font-display text-white text-4xl md:text-6xl xl:text-7xl tracking-widest leading-none mb-3">
            {study.title}
          </h1>
          <p className="text-white/50 text-xs tracking-widest uppercase">{study.tag}</p>
        </div>
      </section>

      {/* Metrics bar */}
      <section className="bg-brand-light border-b border-black/5">
        <div className="max-w-[1400px] mx-auto px-6 py-12 flex flex-wrap justify-center gap-12 md:gap-20">
          {study.metrics.map(m => (
            <MetricBlock key={m.label} num={m.num} label={m.label} />
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-[1400px] mx-auto px-6 py-16 md:py-24 space-y-16">
        {/* Overview */}
        <Section title={t('cases_overview', lang)}>
          <p>{study.fullDescription}</p>
        </Section>

        {/* Challenge + Solution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Section title={t('cases_challenge', lang)} delay={0}>
            <p>{study.challenge}</p>
          </Section>
          <Section title={t('cases_solution', lang)} delay={100}>
            <p>{study.solution}</p>
          </Section>
        </div>

        {/* Gallery */}
        {study.gallery && study.gallery.length > 0 && (
          <div>
            <h3 className="font-display text-3xl md:text-4xl tracking-widest text-brand-dark mb-8">
              {t('cases_gallery', lang)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {study.gallery.map((img, i) => {
                const { ref, isVisible } = useRevealOnScroll(0.05)
                return (
                  <div
                    key={i}
                    ref={ref}
                    className={`overflow-hidden rounded-2xl aspect-[4/3] transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <img
                      src={img}
                      alt={`${study.title} — ${i + 1}`}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {/* Back link */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <Link
          to="/case-studies"
          className="inline-flex items-center gap-2 text-brand-red text-sm font-semibold hover:underline"
        >
          <svg className="w-4 h-4 rotate-180 rtl:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          {t('cases_back', lang)}
        </Link>
      </section>
    </main>
  )
}
