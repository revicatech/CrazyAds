import { useState, useRef, useEffect } from 'react'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import SectionHeading from '../ui/SectionHeading'
import useFetch from '../../hooks/useFetch'
import { fetchTeam } from '../../services/api'
import { TEAM as TEAM_STATIC } from '../../data/team'

function TeamCard({ member, lang }) {
  return (
    <div className="group flex-shrink-0 w-[75vw] sm:w-[280px] md:w-[300px]">
      <div className="relative overflow-hidden rounded-2xl mb-4 aspect-[3/4]">
        <img
          src={member.image}
          alt={member.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <h3 className="font-semibold text-brand-dark text-lg">{member.name}</h3>
      <p className="text-black/50 text-sm mt-1">{t(member.roleKey, lang)}</p>
    </div>
  )
}

export default function Team() {
  const { lang } = useLang()
  const { ref, isVisible } = useRevealOnScroll()
  const { data: TEAM } = useFetch(fetchTeam, TEAM_STATIC)

  const gap = 24
  const [cardWidth, setCardWidth] = useState(300)
  const [viewportWidth, setViewportWidth] = useState(0)
  const trackRef = useRef(null)
  const viewportRef = useRef(null)
  const [index, setIndex] = useState(0)

  // Filter out members with no name or image
  const members = TEAM.filter((m) => m.name && m.image)
  const count = members.length
  const step = cardWidth + gap

  // How many cards fit in the viewport
  const visibleCount = viewportWidth > 0 ? Math.max(1, Math.floor((viewportWidth + gap) / step)) : 1
  const maxIndex = Math.max(0, count - visibleCount)

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current
      const viewport = viewportRef.current
      if (!track || !track.firstElementChild || !viewport) return
      setCardWidth(track.firstElementChild.getBoundingClientRect().width)
      setViewportWidth(viewport.getBoundingClientRect().width)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [members.length])

  const prev = () => setIndex((i) => (i === 0 ? maxIndex : i - 1))
  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1))

  // Auto-play
  useEffect(() => {
    if (count < 2) return
    const id = setInterval(() => setIndex((i) => (i >= maxIndex ? 0 : i + 1)), 4000)
    return () => clearInterval(id)
  }, [count, maxIndex])

  const sign = lang === 'ar' ? '' : '-'

  return (
    <section id="team" className="py-24 px-6 max-w-[1400px] mx-auto">
      {/* Header */}
      <div
        ref={ref}
        className={`mb-12 flex items-end justify-between gap-4 transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <SectionHeading
          eyebrow={t('team_eyebrow', lang)}
          title={t('label_team', lang)}
        />

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-10 h-10 rounded-full border border-black/12 flex items-center justify-center text-brand-dark hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-200"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Next"
            className="w-10 h-10 rounded-full border border-black/12 flex items-center justify-center text-brand-dark hover:bg-brand-red hover:text-white hover:border-brand-red transition-all duration-200"
          >
            <svg className="w-4 h-4 rtl:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Slider */}
      <div className="overflow-hidden" ref={viewportRef}>
        <div
          ref={trackRef}
          className="flex gap-6"
          style={{
            transform: `translateX(${sign}${index * step}px)`,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {members.map((member) => (
            <TeamCard key={member._id ?? member.id} member={member} lang={lang} />
          ))}
        </div>
      </div>

      {/* Dots — only for scrollable positions */}
      <div className="flex justify-center gap-2 mt-8">
        {Array.from({ length: maxIndex + 1 }).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`rounded-full transition-all duration-300 ${
              i === index ? 'w-6 h-2 bg-brand-red' : 'w-2 h-2 bg-black/15 hover:bg-black/30'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
