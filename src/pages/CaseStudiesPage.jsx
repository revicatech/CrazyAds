import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import SectionHeading from '../components/ui/SectionHeading'
import useFetch from '../hooks/useFetch'
import { fetchCaseStudies, fetchCaseCategories } from '../services/api'
import { CASE_STUDIES as CASE_STUDIES_STATIC, CASE_CATEGORIES as CASE_CATEGORIES_STATIC } from '../data/caseStudies'

function CaseCard({ item, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  const { lang } = useLang()

  return (
    <Link
      to={`/case-studies/${item.slug}`}
      ref={ref}
      className={`
        group block relative overflow-hidden rounded-2xl bg-black
        transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Image */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="absolute inset-0 w-full h-full object-cover filter grayscale-[50%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Category pill */}
        <div className="absolute top-5 left-5 rtl:left-auto rtl:right-5">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white">
            {lang === 'ar' ? item.category.ar : item.category.en}
          </span>
        </div>

        {/* Tag */}
        <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5">
          <span className="text-white/50 text-[10px] tracking-widest uppercase">{item.tag}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 bg-brand-gray">
        <h3 className="font-display text-white text-3xl md:text-4xl tracking-widest mb-4 leading-tight group-hover:text-brand-red transition-colors duration-300">
          {item.title}
        </h3>
        <p className="text-white/50 text-sm leading-relaxed mb-6 line-clamp-3 max-w-xl">
          {item.description}
        </p>

        {/* Metrics row */}
        <div className="flex flex-wrap gap-8 mb-6">
          {item.metrics.map(m => (
            <div key={m.label}>
              <div className="font-display text-brand-red text-3xl md:text-4xl leading-none">{m.num}</div>
              <div className="text-white/40 text-[10px] tracking-widest uppercase mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Read more */}
        <span className="inline-flex items-center gap-2 text-white/60 text-xs font-semibold tracking-wider uppercase group-hover:text-brand-red transition-colors duration-300">
          {t('cases_read_more', lang)}
          <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}

export default function CaseStudiesPage() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()
  const [activeCategory, setActiveCategory] = useState('All')
  const { data: CASE_STUDIES } = useFetch(fetchCaseStudies, CASE_STUDIES_STATIC)
  const { data: apiCategories } = useFetch(fetchCaseCategories, CASE_CATEGORIES_STATIC)
  const CASE_CATEGORIES = [{ en: 'All', ar: 'الكل' }, ...apiCategories]

  const filtered = activeCategory === 'All'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(c => c.category.en === activeCategory)

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div
          ref={ref}
          className={`flex flex-col gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading
            eyebrow={t('label_cases', lang)}
            title={t('cases_page_title', lang)}
            subtitle={t('cases_page_subtitle', lang)}
          />

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mt-4">
            {CASE_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.en
              return (
                <button
                  key={cat.en}
                  onClick={() => setActiveCategory(cat.en)}
                  className={`
                    px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase border transition-all duration-300
                    ${isActive
                      ? 'bg-brand-red text-white border-brand-red'
                      : 'bg-transparent text-brand-dark/60 border-black/15 hover:border-brand-red hover:text-brand-red'
                    }
                  `}
                >
                  {lang === 'ar' ? cat.ar : cat.en}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Case studies grid */}
      <section className="px-6 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item, i) => (
            <CaseCard key={item._id} item={item} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <p className="text-black/40 text-lg">No case studies in this category yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
