/**
 * SVG illustrations for each service card.
 * Call as a function: SERVICE_SVGS[i]({ uid: 'unique-string' })
 * The `uid` namespaces gradient IDs to prevent conflicts when both
 * the polar wheel and mobile grid are in the DOM simultaneously.
 */

export const SERVICE_SVGS = [

  // 01 — Digital Marketing
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id={`mg1-${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#3a0808" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg1-${uid})`} />
      <polyline points="20,155 70,110 115,130 165,65 210,88 255,42 300,58 330,32"
        fill="none" stroke="#dc1e1e" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" opacity=".9" />
      <polyline points="20,168 70,140 115,152 165,108 210,120 255,84 300,94 330,68"
        fill="none" stroke="#ff4444" strokeWidth="1.2"
        strokeLinecap="round" strokeLinejoin="round" opacity=".35" />
      <circle cx="165" cy="65" r="5" fill="#dc1e1e" />
      <text x="24" y="190" fontFamily="monospace" fontSize="9" fill="rgba(220,30,30,.5)">CTR +148%</text>
    </svg>
  ),

  // 02 — Video Production
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id={`mg2-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#0a0a20" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg2-${uid})`} />
      <rect x="30" y="25" width="280" height="150" rx="4"
        fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1.5" />
      <polygon points="140,72 140,128 192,100" fill="#dc1e1e" opacity=".9" />
      <circle cx="170" cy="100" r="40"
        fill="none" stroke="rgba(220,30,30,.28)" strokeWidth="1.5" />
    </svg>
  ),

  // 03 — Brand Identity
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id={`mg3-${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#1a0828" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg3-${uid})`} />
      <polygon points="170,18 304,178 36,178"
        fill="none" stroke="rgba(220,30,30,.35)" strokeWidth="1.5" />
      <polygon points="170,46 274,162 66,162" fill="rgba(220,30,30,.07)" />
      <circle cx="170" cy="106" r="20" fill="#dc1e1e" opacity=".65" />
    </svg>
  ),

  // 04 — Web & App Dev
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id={`mg4-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stopColor="#002218" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg4-${uid})`} />
      <rect x="20" y="18" width="300" height="164" rx="6"
        fill="rgba(255,255,255,.03)" stroke="rgba(0,184,148,.18)" strokeWidth="1" />
      <rect x="20" y="18" width="300" height="24" rx="6" fill="rgba(0,184,148,.08)" />
      <text x="30" y="66" fontFamily="monospace" fontSize="11" fill="rgba(0,184,148,.7)">&lt;section</text>
      <text x="150" y="66" fontFamily="monospace" fontSize="11" fill="#dc1e1e">"craft"</text>
      <text x="30" y="88" fontFamily="monospace" fontSize="11" fill="rgba(255,255,255,.16)"> display: flex;</text>
    </svg>
  ),

  // 05 — Business Analytics
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id={`mg5-${uid}`} cx="30%" cy="50%">
          <stop offset="0%"   stopColor="#1a0e00" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg5-${uid})`} />
      <path d="M96,100 L96,38 A58,58 0 0,1 146,70 Z"    fill="#dc1e1e" opacity=".85" />
      <path d="M96,100 L146,70 A58,58 0 0,1 142,158 Z"  fill="#e67e22" opacity=".7"  />
      <path d="M96,100 L142,158 A58,58 0 0,1 38,158 Z"  fill="#f39c12" opacity=".5"  />
      <rect x="196" y="140" width="18" height="40"  fill="#dc1e1e" opacity=".8"  />
      <rect x="222" y="116" width="18" height="64"  fill="#e67e22" opacity=".7"  />
      <rect x="248" y="96"  width="18" height="84"  fill="#f39c12" opacity=".6"  />
      <rect x="274" y="74"  width="18" height="106" fill="#dc1e1e" opacity=".9"  />
    </svg>
  ),

  // 06 — Print & Production
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id={`mg6-${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#100018" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg6-${uid})`} />
      <circle cx="148" cy="86" r="54" fill="cyan"    opacity=".16" />
      <circle cx="192" cy="86" r="54" fill="magenta" opacity=".16" />
      <circle cx="170" cy="124" r="54" fill="yellow" opacity=".16" />
      <circle cx="148" cy="86"  r="54" fill="none" stroke="cyan"    strokeWidth="1" opacity=".28" />
      <circle cx="192" cy="86"  r="54" fill="none" stroke="magenta" strokeWidth="1" opacity=".28" />
      <circle cx="170" cy="124" r="54" fill="none" stroke="yellow"  strokeWidth="1" opacity=".28" />
    </svg>
  ),

  // 07 — Event Management
  () => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <rect width="340" height="200" fill="#0d0d0d" />
      <line x1="68"  y1="0"   x2="10"  y2="200" stroke="rgba(220,30,30,.12)"  strokeWidth="44" />
      <line x1="272" y1="0"   x2="330" y2="200" stroke="rgba(255,200,0,.08)"  strokeWidth="44" />
      <rect x="0" y="165" width="340" height="35" fill="rgba(255,255,255,.025)" />
      <circle cx="62"  cy="42" r="3" fill="#dc1e1e" opacity=".8" />
      <circle cx="170" cy="22" r="2" fill="#ffd700" opacity=".7" />
      <circle cx="260" cy="36" r="3" fill="#fff"    opacity=".5" />
    </svg>
  ),

  // 08 — Sales & CRM
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <linearGradient id={`mg8-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#200000" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </linearGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg8-${uid})`} />
      <path d="M34,28 L306,28 L228,86 L228,170 L112,170 L112,86 Z"
        fill="rgba(220,30,30,.08)" stroke="rgba(220,30,30,.3)" strokeWidth="1.5" />
      <path d="M62,28 L278,28 L228,86 L112,86 Z"        fill="rgba(220,30,30,.12)" />
      <path d="M112,86 L228,86 L228,130 L112,130 Z"     fill="rgba(220,30,30,.18)" />
      <path d="M112,130 L228,130 L228,170 L112,170 Z"   fill="#dc1e1e" opacity=".35" />
    </svg>
  ),

  // 09 — Custom Music
  ({ uid }) => (
    <svg viewBox="0 0 340 200" xmlns="http://www.w3.org/2000/svg"
         preserveAspectRatio="xMidYMid slice" width="100%" height="100%">
      <defs>
        <radialGradient id={`mg9-${uid}`} cx="50%" cy="50%">
          <stop offset="0%"   stopColor="#001828" />
          <stop offset="100%" stopColor="#0d0d0d" />
        </radialGradient>
      </defs>
      <rect width="340" height="200" fill={`url(#mg9-${uid})`} />
      <line x1="84"  y1="30"  x2="84"  y2="170" stroke="#dc1e1e"  strokeWidth="3" strokeLinecap="round" />
      <line x1="100" y1="50"  x2="100" y2="150" stroke="#dc1e1e"  strokeWidth="3" strokeLinecap="round" opacity=".9" />
      <line x1="116" y1="36"  x2="116" y2="164" stroke="#dc1e1e"  strokeWidth="3" strokeLinecap="round" />
      <line x1="132" y1="18"  x2="132" y2="182" stroke="#dc1e1e"  strokeWidth="3" strokeLinecap="round" />
      <line x1="148" y1="36"  x2="148" y2="164" stroke="#dc1e1e"  strokeWidth="3" strokeLinecap="round" opacity=".95" />
      <line x1="164" y1="54"  x2="164" y2="146" stroke="#2980b9"  strokeWidth="3" strokeLinecap="round" opacity=".75" />
      <line x1="180" y1="70"  x2="180" y2="130" stroke="#2980b9"  strokeWidth="3" strokeLinecap="round" opacity=".65" />
      <line x1="196" y1="82"  x2="196" y2="118" stroke="#2980b9"  strokeWidth="3" strokeLinecap="round" opacity=".55" />
      <line x1="212" y1="90"  x2="212" y2="110" stroke="#2980b9"  strokeWidth="3" strokeLinecap="round" opacity=".45" />
      <line x1="244" y1="64"  x2="244" y2="136" stroke="#dc1e1e"  strokeWidth="3" strokeLinecap="round" opacity=".7" />
    </svg>
  ),
]
