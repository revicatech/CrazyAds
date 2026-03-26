import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 55
const SHAPES = ['star', 'triangle', 'ring', 'cross', 'lightning', 'square', 'diamond', 'spark']
const COLORS = ['#dc1e1e', '#ff4444', '#ffffff', '#ffcccc', '#ff8888']

function randomBetween(a, b) { return a + Math.random() * (b - a) }

function createParticle(w, h) {
  return {
    x:        randomBetween(0, w),
    y:        randomBetween(0, h),
    speedX:   randomBetween(-0.4, 0.4),
    speedY:   randomBetween(-0.8, -0.2),
    size:     randomBetween(4, 14),
    shape:    SHAPES[Math.floor(Math.random() * SHAPES.length)],
    color:    COLORS[Math.floor(Math.random() * COLORS.length)],
    rotation: randomBetween(0, Math.PI * 2),
    rotSpeed: randomBetween(-0.02, 0.02),
    life:     randomBetween(80, 200),
    age:      0,
  }
}

function drawShape(ctx, p) {
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle   = p.color
  ctx.strokeStyle = p.color
  ctx.lineWidth   = 1.5
  ctx.globalAlpha = 1 - p.age / p.life

  const s = p.size

  switch (p.shape) {
    case 'star': {
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const outerX = Math.cos((Math.PI * 2 * i) / 5 - Math.PI / 2) * s
        const outerY = Math.sin((Math.PI * 2 * i) / 5 - Math.PI / 2) * s
        const innerX = Math.cos((Math.PI * 2 * i + Math.PI) / 5 - Math.PI / 2) * (s * 0.4)
        const innerY = Math.sin((Math.PI * 2 * i + Math.PI) / 5 - Math.PI / 2) * (s * 0.4)
        i === 0 ? ctx.moveTo(outerX, outerY) : ctx.lineTo(outerX, outerY)
        ctx.lineTo(innerX, innerY)
      }
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'triangle': {
      ctx.beginPath()
      ctx.moveTo(0, -s)
      ctx.lineTo(s * 0.87, s * 0.5)
      ctx.lineTo(-s * 0.87, s * 0.5)
      ctx.closePath()
      ctx.fill()
      break
    }
    case 'ring': {
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.7, 0, Math.PI * 2)
      ctx.stroke()
      break
    }
    case 'cross': {
      ctx.beginPath()
      ctx.moveTo(-s, 0); ctx.lineTo(s, 0)
      ctx.moveTo(0, -s); ctx.lineTo(0, s)
      ctx.stroke()
      break
    }
    case 'lightning': {
      ctx.beginPath()
      ctx.moveTo(s * 0.2, -s)
      ctx.lineTo(-s * 0.2, 0)
      ctx.lineTo(s * 0.2, 0)
      ctx.lineTo(-s * 0.2, s)
      ctx.stroke()
      break
    }
    case 'square': {
      ctx.fillRect(-s * 0.6, -s * 0.6, s * 1.2, s * 1.2)
      break
    }
    case 'diamond': {
      ctx.beginPath()
      ctx.moveTo(0, -s); ctx.lineTo(s * 0.6, 0)
      ctx.lineTo(0, s);  ctx.lineTo(-s * 0.6, 0)
      ctx.closePath(); ctx.fill()
      break
    }
    case 'spark': {
      ctx.beginPath()
      ctx.arc(0, 0, s * 0.25, 0, Math.PI * 2)
      ctx.fill()
      // rays
      for (let i = 0; i < 4; i++) {
        const a = (Math.PI / 2) * i
        ctx.beginPath()
        ctx.moveTo(Math.cos(a) * s * 0.3, Math.sin(a) * s * 0.3)
        ctx.lineTo(Math.cos(a) * s,       Math.sin(a) * s)
        ctx.stroke()
      }
      break
    }
    default: break
  }

  ctx.restore()
}

export default function ParticleCanvas() {
  const canvasRef = useRef(null)
  const mouse     = useRef({ x: -9999, y: -9999 })
  const particles = useRef([])
  const rafId     = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()

    // Init particles
    particles.current = Array.from({ length: PARTICLE_COUNT }, () =>
      createParticle(canvas.width, canvas.height)
    )

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      mouse.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.current = particles.current.map(p => {
        // Mouse repulsion
        const dx = p.x - mouse.current.x
        const dy = p.y - mouse.current.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const force = (100 - dist) / 100
          p = { ...p, speedX: p.speedX + (dx / dist) * force * 0.5, speedY: p.speedY + (dy / dist) * force * 0.5 }
        }

        // Physics
        const next = {
          ...p,
          x:        p.x + p.speedX,
          y:        p.y + p.speedY,
          speedY:   p.speedY - 0.01, // gravity (upward drift)
          speedX:   p.speedX * 0.995,
          rotation: p.rotation + p.rotSpeed,
          age:      p.age + 1,
        }

        // Respawn when dead or off-screen
        if (next.age >= next.life || next.y < -20) {
          return createParticle(canvas.width, canvas.height)
        }

        drawShape(ctx, next)
        return next
      })

      rafId.current = requestAnimationFrame(tick)
    }

    tick()
    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)

    return () => {
      cancelAnimationFrame(rafId.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ pointerEvents: 'auto' }}
    />
  )
}
