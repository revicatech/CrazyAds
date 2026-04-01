import { useState, useEffect } from 'react'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'
import { useRevealOnScroll } from '../hooks/useRevealOnScroll'
import SectionHeading from '../components/ui/SectionHeading'
import useFetch from '../hooks/useFetch'
import { fetchTeam, fetchWhyUs, fetchSiteContent } from '../services/api'
import { TEAM as TEAM_STATIC } from '../data/team'
import { WHY_US as WHY_US_STATIC } from '../data/whyUs'

const COUNTERS = [
  { key: 'about_years',     value: 14,  suffix: '+' },
  { key: 'about_campaigns', value: 300, suffix: '+' },
  { key: 'about_markets',   value: 8,   suffix: ''  },
  { key: 'about_awards',    value: 47,  suffix: ''  },
]

const OFFICES = [
  { id: 'lb', city: 'Beirut',  cityAr: 'بيروت',  country: 'Lebanon', countryAr: 'لبنان',           lat: 33.8938, lng: 35.5018, hq: true  },
  { id: 'ae', city: 'Dubai',   cityAr: 'دبي',     country: 'UAE',     countryAr: 'الإمارات',        lat: 25.2048, lng: 55.2708, hq: false },
  { id: 'sa', city: 'Riyadh',  cityAr: 'الرياض',  country: 'KSA',     countryAr: 'السعودية',        lat: 24.7136, lng: 46.6753, hq: false },
  { id: 'sy', city: 'Damascus',cityAr: 'دمشق',    country: 'Syria',   countryAr: 'سوريا',           lat: 33.5138, lng: 36.2765, hq: false },
]

/* ── SVG Map ── */
function OfficesMap({ lang }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)

  // Simplified SVG viewBox covering the Middle East region
  // Map coordinates: lng 25-60, lat 12-42 → SVG viewBox
  const mapToSvg = (lat, lng) => {
    const x = ((lng - 25) / 35) * 800
    const y = ((42 - lat) / 30) * 500
    return { x, y }
  }

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <div className="relative bg-brand-gray rounded-2xl overflow-hidden p-6 md:p-10">
        <svg
          viewBox="0 0 800 500"
          className="w-full h-auto"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background grid lines */}
          {[...Array(9)].map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 62.5} x2="800" y2={i * 62.5}
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[...Array(13)].map((_, i) => (
            <line key={`v${i}`} x1={i * 66.7} y1="0" x2={i * 66.7} y2="500"
              stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Simplified Middle East landmass outlines */}
          {/* Arabian Peninsula */}
          <path
            d="M200,200 L240,185 L320,175 L400,165 L450,180 L500,200 L520,240 L530,300 L510,350 L470,380 L420,400 L360,410 L300,390 L260,360 L230,320 L210,280 L200,240 Z"
            fill="rgba(255,255,255,0.04)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          {/* Levant / Mediterranean coast */}
          <path
            d="M200,200 L220,160 L250,120 L280,100 L310,95 L340,105 L360,130 L350,160 L320,175 L240,185 Z"
            fill="rgba(255,255,255,0.05)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          {/* North Africa hint */}
          <path
            d="M0,200 L50,190 L100,185 L150,190 L200,200 L220,160 L200,140 L150,130 L100,135 L50,145 L0,160 Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
          {/* Iran hint */}
          <path
            d="M500,200 L540,170 L590,140 L650,130 L700,150 L720,190 L700,240 L660,270 L600,280 L550,270 L530,240 Z"
            fill="rgba(255,255,255,0.03)"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />

          {/* Connection lines between offices */}
          {OFFICES.map((office, i) => {
            if (i === 0) return null
            const from = mapToSvg(OFFICES[0].lat, OFFICES[0].lng)
            const to = mapToSvg(office.lat, office.lng)
            return (
              <line key={`line-${office.id}`}
                x1={from.x} y1={from.y} x2={to.x} y2={to.y}
                stroke="rgba(220,30,30,0.15)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            )
          })}

          {/* Office markers */}
          {OFFICES.map(office => {
            const { x, y } = mapToSvg(office.lat, office.lng)
            return (
              <g key={office.id}>
                {/* Pulse ring for HQ */}
                {office.hq && (
                  <circle cx={x} cy={y} r="20"
                    fill="none" stroke="rgba(220,30,30,0.3)" strokeWidth="1">
                    <animate attributeName="r" values="12;24;12" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0;0.5" dur="3s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Outer glow */}
                <circle cx={x} cy={y} r="12"
                  fill={office.hq ? 'rgba(220,30,30,0.2)' : 'rgba(220,30,30,0.1)'} />
                {/* Inner dot */}
                <circle cx={x} cy={y} r={office.hq ? 6 : 4}
                  fill="#dc1e1e" />
                {/* City label */}
                <text
                  x={x} y={y - 18}
                  textAnchor="middle"
                  fontFamily="'Bebas Neue', sans-serif"
                  fontSize="14"
                  letterSpacing="2"
                  fill="white"
                >
                  {lang === 'ar' ? office.cityAr : office.city.toUpperCase()}
                </text>
                {/* Country label */}
                <text
                  x={x} y={y + 26}
                  textAnchor="middle"
                  fontFamily="'DM Sans', sans-serif"
                  fontSize="9"
                  fill="rgba(255,255,255,0.35)"
                  letterSpacing="1"
                >
                  {lang === 'ar' ? office.countryAr : office.country}
                </text>
                {/* HQ badge */}
                {office.hq && (
                  <text
                    x={x + 20} y={y + 4}
                    fontFamily="'DM Sans', sans-serif"
                    fontSize="8"
                    fill="#dc1e1e"
                    fontWeight="bold"
                    letterSpacing="1.5"
                  >
                    HQ
                  </text>
                )}
              </g>
            )
          })}
        </svg>

        {/* Office cards below map */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
          {OFFICES.map(office => (
            <div key={office.id} className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${office.hq ? 'bg-brand-red' : 'bg-white/30'}`} />
                <span className="font-display text-white text-lg tracking-widest">
                  {lang === 'ar' ? office.cityAr : office.city}
                </span>
              </div>
              <p className="text-white/30 text-[10px] tracking-widest uppercase">
                {lang === 'ar' ? office.countryAr : office.country}
                {office.hq && <span className="text-brand-red ml-2 rtl:ml-0 rtl:mr-2">{t('about_hq', lang)}</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Team Card ── */
function TeamCard({ member, index }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="font-semibold text-brand-dark text-lg">{member.name}</h3>
      <p className="text-black/50 text-sm mt-1">{member.role}</p>
    </div>
  )
}

/* ── Why Us Card ── */
function WhyUsCard({ item, index, lang }) {
  const { ref, isVisible } = useRevealOnScroll(0.05)

  return (
    <div
      ref={ref}
      className={`rounded-2xl p-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{
        background: item.bg,
        color: item.textColor,
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <span className="text-[10px] tracking-widest uppercase opacity-50">{item.eyebrowEn}</span>
      <h3 className="font-display text-2xl md:text-3xl tracking-widest mt-3 mb-4">{item.headingEn}</h3>
      <p className="text-sm leading-relaxed opacity-60">
        {lang === 'ar' ? item.bodyAr : item.bodyEn}
      </p>
      <div className="mt-4">
        <span
          className="inline-block px-3 py-1 text-[10px] font-semibold tracking-wider uppercase rounded-full border"
          style={{ borderColor: `${item.accent}40`, color: item.accent }}
        >
          {item.tag}
        </span>
      </div>
    </div>
  )
}

/* ── Main Page ── */
export default function AboutPage() {
  const { lang } = useLang()
  const { ref: heroRef, isVisible: heroVisible } = useRevealOnScroll()
  const { ref: storyRef, isVisible: storyVisible } = useRevealOnScroll()
  const { ref: teamRef, isVisible: teamVisible } = useRevealOnScroll()
  const { ref: whyRef, isVisible: whyVisible } = useRevealOnScroll()
  const { data: TEAM } = useFetch(fetchTeam, TEAM_STATIC)
  const { data: WHY_US } = useFetch(fetchWhyUs, WHY_US_STATIC)
  const [sc, setSc] = useState({})
  useEffect(() => { fetchSiteContent('about').then(setSc).catch(() => {}) }, [])

  return (
    <main className="min-h-screen bg-white">

      {/* ── Header ── */}
      <section className="pt-32 pb-16 px-6 max-w-[1400px] mx-auto">
        <div
          ref={heroRef}
          className={`flex flex-col gap-8 transition-all duration-700 ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading
            eyebrow={t('label_about', lang)}
            title={t('about_page_title', lang)}
            subtitle={t('about_page_subtitle', lang)}
          />
        </div>
      </section>

      {/* ── Story + Image ── */}
      <section className="px-6 pb-16 max-w-[1400px] mx-auto">
        <div
          ref={storyRef}
          className={`grid grid-cols-1 xl:grid-cols-3 gap-6 transition-all duration-700 ${storyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          {/* Story text */}
          <div className="col-span-1 xl:col-span-2 bg-brand-light rounded-2xl p-8 md:p-12 flex flex-col justify-between">
            <div>
              <span className="text-brand-red text-xs font-semibold tracking-[0.25em] uppercase">
                {sc?.about_since || t('about_since', lang)}
              </span>
              <h3 className="font-display text-4xl md:text-5xl tracking-widest text-brand-dark mt-3 mb-6">
                {t('about_story_title', lang)}
              </h3>
              <div className="space-y-4 text-black/60 text-sm md:text-base leading-relaxed max-w-xl">
                <p>{(lang === 'ar' ? sc?.about_story_p1_ar : sc?.about_story_p1_en) || t('about_story_p1', lang)}</p>
                <p>{(lang === 'ar' ? sc?.about_story_p2_ar : sc?.about_story_p2_en) || t('about_story_p2', lang)}</p>
                <p>{(lang === 'ar' ? sc?.about_story_p3_ar : sc?.about_story_p3_en) || t('about_story_p3', lang)}</p>
              </div>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-black/10">
              {COUNTERS.map(({ key, value, suffix }) => (
                <div key={key}>
                  <span className="font-display text-4xl text-brand-dark">{value}{suffix}</span>
                  <p className="text-black/40 text-xs tracking-widest uppercase mt-1">{t(key, lang)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="relative overflow-hidden rounded-2xl bg-brand-dark min-h-[300px] xl:min-h-0">
            <img
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
              alt="Team at work"
              className="w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-8 left-8">
              <p className="font-display text-white text-3xl tracking-widest">BOLD IDEAS.</p>
              <p className="font-display text-brand-red text-3xl tracking-widest">ZERO APOLOGIES.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Offices Map ── */}
      <section className="px-6 pb-16 max-w-[1400px] mx-auto">
        <div className="mb-8">
          <SectionHeading
            eyebrow={t('about_offices_eyebrow', lang)}
            title={t('about_offices_title', lang)}
            subtitle={t('about_offices_subtitle', lang)}
          />
        </div>
        <OfficesMap lang={lang} />
      </section>

      {/* ── Why Us ── */}
      <section className="px-6 pb-16 max-w-[1400px] mx-auto">
        <div
          ref={whyRef}
          className={`mb-10 transition-all duration-700 ${whyVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading
            eyebrow={t('label_why', lang)}
            title={t('why_title', lang)}
            subtitle={t('why_subtitle', lang)}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {WHY_US.map((item, i) => (
            <WhyUsCard key={item._id} item={item} index={i} lang={lang} />
          ))}
        </div>
      </section>

      {/* ── Team ── */}
      <section className="px-6 pb-24 max-w-[1400px] mx-auto">
        <div
          ref={teamRef}
          className={`mb-10 transition-all duration-700 ${teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <SectionHeading
            eyebrow={t('about_team_eyebrow', lang)}
            title={t('label_team', lang)}
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TEAM.map((member, i) => (
            <TeamCard key={member._id} member={member} index={i} />
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-gray">
        <div className="max-w-[1400px] mx-auto px-6 py-20 flex flex-col items-center text-center gap-6">
          <h2 className="font-display text-white text-4xl md:text-5xl xl:text-6xl tracking-widest">
            {t('about_cta_title', lang)}
          </h2>
          <p className="text-white/40 text-sm md:text-base max-w-xl leading-relaxed">
            {t('about_cta_subtitle', lang)}
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
