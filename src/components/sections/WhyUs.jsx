import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import SectionHeading from '../ui/SectionHeading'
import Badge from '../ui/Badge'
import { WHY_US } from '../../data/whyUs'

function WhyCard({ card, index, lang }) {
  const TOP_OFFSETS = [0, 60, 120, 180, 240]

  return (
    <div
      className="sticky rounded-3xl p-8 md:p-12 min-h-[420px] flex flex-col justify-between"
      style={{
        top:             `${80 + TOP_OFFSETS[index]}px`,
        backgroundColor: card.bg,
        color:           card.textColor,
      }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between">
        <span
          className="text-xs font-semibold tracking-[0.25em] uppercase opacity-50"
        >
          {t(`why_card_eyebrow_${card.id}`, lang)}
        </span>
        <Badge
          className="border-current opacity-60 text-[10px]"
          style={{ color: card.textColor }}
        >
          {card.tag}
        </Badge>
      </div>

      {/* Heading */}
      <div>
        <h3
          className="font-display text-5xl md:text-7xl tracking-widest leading-none mb-6"
        >
          {t(`why_heading_${card.id}`, lang)}
        </h3>
        <p className="text-sm md:text-base leading-relaxed opacity-70 max-w-2xl">
          {lang === 'ar' ? card.bodyAr : card.bodyEn}
        </p>
      </div>

      {/* Accent line */}
      <div
        className="w-12 h-0.5 mt-8"
        style={{ backgroundColor: card.accent }}
      />
    </div>
  )
}

export default function WhyUs() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section id="why" className="py-24 px-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div
        ref={ref}
        className={`mb-16 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <SectionHeading
          eyebrow={t('why_eyebrow', lang)}
          title={t('why_title', lang)}
          subtitle={t('why_subtitle', lang)}
        />
      </div>

      {/* Stacked sticky cards */}
      <div className="flex flex-col gap-4">
        {WHY_US.map((card, i) => (
          <WhyCard key={card.id} card={card} index={i} lang={lang} />
        ))}
      </div>
    </section>
  )
}
