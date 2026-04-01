import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'

const FOOTER_SERVICE_KEYS = [
  'footer_svc_digital', 'footer_svc_video', 'footer_svc_brand',
  'footer_svc_web', 'footer_svc_print', 'footer_svc_event', 'footer_svc_sales',
]

const FOOTER_COMPANY = [
  { key: 'footer_link_about',      href: '/#about'      },
  { key: 'footer_link_cases',      href: '/#cases'      },
  { key: 'footer_link_portfolio',  href: '/#portfolio'  },
  { key: 'footer_link_industries', href: '/#industries' },
  { key: 'footer_link_why',        href: '/#why'        },
]

const FOOTER_CONTACT = [
  { label: 'hello@crazy-ads.com', href: 'mailto:hello@crazy-ads.com' },
  { label: 'www.crazy-ads.com',   href: '#' },
  { key: 'footer_location_dubai',     href: '#' },
  { key: 'footer_location_riyadh',    href: '#' },
  { key: 'footer_location_bekaa',     href: '#' },
  { key: 'footer_location_damascus',  href: '#' },
]

const SOCIALS = [
  { name: 'Instagram', href: '#', icon: 'IG' },
  { name: 'Facebook',  href: '#', icon: 'FB' },
  { name: 'LinkedIn',  href: '#', icon: 'IN' },
  { name: 'YouTube',   href: '#', icon: 'YT' },
]

export default function Footer() {
  const { lang } = useLang()

  return (
    <footer className="bg-brand-dark text-white/70 pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Col 1 — Brand */}
          <div>
            <p className="font-display text-4xl text-white tracking-tightest mb-4">
              CRAZY<span className="text-brand-red">ADS</span>
            </p>
            <p className="text-sm leading-relaxed">{t('footer_desc', lang)}</p>
            <div className="flex gap-3 mt-6">
              {SOCIALS.map(s => (
                <a key={s.name} href={s.href}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-xs hover:border-brand-red hover:text-brand-red transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Col 2 — Services */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">{t('footer_col_services', lang)}</h4>
            <ul className="space-y-2">
              {FOOTER_SERVICE_KEYS.map(key => (
                <li key={key}><a href="#" className="text-sm hover:text-white transition-colors">{t(key, lang)}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">{t('footer_col_company', lang)}</h4>
            <ul className="space-y-2">
              {FOOTER_COMPANY.map(c => (
                <li key={c.key}><a href={c.href} className="text-sm hover:text-white transition-colors">{t(c.key, lang)}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm tracking-widest uppercase">{t('footer_col_contact', lang)}</h4>
            <ul className="space-y-2">
              {FOOTER_CONTACT.map(c => (
                <li key={c.key || c.label}><a href={c.href} className="text-sm hover:text-white transition-colors">{c.key ? t(c.key, lang) : c.label}</a></li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 text-xs text-white/40 flex flex-col md:flex-row items-center justify-between gap-2">
          <span>{t('footer_rights', lang)}</span>
          <span className="text-white/20">{t('footer_tagline', lang)}</span>
        </div>
      </div>
    </footer>
  )
}
