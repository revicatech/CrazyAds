import { useEffect, useRef } from 'react'

/**
 * Drives the Einstein orbit animation via requestAnimationFrame.
 *
 * `items` — array of { speed, radius, offset } (angles in degrees)
 * Returns a ref to attach to the container element (used only to check mount).
 * Each orbit item element is accessed via `itemRefs.current[i]`.
 */
export function useEinsteinOrbit(items, itemRefs) {
  const rafId   = useRef(null)
  const startTs = useRef(null)

  useEffect(() => {
    function tick(ts) {
      if (!startTs.current) startTs.current = ts
      const elapsed = (ts - startTs.current) / 1000 // seconds

      items.forEach((item, i) => {
        const el = itemRefs.current[i]
        if (!el) return

        const angle   = (item.offset + elapsed * item.speed * 60) % 360
        const rad     = (angle * Math.PI) / 180
        const x       = Math.cos(rad) * item.radius
        const y       = Math.sin(rad) * item.radius
        // Depth: -1 (far) to +1 (near) using sin of angle
        const depth   = Math.sin(rad)
        const scale   = 0.62 + 0.38 * ((depth + 1) / 2)
        const opacity = 0.4 + 0.6  * ((depth + 1) / 2)
        const zIndex  = Math.round((depth + 1) * 5)

        el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`
        el.style.opacity   = opacity
        el.style.zIndex    = zIndex
      })

      rafId.current = requestAnimationFrame(tick)
    }

    rafId.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId.current)
  }, [items, itemRefs])
}
