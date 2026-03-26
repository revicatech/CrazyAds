import { useScrollProgress } from '../../hooks/useScrollProgress'

export default function LabTube() {
  const { progress } = useScrollProgress()
  const pct = Math.round(progress * 100)

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2 hidden xl:flex">
      {/* Tube shell */}
      <div className="relative w-4 h-40 rounded-full border-2 border-white/20 bg-white/5 overflow-hidden backdrop-blur-sm">
        {/* Liquid fill */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-brand-red transition-all duration-300 ease-out rounded-full"
          style={{ height: `${pct}%` }}
        />
        {/* Bubble */}
        {pct > 5 && (
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/40 animate-bubble"
            style={{ bottom: `${pct * 0.6}%`, '--bubble-dur': '2s' }}
          />
        )}
      </div>
      {/* Percentage label */}
      <span className="text-white/50 text-[10px] font-display tracking-widest">
        {pct}%
      </span>
    </div>
  )
}
