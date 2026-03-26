import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import SectionHeading from '../components/ui/SectionHeading'
import { SERVICES } from '../data/services'
import { SERVICE_SVGS } from '../data/serviceSvgs'

function ServiceCard({ service, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)
  const { lang } = useLang()
  const SvgComponent = SERVICE_SVGS[index]

  return (
    <div
      ref={ref}
      className={`
        group relative overflow-hidden rounded-2xl bg-brand-gray
        transition-all duration-700
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
      `}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* SVG illustration */}
      <div className="relative h-48 overflow-hidden">
        {SvgComponent && SvgComponent({ uid: `svc-page-${index}` })}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-gray via-transparent to-transparent" />

        {/* Number badge */}
        <div className="absolute top-4 left-4 rtl:left-auto rtl:right-4">
          <span className="inline-block px-3 py-1 text-[10px] font-semibold tracking-widest uppercase rounded-full bg-brand-red text-white">
            {service.num}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 pt-2">
        <h3 className="font-display text-white text-2xl md:text-3xl tracking-widest mb-3 leading-tight group-hover:text-brand-red transition-colors duration-300">
          {lang === 'ar' ? service.ar : service.en}
        </h3>
        <p className="text-white/40 text-sm leading-relaxed mb-5">
          {lang === 'ar' ? service.descAr : service.descEn}
        </p>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-2">
          {service.features.map(f => (
            <span
              key={f}
              className="inline-block px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full border border-white/10 text-white/30 group-hover:border-brand-red/30 group-hover:text-white/50 transition-colors duration-300"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function ServicesPage() {
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
            eyebrow={t('label_services', lang)}
            title={t('services_page_title', lang)}
            subtitle={t('services_page_subtitle', lang)}
          />
        </div>
      </section>

      {/* Services grid — 3 columns */}
      <section className="px-6 pb-24 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {SERVICES.map((svc, i) => (
            <ServiceCard key={svc.id} service={svc} index={i} />
          ))}
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="font-display text-white text-4xl md:text-5xl xl:text-6xl tracking-widest">
            {t('services_cta_title', lang)}
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl leading-relaxed">
            {t('services_cta_subtitle', lang)}
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
