import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import SectionHeading from '../components/ui/SectionHeading'
import { INDUSTRIES } from '../data/industries'

function IndustryCard({ industry, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  const { lang } = useLang()

  return (
    <div
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl
        transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-64 md:h-72 overflow-hidden">
        <img
          src={industry.image}
          alt={lang === 'ar' ? industry.nameAr : industry.name}
          className="absolute inset-0 w-full h-full object-cover filter grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

        {/* Number */}
        <div className="absolute top-5 right-5 rtl:right-auto rtl:left-5">
          <span className="font-display text-white/10 text-6xl leading-none">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Gradient accent bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: 'linear-gradient(90deg, #dc1e1e, transparent)' }}
        />
      </div>

      {/* Content */}
      <div className="p-6 bg-brand-gray">
        <h3 className="font-display text-white text-2xl md:text-3xl tracking-widest mb-2 leading-tight group-hover:text-brand-red transition-colors duration-300">
          {lang === 'ar' ? industry.nameAr : industry.name}
        </h3>

        <p className="text-white/60 text-xs tracking-widest uppercase mb-4">
          {industry.headlineEn}
        </p>

        <p className="text-white/40 text-sm leading-relaxed mb-5">
          {lang === 'ar' ? industry.descAr : industry.descEn}
        </p>

        {/* Service tags */}
        <div className="flex flex-wrap gap-2">
          {industry.services.map(s => (
            <span
              key={s}
              className="inline-block px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full border border-white/10 text-white/30 group-hover:border-brand-red/30 group-hover:text-white/50 transition-colors duration-300"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function IndustriesPage() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <main className="min-h-screen bg-white">
      {/* Header */}
      <section className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div
          ref={ref}
          className={`flex flex-col gap-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading
            eyebrow={t('label_industries', lang)}
            title={t('industries_page_title', lang)}
            subtitle={t('industries_page_subtitle', lang)}
          />
        </div>
      </section>

      {/* Industries grid — 2 columns */}
      <section className="px-6 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INDUSTRIES.map((ind, i) => (
            <IndustryCard key={ind.id} industry={ind} index={i} />
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="font-display text-white text-4xl md:text-5xl xl:text-6xl tracking-widest">
            {t('industries_cta_title', lang)}
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl leading-relaxed">
            {t('industries_cta_subtitle', lang)}
          </p>
          <a
            href="/#contact-cta"
            className="inline-flex items-center bg-brand-red text-white px-8 py-3 rounded-full text-sm font-semibold tracking-wide hover:bg-red-700 transition-colors mt-2"
          >
            {t('nav_cta', lang)}
          </a>
        </div>
      </section>
    </main>
  )
}
