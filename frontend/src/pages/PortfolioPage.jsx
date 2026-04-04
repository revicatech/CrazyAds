import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import SectionHeading from '../components/ui/SectionHeading'
import Badge from '../components/ui/Badge'
import useFetch from '../hooks/useFetch'
import { fetchPortfolio, fetchPortfolioCategories } from '../services/api'
import { PORTFOLIO as PORTFOLIO_STATIC, PORTFOLIO_CATEGORIES as PORTFOLIO_CATEGORIES_STATIC } from '../data/portfolio'

function PortfolioGridCard({ item, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  const { lang } = useLang()

  return (
    <Link
      to={`/portfolio/${item.slug || item._id || item.id}`}
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl bg-black cursor-pointer aspect-[4/5]
        transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Image */}
      <img
        src={item.image}
        alt={item.titleEn}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
      />

      {/* Overlay — darkens on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Category pill — top-left */}
      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4 z-10">
        <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white">
          {lang === 'ar' ? item.category?.ar : item.category?.en}
        </span>
      </div>

      {/* Featured badge — top-right */}
      {item.featured && (
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4 z-10">
          <Badge className="text-white border-white/40 bg-white/10 backdrop-blur-sm">
            {t('label_featured', lang)}
          </Badge>
        </div>
      )}

      {/* Info — slides up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
        <h3 className="font-display text-white text-xl md:text-2xl tracking-widest mb-2 leading-tight">
          {lang === 'ar' ? item.titleAr : item.titleEn}
        </h3>
        <div className="flex flex-wrap gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
          {(item.tags || []).map(tag => (
            <Badge key={tag} className="text-white/70 border-white/20 text-[10px]">{tag}</Badge>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function PortfolioPage() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()
  const [activeCategory, setActiveCategory] = useState('All')
  const { data: PORTFOLIO } = useFetch(fetchPortfolio, PORTFOLIO_STATIC)
  const { data: apiCategories } = useFetch(fetchPortfolioCategories, PORTFOLIO_CATEGORIES_STATIC)
  const PORTFOLIO_CATEGORIES = [{ en: 'All', ar: 'الكل' }, ...apiCategories]

  const filtered = activeCategory === 'All'
    ? PORTFOLIO
    : PORTFOLIO.filter(p => p.category.en === activeCategory)

  return (
    <main className="min-h-screen bg-white">
      {/* Hero header */}
      <section className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div
          ref={ref}
          className={`flex flex-col gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading
            eyebrow={t('label_portfolio', lang)}
            title={t('portfolio_page_title', lang)}
            subtitle={t('portfolio_page_subtitle', lang)}
          />

          {/* Category filter tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {PORTFOLIO_CATEGORIES.map(cat => {
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

      {/* Behance-style 4-column grid */}
      <section className="px-6 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((item, i) => (
            <PortfolioGridCard key={item._id || item.id} item={item} index={i} />
          ))}
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex items-center justify-center py-24">
            <p className="text-black/40 text-lg">No projects in this category yet.</p>
          </div>
        )}
      </section>
    </main>
  )
}
