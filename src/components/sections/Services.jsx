import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLang } from '../../context/LanguageContext'
import { SERVICE_SVGS } from '../../data/serviceSvgs'
import useFetch from '../../hooks/useFetch'
import { fetchServices } from '../../services/api'
import { SERVICES as SERVICES_STATIC } from '../../data/services'
import '../cssComponents/Services.css'

gsap.registerPlugin(ScrollTrigger)

// SVG strings for the desktop polar wheel (from test11.html CARD_DATA)
const WHEEL_SVGS = [
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="sg1" cx="50%" cy="50%"><stop offset="0%" stop-color="#3a0808"/><stop offset="100%" stop-color="#0d0d0d"/></radialGradient></defs><rect width="340" height="200" fill="url(#sg1)"/><polyline points="20,155 70,110 115,130 165,65 210,88 255,42 300,58 330,32" fill="none" stroke="#dc1e1e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" opacity=".9"/><polyline points="20,168 70,140 115,152 165,108 210,120 255,84 300,94 330,68" fill="none" stroke="#ff4444" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" opacity=".35"/><circle cx="165" cy="65" r="5" fill="#dc1e1e"/><circle cx="255" cy="42" r="4" fill="#ff4444" opacity=".8"/><line x1="20" y1="172" x2="330" y2="172" stroke="rgba(255,255,255,.06)" stroke-width="1"/><line x1="20" y1="130" x2="330" y2="130" stroke="rgba(255,255,255,.04)" stroke-width="1"/><line x1="20" y1="88" x2="330" y2="88" stroke="rgba(255,255,255,.04)" stroke-width="1"/><text x="24" y="190" font-family="monospace" font-size="9" fill="rgba(220,30,30,.5)">CTR +148%</text><text x="220" y="190" font-family="monospace" font-size="9" fill="rgba(255,255,255,.2)">ROI x3.2</text></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#0a0a20"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs><rect width="340" height="200" fill="url(#sg2)"/><rect x="30" y="25" width="280" height="150" rx="4" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="1.5"/><rect x="30" y="25" width="32" height="150" fill="rgba(255,255,255,.04)"/><rect x="278" y="25" width="32" height="150" fill="rgba(255,255,255,.04)"/><circle cx="46" cy="54" r="9" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><circle cx="46" cy="100" r="9" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><circle cx="46" cy="146" r="9" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><circle cx="294" cy="54" r="9" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><circle cx="294" cy="100" r="9" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><circle cx="294" cy="146" r="9" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="1.5"/><polygon points="140,72 140,128 192,100" fill="#dc1e1e" opacity=".9"/><circle cx="170" cy="100" r="40" fill="none" stroke="rgba(220,30,30,.28)" stroke-width="1.5"/></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="sg3" cx="50%" cy="50%"><stop offset="0%" stop-color="#1a0828"/><stop offset="100%" stop-color="#0d0d0d"/></radialGradient></defs><rect width="340" height="200" fill="url(#sg3)"/><polygon points="170,18 304,178 36,178" fill="none" stroke="rgba(220,30,30,.35)" stroke-width="1.5"/><polygon points="170,46 274,162 66,162" fill="rgba(220,30,30,.07)"/><circle cx="170" cy="106" r="46" fill="none" stroke="#dc1e1e" stroke-width="2" opacity=".5"/><circle cx="170" cy="106" r="20" fill="#dc1e1e" opacity=".65"/><line x1="36" y1="178" x2="304" y2="178" stroke="rgba(255,255,255,.1)" stroke-width="1"/><line x1="170" y1="18" x2="170" y2="178" stroke="rgba(255,255,255,.06)" stroke-width="1"/></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sg4" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#002218"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs><rect width="340" height="200" fill="url(#sg4)"/><rect x="20" y="18" width="300" height="164" rx="6" fill="rgba(255,255,255,.03)" stroke="rgba(0,184,148,.18)" stroke-width="1"/><rect x="20" y="18" width="300" height="24" rx="6" fill="rgba(0,184,148,.08)"/><circle cx="38" cy="30" r="4" fill="#ff5f56"/><circle cx="54" cy="30" r="4" fill="#ffbd2e"/><circle cx="70" cy="30" r="4" fill="#27c93f"/><text x="30" y="66" font-family="monospace" font-size="11" fill="rgba(0,184,148,.7)">&lt;section</text><text x="114" y="66" font-family="monospace" font-size="11" fill="rgba(255,255,255,.22)"> id=</text><text x="150" y="66" font-family="monospace" font-size="11" fill="#dc1e1e">"craft"</text><text x="30" y="88" font-family="monospace" font-size="11" fill="rgba(255,255,255,.16)">  display: flex;</text><text x="30" y="108" font-family="monospace" font-size="11" fill="rgba(255,255,255,.16)">  gap: 0 0 0 inf;</text><text x="30" y="128" font-family="monospace" font-size="11" fill="rgba(0,184,148,.45)">&lt;/section&gt;</text><text x="30" y="166" font-family="monospace" font-size="9" fill="rgba(255,255,255,.1)">// made with chaos + caffeine</text></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="sg5" cx="30%" cy="50%"><stop offset="0%" stop-color="#1a0e00"/><stop offset="100%" stop-color="#0d0d0d"/></radialGradient></defs><rect width="340" height="200" fill="url(#sg5)"/><path d="M96,100 L96,38 A58,58 0 0,1 146,70 Z" fill="#dc1e1e" opacity=".85"/><path d="M96,100 L146,70 A58,58 0 0,1 142,158 Z" fill="#e67e22" opacity=".7"/><path d="M96,100 L142,158 A58,58 0 0,1 38,158 Z" fill="#f39c12" opacity=".5"/><path d="M96,100 L38,158 A58,58 0 1,1 96,38 Z" fill="rgba(255,255,255,.05)"/><rect x="196" y="140" width="18" height="40" fill="#dc1e1e" opacity=".8"/><rect x="222" y="116" width="18" height="64" fill="#e67e22" opacity=".7"/><rect x="248" y="96" width="18" height="84" fill="#f39c12" opacity=".6"/><rect x="274" y="74" width="18" height="106" fill="#dc1e1e" opacity=".9"/><line x1="188" y1="180" x2="304" y2="180" stroke="rgba(255,255,255,.1)" stroke-width="1"/></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="sg6" cx="50%" cy="50%"><stop offset="0%" stop-color="#100018"/><stop offset="100%" stop-color="#0d0d0d"/></radialGradient></defs><rect width="340" height="200" fill="url(#sg6)"/><circle cx="148" cy="86" r="54" fill="cyan" opacity=".16"/><circle cx="192" cy="86" r="54" fill="magenta" opacity=".16"/><circle cx="170" cy="124" r="54" fill="yellow" opacity=".16"/><circle cx="148" cy="86" r="54" fill="none" stroke="cyan" stroke-width="1" opacity=".28"/><circle cx="192" cy="86" r="54" fill="none" stroke="magenta" stroke-width="1" opacity=".28"/><circle cx="170" cy="124" r="54" fill="none" stroke="yellow" stroke-width="1" opacity=".28"/><text x="104" y="188" font-family="monospace" font-size="9" fill="rgba(0,255,255,.4)">C</text><text x="126" y="188" font-family="monospace" font-size="9" fill="rgba(255,0,255,.4)">M</text><text x="148" y="188" font-family="monospace" font-size="9" fill="rgba(255,255,0,.4)">Y</text><text x="170" y="188" font-family="monospace" font-size="9" fill="rgba(255,255,255,.2)">K</text></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="sg7a" cx="25%" cy="0%"><stop offset="0%" stop-color="rgba(220,30,30,.28)"/><stop offset="100%" stop-color="transparent"/></radialGradient><radialGradient id="sg7b" cx="75%" cy="0%"><stop offset="0%" stop-color="rgba(255,200,0,.16)"/><stop offset="100%" stop-color="transparent"/></radialGradient></defs><rect width="340" height="200" fill="#0d0d0d"/><rect width="340" height="200" fill="url(#sg7a)"/><rect width="340" height="200" fill="url(#sg7b)"/><line x1="68" y1="0" x2="10" y2="200" stroke="rgba(220,30,30,.12)" stroke-width="44"/><line x1="272" y1="0" x2="330" y2="200" stroke="rgba(255,200,0,.08)" stroke-width="44"/><rect x="0" y="165" width="340" height="35" fill="rgba(255,255,255,.025)"/><circle cx="62" cy="42" r="3" fill="#dc1e1e" opacity=".8"/><circle cx="170" cy="22" r="2" fill="#ffd700" opacity=".7"/><circle cx="260" cy="36" r="3" fill="#fff" opacity=".5"/><rect x="44" y="48" width="7" height="15" rx="1" fill="#dc1e1e" opacity=".5" transform="rotate(-20 47 55)"/><rect x="196" y="32" width="6" height="13" rx="1" fill="#ffd700" opacity=".45" transform="rotate(15 199 38)"/><rect x="280" y="56" width="7" height="13" rx="1" fill="#fff" opacity=".3" transform="rotate(-10 283 62)"/></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="sg8" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#200000"/><stop offset="100%" stop-color="#0d0d0d"/></linearGradient></defs><rect width="340" height="200" fill="url(#sg8)"/><path d="M34,28 L306,28 L228,86 L228,170 L112,170 L112,86 Z" fill="rgba(220,30,30,.08)" stroke="rgba(220,30,30,.3)" stroke-width="1.5"/><path d="M62,28 L278,28 L228,86 L112,86 Z" fill="rgba(220,30,30,.12)"/><path d="M112,86 L228,86 L228,130 L112,130 Z" fill="rgba(220,30,30,.18)"/><path d="M112,130 L228,130 L228,170 L112,170 Z" fill="#dc1e1e" opacity=".35"/><text x="136" y="60" font-family="monospace" font-size="9" fill="rgba(255,255,255,.4)">Leads</text><text x="148" y="112" font-family="monospace" font-size="9" fill="rgba(255,255,255,.35)">Deals</text><text x="144" y="154" font-family="monospace" font-size="9" fill="rgba(255,255,255,.55)">Closed</text></svg>`,
  `<svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="sg9" cx="50%" cy="50%"><stop offset="0%" stop-color="#001828"/><stop offset="100%" stop-color="#0d0d0d"/></radialGradient></defs><rect width="340" height="200" fill="url(#sg9)"/><line x1="20" y1="100" x2="20" y2="100" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".4"/><line x1="36" y1="86" x2="36" y2="114" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".5"/><line x1="52" y1="68" x2="52" y2="132" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".65"/><line x1="68" y1="48" x2="68" y2="152" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round" opacity=".85"/><line x1="84" y1="30" x2="84" y2="170" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round"/><line x1="100" y1="50" x2="100" y2="150" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round" opacity=".9"/><line x1="116" y1="36" x2="116" y2="164" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round"/><line x1="132" y1="18" x2="132" y2="182" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round"/><line x1="148" y1="36" x2="148" y2="164" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round" opacity=".95"/><line x1="164" y1="54" x2="164" y2="146" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".75"/><line x1="180" y1="70" x2="180" y2="130" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".65"/><line x1="196" y1="82" x2="196" y2="118" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".55"/><line x1="212" y1="90" x2="212" y2="110" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".45"/><line x1="228" y1="82" x2="228" y2="118" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".5"/><line x1="244" y1="64" x2="244" y2="136" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round" opacity=".7"/><line x1="260" y1="48" x2="260" y2="152" stroke="#dc1e1e" stroke-width="3" stroke-linecap="round" opacity=".85"/><line x1="276" y1="68" x2="276" y2="132" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".55"/><line x1="292" y1="82" x2="292" y2="118" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".45"/><line x1="308" y1="90" x2="308" y2="110" stroke="#2980b9" stroke-width="3" stroke-linecap="round" opacity=".35"/></svg>`,
]

export default function Services() {
  const { lang } = useLang()
  const { data: SERVICES } = useFetch(fetchServices, SERVICES_STATIC)
  const ringRef = useRef(null)
  const vpRef = useRef(null)

  useEffect(() => {
    const ringEl = ringRef.current
    const vp = vpRef.current
    if (!ringEl || !vp || SERVICES.length === 0) return

    const R = 900
    const CARD_W = 340
    const CARD_H = 338
    const N_CARDS = SERVICES.length
    const STEP = 28
    const AUTO_SPD = 9
    const DRAG_SENS = 0.28
    const INERTIA = 0.92
    const RCX = R
    const RCY = R
    const SPAN = N_CARDS * STEP
    const VISIBLE_MIN = -50
    const VISIBLE_MAX = 50
    const EXIT_PAD = 30

    const CARD_DATA = SERVICES.map((svc, i) => ({
      num: svc.num,
      name: lang === 'ar' ? svc.ar : svc.en,
      svg: WHEEL_SVGS[i],
    }))

    // Clear any previously mounted cards
    ringEl.innerHTML = ''

    const cards = CARD_DATA.map((data, i) => {
      const el = document.createElement('div')
      el.className = 'svc-card'
      el.innerHTML = `<div class="svc-card-img">${data.svg}</div>
        <div class="svc-card-label">
          <span class="svc-card-num">${data.num}</span>
          <span class="svc-card-name">${data.name}</span>
        </div>`
      el.style.opacity = '0'
      el.style.transformOrigin = 'center bottom'
      ringEl.appendChild(el)
      return { el, baseAngle: i * STEP }
    })

    function placeCard(card, theta) {
      const rad = theta * Math.PI / 180
      const cx = RCX + R * Math.sin(rad)
      const cy = RCY - R * Math.cos(rad)
      const left = cx - CARD_W / 2
      const top = cy - (card.el.offsetHeight || CARD_H)
      gsap.set(card.el, { left, top, rotation: theta, transformOrigin: 'center bottom' })
    }

    function paint() {
      const exitRight = VISIBLE_MAX + EXIT_PAD
      const exitLeft = VISIBLE_MIN - EXIT_PAD
      cards.forEach(card => {
        let eff = card.baseAngle + ringAngle
        if (eff > exitRight) {
          const jumps = Math.ceil((eff - exitRight) / SPAN)
          card.baseAngle -= jumps * SPAN
          eff = card.baseAngle + ringAngle
        } else if (eff < exitLeft) {
          const jumps = Math.ceil((exitLeft - eff) / SPAN)
          card.baseAngle += jumps * SPAN
          eff = card.baseAngle + ringAngle
        }
        const visible = eff >= exitLeft && eff <= exitRight
        card.el.style.visibility = visible ? 'visible' : 'hidden'
        if (!visible) return
        placeCard(card, eff)
      })
    }

    let ringAngle = 0, velocity = 0, dragging = false, dragLastX = 0, running = false

    const intro = gsap.timeline({
      scrollTrigger: { trigger: '#services', start: 'top 75%', once: true },
      onComplete() { running = true },
    })
    cards.forEach((card, i) => {
      placeCard(card, card.baseAngle)
      intro.to(card.el, { opacity: 1, duration: .55, ease: 'power2.out' }, 0.1 + i * 0.07)
    })

    const tickerCb = (time, deltaTime) => {
      if (!running) return
      const dt = Math.min(deltaTime / 1000, 0.05)
      if (!dragging) {
        if (Math.abs(velocity) > 0.02) { ringAngle += velocity; velocity *= INERTIA }
        else { velocity = 0; ringAngle += AUTO_SPD * dt }
      }
      paint()
    }
    gsap.ticker.add(tickerCb)

    const SHADOW_NORMAL = '0 2px 8px rgba(0,0,0,.06),0 8px 32px rgba(0,0,0,.07),0 24px 64px rgba(0,0,0,.05),inset 0 0 0 1px rgba(0,0,0,.06)'
    const SHADOW_HOVER  = '0 4px 12px rgba(0,0,0,.1),0 16px 48px rgba(0,0,0,.12),0 40px 80px rgba(0,0,0,.08),inset 0 0 0 1px rgba(0,0,0,.1)'

    cards.forEach(card => {
      card.el.addEventListener('mouseenter', () => {
        gsap.to(card.el, { scale: 1.09, boxShadow: SHADOW_HOVER, duration: .35, ease: 'power2.out' })
      })
      card.el.addEventListener('mouseleave', () => {
        gsap.to(card.el, { scale: 1, boxShadow: SHADOW_NORMAL, duration: .55, ease: 'elastic.out(1,.55)' })
      })
    })

    const onMouseDown = e => { dragging = true; dragLastX = e.clientX; velocity = 0 }
    const onMouseMove = e => {
      if (!dragging) return
      const dx = e.clientX - dragLastX
      velocity = dx * DRAG_SENS
      ringAngle += velocity
      dragLastX = e.clientX
      paint()
    }
    const onMouseUp = () => { dragging = false }
    const onTouchStart = e => { dragging = true; dragLastX = e.touches[0].clientX; velocity = 0 }
    const onTouchMove = e => {
      if (!dragging) return
      const dx = e.touches[0].clientX - dragLastX
      velocity = dx * DRAG_SENS
      ringAngle += velocity
      dragLastX = e.touches[0].clientX
      paint()
    }
    const onTouchEnd = () => { dragging = false }

    vp.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    vp.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      gsap.ticker.remove(tickerCb)
      intro.kill()
      vp.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      vp.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      ringEl.innerHTML = ''
    }
  }, [lang, SERVICES])

  return (
    <section id="services">

      {/* Header */}
      <div className="services-header">
        <span className="section-label-srv">
          {lang === 'ar' ? 'ماذا نقدم' : 'What We Do'}
        </span>
        <h2>OUR<br /><em>craft</em></h2>
      </div>

      {/* Desktop polar wheel */}
      <div className="svc-wheel-viewport" ref={vpRef}>
        <div id="svcRing" ref={ringRef}></div>
      </div>

      {/* Mobile 2-col grid */}
      <div className="svc-mobile-grid">
        {SERVICES.map((svc, i) => (
          <div className="svc-mobile-card" key={svc._id}>
            <div className="svc-mobile-card-img">
              {SERVICE_SVGS[i]({ uid: `m${i}` })}
            </div>
            <div className="svc-mobile-card-label">
              <span className="svc-mobile-card-num">{svc.num}</span>
              <span className="svc-mobile-card-name">
                {lang === 'ar' ? svc.ar : svc.en}
              </span>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}
