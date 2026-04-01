import { useState, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import { useParallax } from '../../hooks/useParallax'
import SectionHeading from '../ui/SectionHeading'
import { fetchSiteContent } from '../../services/api'

const COUNTERS = [
  { key: 'about_years',     value: 14,  suffix: '+' },
  { key: 'about_campaigns', value: 300, suffix: '+' },
  { key: 'about_markets',   value: 8,   suffix: ''  },
  { key: 'about_awards',    value: 47,  suffix: ''  },
]

function AboutDesktop({ sc, lang }) {
  const parallaxRef = useParallax(-0.05)

  const since = sc?.about_since || t('about_since', lang)
  const p1 = (lang === 'ar' ? sc?.about_story_p1_ar : sc?.about_story_p1_en) || t('about_story_p1', lang)
  const p2 = (lang === 'ar' ? sc?.about_story_p2_ar : sc?.about_story_p2_en) || t('about_story_p2', lang)
  const p3 = (lang === 'ar' ? sc?.about_story_p3_ar : sc?.about_story_p3_en) || t('about_story_p3', lang)

  return (
    <div className="hidden xl:grid xl:grid-cols-3 xl:gap-6 min-h-[700px]">
      {/* Left column: story text */}
      <div className="col-span-2 flex flex-col justify-between bg-brand-light rounded-3xl p-12">
        <SectionHeading eyebrow={since} title="OUR STORY" />
        <div className="space-y-4 text-black/60 text-base leading-relaxed max-w-lg mt-8">
          <p>{p1}</p>
          <p>{p2}</p>
          <p>{p3}</p>
        </div>

        {/* Counters */}
        <div className="grid grid-cols-4 gap-6 mt-12 pt-8 border-t border-black/10">
          {COUNTERS.map(({ key, value, suffix }) => (
            <div key={key}>
              <span className="font-display text-4xl text-brand-dark">{value}{suffix}</span>
              <p className="text-black/40 text-xs tracking-widest uppercase mt-1">{key.replace('about_', '')}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right column: image with parallax */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-dark" ref={parallaxRef}>
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
  )
}

function AboutMobile({ sc, lang }) {
  const since = sc?.about_since || t('about_since', lang)
  const p1 = (lang === 'ar' ? sc?.about_story_p1_ar : sc?.about_story_p1_en) || t('about_story_p1', lang)

  return (
    <div className="xl:hidden space-y-4">
      {/* Story card */}
      <div className="bg-brand-light rounded-2xl p-8">
        <SectionHeading eyebrow={since} title="OUR STORY" />
        <p className="text-black/60 text-sm leading-relaxed mt-6">{p1}</p>
      </div>

      {/* Image card */}
      <div className="relative overflow-hidden rounded-2xl h-56">
        <img
          src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=800"
          alt="Team"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <p className="absolute bottom-4 left-4 font-display text-white text-2xl tracking-widest">
          BOLD IDEAS. <span className="text-brand-red">ZERO APOLOGIES.</span>
        </p>
      </div>

      {/* Counters */}
      <div className="grid grid-cols-2 gap-4">
        {COUNTERS.map(({ key, value, suffix }) => (
          <div key={key} className="bg-white rounded-2xl p-6 text-center">
            <span className="font-display text-4xl text-brand-dark">{value}{suffix}</span>
            <p className="text-black/40 text-xs tracking-widest uppercase mt-2">{key.replace('about_', '')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()
  const [sc, setSc] = useState({})

  useEffect(() => { fetchSiteContent('about').then(setSc).catch(() => {}) }, [])

  return (
    <section
      id="about"
      ref={ref}
      className={`py-24 px-6 max-w-[1400px] mx-auto transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      <AboutDesktop sc={sc} lang={lang} />
      <AboutMobile sc={sc} lang={lang} />
    </section>
  )
}
