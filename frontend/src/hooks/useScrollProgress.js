import { useState, useEffect } from 'react'

/**
 * Returns scroll state used by Navbar, LabTube, and any scroll-driven section.
 * Single listener shared via import — each component calling this hook gets its own instance,
 * but the cost is minimal (passive listener).
 */
export function useScrollProgress() {
  const [state, setState] = useState({
    scrollY:       0,
    progress:      0,   // 0–1
    navbarVisible: false,
  })

  useEffect(() => {
    function onScroll() {
      const y       = window.scrollY
      const maxY    = document.documentElement.scrollHeight - window.innerHeight
      const progress = maxY > 0 ? Math.min(y / maxY, 1) : 0

      setState({
        scrollY:       y,
        progress,
        navbarVisible: y > 80,
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // initialise
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return state
}
