/**
 * Infinite horizontal marquee.
 *
 * Props:
 *   items    — array of strings or JSX elements
 *   speed    — CSS animation duration string (default '30s')
 *   reverse  — boolean, scroll right-to-left if false (default), left-to-right if true
 *   gap      — Tailwind gap class (default 'gap-10')
 */
export default function Marquee({ items = [], speed = '30s', reverse = false, gap = 'gap-10', className = '' }) {
  const dirClass = reverse ? 'animate-marquee-right' : 'animate-marquee-left'

  return (
    <div className={`overflow-hidden w-full ${className}`}>
      <div
        className={`flex whitespace-nowrap ${gap} ${dirClass}`}
        style={{ '--marquee-speed': speed }}
      >
        {/* Duplicate items so the seam is invisible */}
        {[...items, ...items].map((item, i) => (
          <span key={i} className="shrink-0">{item}</span>
        ))}
      </div>
    </div>
  )
}
