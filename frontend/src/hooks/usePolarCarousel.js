import { useRef, useEffect, useCallback } from 'react'

const AUTO_SPEED    = 9    // angle units per second
const DRAG_SENS     = 0.28 // drag sensitivity
const INERTIA_DAMP  = 0.92 // velocity decay per frame

/**
 * Manages the polar wheel state: angle θ, drag, inertia, auto-scroll.
 *
 * @param {number} cardCount
 * @param {(theta: number) => void} onFrame - called each RAF with current theta
 */
export function usePolarCarousel(cardCount, onFrame) {
  const theta    = useRef(0)
  const velocity = useRef(0)
  const isDrag   = useRef(false)
  const lastX    = useRef(0)
  const lastY    = useRef(0)
  const prevTs   = useRef(null)
  const rafId    = useRef(null)
  const elRef    = useRef(null)

  const loop = useCallback((ts) => {
    if (!prevTs.current) prevTs.current = ts
    const dt = Math.min((ts - prevTs.current) / 1000, 0.1) // seconds, capped
    prevTs.current = ts

    if (isDrag.current) {
      // During drag: velocity is set by pointer events
    } else {
      // Auto-scroll + inertia
      velocity.current = velocity.current * INERTIA_DAMP + AUTO_SPEED * dt * (1 - Math.abs(velocity.current) / 200)
    }

    theta.current += velocity.current
    onFrame(theta.current)
    rafId.current = requestAnimationFrame(loop)
  }, [onFrame])

  useEffect(() => {
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [loop])

  // Mouse handlers
  useEffect(() => {
    const el = elRef.current
    if (!el) return

    function onMouseDown(e) {
      isDrag.current = true
      velocity.current = 0
      lastX.current = e.clientX
      lastY.current = e.clientY
    }
    function onMouseMove(e) {
      if (!isDrag.current) return
      const dx = e.clientX - lastX.current
      lastX.current = e.clientX
      velocity.current = dx * DRAG_SENS
      theta.current += velocity.current
    }
    function onMouseUp() { isDrag.current = false }

    function onTouchStart(e) {
      isDrag.current = true
      velocity.current = 0
      lastX.current = e.touches[0].clientX
    }
    function onTouchMove(e) {
      if (!isDrag.current) return
      const dx = e.touches[0].clientX - lastX.current
      lastX.current = e.touches[0].clientX
      velocity.current = dx * DRAG_SENS
      theta.current += velocity.current
    }
    function onTouchEnd() { isDrag.current = false }

    el.addEventListener('mousedown',  onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup',   onMouseUp)
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: true })
    el.addEventListener('touchend',   onTouchEnd)

    return () => {
      el.removeEventListener('mousedown',  onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup',   onMouseUp)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [])

  return elRef
}
