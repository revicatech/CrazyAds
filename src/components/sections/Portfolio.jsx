import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import SectionHeading from '../ui/SectionHeading'
import Badge from '../ui/Badge'
import { PORTFOLIO } from '../../data/portfolio'

function PortfolioCard({ item, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)
  const { lang } = useLang()
  const isLarge  = index === 0 || index === 3

  return (
    <div
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl bg-black cursor-pointer
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

      {/* Category pill */}
      <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
        <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white">
          {lang === 'ar' ? item.category.ar : item.category.en}
        </span>
      </div>

      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
          <Badge className="text-white border-white/40">{t('label_featured', lang)}</Badge>
        </div>
      )}

      {/* Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="font-display text-white text-2xl tracking-widest mb-2">
          {lang === 'ar' ? item.titleAr : item.titleEn}
        </h3>
        <div className="flex flex-wrap gap-2">
          {item.tags.map(tag => (
            <Badge key={tag} className="text-white/70 border-white/20 text-[10px]">{tag}</Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()
  const portfolioItems = PORTFOLIO.slice(0, 4) // Show only first 4 items for preview
  return (
    <section id="portfolio" className="py-24 px-6 max-w-[1400px] mx-auto">
      <div
        ref={ref}
        className={`mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <SectionHeading
          eyebrow={t('label_portfolio', lang)}
          title={t('label_portfolio', lang)}
          subtitle={t('portfolio_subtitle', lang)}
        />
        <Link to="/portfolio" className="text-brand-red text-sm font-semibold hover:underline shrink-0">
          {t('portfolio_cta', lang)}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {portfolioItems.map((item, i) => (
          <PortfolioCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  )
}
