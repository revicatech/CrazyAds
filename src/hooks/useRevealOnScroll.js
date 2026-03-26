import { useEffect, useRef, useState } from 'react'

/**
 * Returns { ref, isVisible }.
 * Attach `ref` to the element you want to observe.
 * `isVisible` flips to true once the element enters the viewport and stays true.
 *
 * @param {number} threshold - 0–1, fraction of element visible before triggering (default 0.15)
 */
export function useRevealOnScroll(threshold = 0.15) {
  const ref       = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect() // fire once
        }
      },
      { threshold }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, isVisible }
}
