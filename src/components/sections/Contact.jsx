import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'

const PHONES = [
  { country: 'UAE',     flag: '🇦🇪', number: '+971 50 205 7272', tel: 'tel:+971502057272' },
  { country: 'KSA',     flag: '🇸🇦', number: '+966 51 133 8191', tel: 'tel:+966511338191' },
  { country: 'Lebanon', flag: '🇱🇧', number: '+961 76 702 611',  tel: 'tel:+96176702611'  },
  { country: 'Syria',   flag: '🇸🇾', number: '+963 998 237 120', tel: 'tel:+963998237120' },
]

export default function Contact() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()

  return (
    <section
      id="contact-cta"
      className="py-28 px-6 bg-brand-dark text-white"
    >
      <div
        ref={ref}
        className={`max-w-[1400px] mx-auto flex flex-col items-center text-center transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        {/* Heading */}
        <h2 className="font-display text-6xl md:text-8xl xl:text-9xl tracking-[-0.02em] leading-none mb-4">
          {t('contact_heading', lang).split('Crazy').map((part, i, arr) =>
            i < arr.length - 1
              ? <span key={i}>{part}<span className="text-brand-red">Crazy</span></span>
              : <span key={i}>{part}</span>
          )}
        </h2>
        <p className="text-white/50 text-sm md:text-base max-w-md mt-4 mb-10">
          {t('contact_subtitle', lang)}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 justify-center mb-14">
          <a
            href="mailto:hello@crazy-ads.com"
            className="bg-brand-red text-white px-8 py-4 rounded-full font-semibold tracking-wide hover:bg-red-700 transition-colors"
          >
            {t('contact_email_cta', lang)}
          </a>
          <a
            href="#"
            className="border border-white/30 text-white px-8 py-4 rounded-full font-semibold tracking-wide hover:bg-white/10 transition-colors"
          >
            {t('contact_quote_cta', lang)}
          </a>
        </div>

        {/* Phone numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-3xl">
          {PHONES.map(({ country, flag, number, tel }) => (
            <a
              key={country}
              href={tel}
              className="flex flex-col items-center gap-1 group"
            >
              <span className="text-2xl">{flag}</span>
              <span className="text-white/40 text-xs tracking-widest uppercase">{country}</span>
              <span className="text-white/80 text-sm font-medium group-hover:text-brand-red transition-colors">
                {number}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
