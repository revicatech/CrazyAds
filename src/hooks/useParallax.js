import { useEffect, useRef } from 'react'

/**
 * Attaches a passive scroll listener to the element at `ref`.
 * Applies `transform: translateY(scrollY * speed)` as an inline style.
 *
 * @param {number} speed - multiplier, e.g. 0.3 means 30% of scroll distance
 * @returns React ref to attach to the target element
 */
export function useParallax(speed = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    function onScroll() {
      el.style.transform = `translateY(${window.scrollY * speed}px)`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [speed])

  return ref
}
