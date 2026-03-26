/**
 * Reusable section header: eyebrow label + large title + optional subtitle.
 * align: 'left' | 'center'
 */
export default function SectionHeading({ eyebrow, title, subtitle, align = 'left', light = false }) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left items-start'
  const textCol  = light ? 'text-white' : 'text-brand-dark'
  const subCol   = light ? 'text-white/60' : 'text-black/50'

  return (
    <div className={`flex flex-col gap-3 ${alignCls}`}>
      {eyebrow && (
        <span className={`text-brand-red text-xs font-semibold tracking-[0.25em] uppercase ${alignCls}`}>
          {eyebrow}
        </span>
      )}
      <h2 className={`font-display text-5xl md:text-6xl xl:text-7xl tracking-widest leading-none ${textCol}`}>
        {title}
      </h2>
      {subtitle && (
        <p className={`text-sm md:text-base leading-relaxed max-w-xl ${subCol}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
