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

          <div className="einstein-3d-model">
            <iframe
              title="Einstein 3D Model"
              allowFullScreen
              allow="autoplay; fullscreen; xr-spatial-tracking"
              src="https://sketchfab.com/models/42b4b7c2e73940acbea9c3d5646a70e1/embed?transparent=1&autostart=1&autospin=0.3&ui_hint=0&ui_theme=dark&ui_infos=0&ui_controls=0&ui_stop=0&ui_watermark=0&ui_watermark_link=0&ui_ar=0&ui_help=0&ui_settings=0&ui_vr=0&ui_fullscreen=0&ui_annotations=0&ui_inspector=0&dnt=1&scrollwheel=0&camera=0"
            />
          </div>

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
