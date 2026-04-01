import { useState, useEffect, useRef } from 'react'

/**
 * Animates a number from 0 to `target` over `duration` ms.
 * Starts when `trigger` becomes true (fires once).
 *
 * Returns the current animated value as a string (with suffix appended).
 */
export function useCounterAnimation({ target, suffix = '', duration = 1200, trigger }) {
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!trigger || started.current) return
    started.current = true

    const start    = performance.now()
    const end      = start + duration

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      // ease-out cubic
      const eased  = 1 - Math.pow(1 - progress, 3)
      setValue(Math.floor(eased * target))

      if (now < end) requestAnimationFrame(tick)
      else setValue(target)
    }

    requestAnimationFrame(tick)
  }, [trigger, target, duration, suffix])

  return `${value}${suffix}`
}
