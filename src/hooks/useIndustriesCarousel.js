import { useState, useEffect, useRef } from 'react'

const CARD_COUNT = 8
const SPREAD_DEG = 52 // degrees between adjacent cards

/**
 * Maps scroll progress within the Industries section to a rotation angle.
 * Returns { activeIndex, rotation, cardStates }
 *
 * @param {React.RefObject} sectionRef - ref on the 900vh wrapper
 */
export function useIndustriesCarousel(sectionRef) {
  const [rotation, setRotation] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    function onScroll() {
      const el = sectionRef.current
      if (!el) return

      const rect     = el.getBoundingClientRect()
      const total    = el.offsetHeight - window.innerHeight
      const scrolled = Math.max(0, -rect.top)
      const progress = Math.min(scrolled / total, 1)

      // Rotate through all cards: full sweep = (CARD_COUNT - 1) * SPREAD_DEG
      const maxAngle = (CARD_COUNT - 1) * SPREAD_DEG
      const angle    = progress * maxAngle
      setRotation(angle)

      // Active card = whichever is closest to center (angle 0)
      const idx = Math.round(angle / SPREAD_DEG)
      setActiveIndex(Math.min(idx, CARD_COUNT - 1))
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [sectionRef])

  // Per-card visual state
  const cardStates = Array.from({ length: CARD_COUNT }, (_, i) => {
    const cardAngle = i * SPREAD_DEG - rotation
    const absDiff   = Math.abs(cardAngle)
    const isActive  = i === activeIndex
    const scale     = isActive ? 1 : Math.max(0.75, 1 - absDiff / 200)
    const opacity   = isActive ? 1 : Math.max(0.3, 1 - absDiff / 150)
    return { angle: cardAngle, scale, opacity, isActive }
  })

  return { rotation, activeIndex, cardStates }
}
