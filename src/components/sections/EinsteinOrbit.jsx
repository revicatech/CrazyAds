import { useEffect, useRef } from 'react';
import { useLang } from '../../context/LanguageContext';
import { t } from '../../services/i18n';
import '../cssComponents/EinsteinOrbit.css';

const IDEAS = [
  { icon: '💡', key: 'einstein_idea_bold',      style: 'style-accent',  speed: 0.4,   radius: 160, offset: 0   },
  { icon: '🎯', key: 'einstein_idea_precision', style: 'style-ghost',   speed: -0.35, radius: 240, offset: 60  },
  { icon: '🔥', key: 'einstein_idea_culture',   style: 'style-outline', speed: 0.55,  radius: 190, offset: 120 },
  { icon: '⚡', key: 'einstein_idea_energy',    style: 'style-accent',  speed: -0.45, radius: 140, offset: 200 },
  { icon: '🌍', key: 'einstein_idea_mena',      style: 'style-ghost',   speed: 0.3,   radius: 270, offset: 300 },
  { icon: '✨', key: 'einstein_idea_craft',     style: 'style-outline', speed: -0.5,  radius: 210, offset: 180 },
];

export default function EinsteinOrbit() {
  const { lang } = useLang();
  const sceneRef = useRef(null);
  const ideasRef = useRef([]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    let startTime = null;
    const TILT = 0.30;
    let raf;

    const tick = (ts) => {
      if (!startTime) startTime = ts;
      const t = (ts - startTime) * 0.001;

      // Read dimensions every frame so a zero-width at mount never freezes the orbit
      const sceneW = scene.offsetWidth;
      const CX = sceneW / 2;
      const CY = scene.offsetHeight / 2;

      ideasRef.current.forEach((el, i) => {
        if (!el) return;
        const idea = IDEAS[i];
        const scale_r = sceneW / 660;
        const radius = idea.radius * scale_r;
        const angle = t * idea.speed + (idea.offset * Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * TILT;
        const depth = Math.sin(angle);
        const sc = 0.62 + 0.38 * ((depth + 1) / 2);
        const opac = 0.45 + 0.55 * ((depth + 1) / 2);
        const tx = CX + x - el.offsetWidth / 2;
        const ty = CY + y - el.offsetHeight / 2;
        el.style.transform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${sc.toFixed(3)})`;
        el.style.opacity = opac.toFixed(3);
        el.style.zIndex = depth > 0 ? 20 : 8;
      });

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(() => requestAnimationFrame(tick));

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="einstein-orbit" className="bg-[#1A1A1A] py-[clamp(80px,12vh,160px)] relative overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-12 flex flex-col lg:flex-row items-center gap-20">

        {/* Text — LEFT */}
        <div className="flex-1 flex flex-col items-center lg:items-start">
          <div className="text-[11px] tracking-[0.2em] uppercase text-white/40 mb-4">{t('einstein_eyebrow', lang)}</div>
          <h2 className="einstein-headline">
            {t('einstein_headline_1', lang)}<br />{t('einstein_headline_2', lang)}
            <em>{t('einstein_headline_em', lang)}</em>
          </h2>
          <p className="text-white/55 text-base leading-7 max-w-md mt-8 text-center lg:text-left">
            {t('einstein_body', lang)}
          </p>
        </div>

        {/* Orbit scene — RIGHT */}
        <div className="flex-1 flex justify-center items-center">
        <div className="orbit-scene" ref={sceneRef}>
          <div className="orbit-ring orbit-ring-1" />
          <div className="orbit-ring orbit-ring-2" />
          <div className="orbit-ring orbit-ring-3" />

          <div className="einstein-glow" />

          <svg className="einstein-head" viewBox="0 0 200 220" xmlns="http://www.w3.org/2000/svg">
            <path d="M72,195 Q68,218 100,220 Q132,218 128,195 L122,175 Q100,185 78,175 Z" fill="#1a1a1a" stroke="rgba(220,0,0,0.15)" strokeWidth="1"/>
            <ellipse cx="100" cy="100" rx="72" ry="78" fill="#1a1a1a" stroke="rgba(220,0,0,0.2)" strokeWidth="1.5"/>
            <path d="M36,88 Q28,40 52,22 Q70,8 100,6 Q130,8 148,22 Q172,40 164,88" fill="#222" stroke="rgba(220,0,0,0.1)" strokeWidth="1"/>
            <path d="M36,88 Q20,70 18,50 Q22,35 30,28" fill="none" stroke="rgba(220,0,0,0.3)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M164,88 Q180,70 182,50 Q178,35 170,28" fill="none" stroke="rgba(220,0,0,0.3)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M58,108 Q72,100 86,105" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M114,105 Q128,100 142,108" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinecap="round"/>
            <ellipse cx="76" cy="118" rx="10" ry="12" fill="rgba(255,255,255,0.08)"/>
            <ellipse cx="124" cy="118" rx="10" ry="12" fill="rgba(255,255,255,0.08)"/>
            <circle cx="76" cy="118" r="4" fill="rgba(255,255,255,0.6)"/>
            <circle cx="124" cy="118" r="4" fill="rgba(255,255,255,0.6)"/>
            <path d="M88,148 Q100,160 112,148" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round"/>
            <path d="M75,88 Q80,80 86,83 Q80,86 82,92" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
            <path d="M125,83 Q131,80 136,88 Q134,86 130,89" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5"/>
          </svg>

          {IDEAS.map((idea, i) => (
            <div
              key={idea.key}
              ref={el => ideasRef.current[i] = el}
              className={`orbit-idea ${idea.style}`}
            >
              <span className="idea-icon">{idea.icon}</span>
              {t(idea.key, lang)}
            </div>
          ))}
        </div>
        </div>

      </div>
    </section>
  );
}
