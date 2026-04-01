import { INDUSTRY_COLORS, INDUSTRIES as INDUSTRIES_STATIC } from '../../data/industries'
import useFetch from '../../hooks/useFetch'
import { fetchIndustries } from '../../services/api'

const RADIUS = 300

/**
 * 8 cards arranged radially around center.
 * cardStates: [{ angle, scale, opacity, isActive }] from useIndustriesCarousel
 */
export default function RadialCards({ cardStates }) {
  const { data: INDUSTRIES } = useFetch(fetchIndustries, INDUSTRIES_STATIC)
  return (
    <div className="relative w-full h-full">
      {INDUSTRIES.map((ind, i) => {
        const state  = cardStates[i]
        const colors = INDUSTRY_COLORS[ind.colorIndex]
        const rad    = (state.angle * Math.PI) / 180
        const x      = Math.cos(rad) * RADIUS
        const y      = Math.sin(rad) * RADIUS

        return (
          <div
            key={ind._id}
            className="absolute top-1/2 left-1/2 w-48 rounded-2xl p-5 flex flex-col gap-2 cursor-pointer transition-shadow duration-300"
            style={{
              transform:  `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${state.scale})`,
              opacity:    state.opacity,
              background: colors.bg,
              color:      colors.text,
              zIndex:     state.isActive ? 10 : 1,
              willChange: 'transform, opacity',
              boxShadow:  state.isActive ? '0 20px 60px rgba(0,0,0,0.4)' : 'none',
            }}
          >
            <span className="text-2xl">{i + 1}.</span>
            <p className="font-semibold text-sm leading-snug">{ind.name}</p>
            {state.isActive && (
              <p className="text-[11px] opacity-70 leading-snug mt-1">{ind.headlineEn}</p>
            )}
          </div>
        )
      })}
    </div>
  )
}
