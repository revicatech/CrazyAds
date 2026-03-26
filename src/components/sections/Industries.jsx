import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { INDUSTRIES } from '../../data/industries'
import '../cssComponents/Industries.css'

function IndustryCard({ ind, index, lang }) {
  const { ref, isVisible } = useRevealOnScroll(0.08)

  return (
    <div
      ref={ref}
      className={`ind-card ind-card-reveal${isVisible ? ' in' : ''}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="ind-card-img">
        <img src={ind.image} alt={lang === 'ar' ? ind.nameAr : ind.name} loading="lazy" />
      </div>
      <div className="ind-card-overlay" />
      <div className="ind-card-accent" />

      {/* Arrow */}
      <div className="ind-card-arrow">
        <svg viewBox="0 0 24 24">
          <path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Content */}
      <div className="ind-card-content">
        <div className="ind-card-num">
          {String(index + 1).padStart(2, '0')}
        </div>
        <h3 className="ind-card-name">
          {lang === 'ar' ? ind.nameAr : ind.name}
        </h3>
        <p className="ind-card-headline">
          {ind.headlineEn}
        </p>
        <p className="ind-card-desc">
          {lang === 'ar' ? ind.descAr : ind.descEn}
        </p>
        <div className="ind-card-tags">
          {ind.services.slice(0, 3).map(s => (
            <span key={s} className="ind-card-tag">{s}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Industries() {
  const { lang } = useLang()
  const { ref: headerRef, isVisible: headerVisible } = useRevealOnScroll(0.1)

  return (
    <section className="industries-section" id="industries">
      {/* Ambient glow */}
      <div className="industries-glow" />

      {/* Header */}
      <div
        ref={headerRef}
        className={`industries-header transition-all duration-700 ${headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="industries-eyebrow">
          {t('label_industries', lang)}
        </div>
        <h2 className="industries-title">
          {lang === 'ar' ? 'القطاعات التي' : 'Industries We'}<br />
          <em>{lang === 'ar' ? 'نخدمها' : 'Dominate'}</em>
        </h2>
        <p className="industries-subtitle">
          {t('industries_page_subtitle', lang)}
        </p>
      </div>

      {/* Grid */}
      <div className="industries-grid">
        {INDUSTRIES.map((ind, i) => (
          <IndustryCard key={ind.id} ind={ind} index={i} lang={lang} />
        ))}
      </div>

      {/* Stats */}
      <div className="industries-stats">
        <div className="industries-stat">
          <div className="industries-stat-num">8</div>
          <div className="industries-stat-label">
            {lang === 'ar' ? 'قطاعات' : 'Sectors'}
          </div>
        </div>
        <div className="industries-stat">
          <div className="industries-stat-num">4</div>
          <div className="industries-stat-label">
            {lang === 'ar' ? 'دول' : 'Countries'}
          </div>
        </div>
        <div className="industries-stat">
          <div className="industries-stat-num">300+</div>
          <div className="industries-stat-label">
            {lang === 'ar' ? 'حملة' : 'Campaigns'}
          </div>
        </div>
        <div className="industries-stat">
          <div className="industries-stat-num">100%</div>
          <div className="industries-stat-label">
            {lang === 'ar' ? 'شغف' : 'Passion'}
          </div>
        </div>
      </div>
    </section>
  )
}
