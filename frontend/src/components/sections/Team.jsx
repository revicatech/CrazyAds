import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import SectionHeading from '../ui/SectionHeading'
import useFetch from '../../hooks/useFetch'
import { fetchTeam } from '../../services/api'
import { TEAM as TEAM_STATIC } from '../../data/team'

function TeamCard({ member, index, lang }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)

  return (
    <div
      ref={ref}
      className={`group transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Photo */}
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

  return (
    <section id="team" className="py-24 px-6 max-w-[1400px] mx-auto">
      <div
        ref={ref}
        className={`mb-12 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <SectionHeading
          eyebrow={t('team_eyebrow', lang)}
          title={t('label_team', lang)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {TEAM.map((member, i) => (
          <TeamCard key={member._id} member={member} index={i} lang={lang} />
        ))}
      </div>
    </section>
  )
}
