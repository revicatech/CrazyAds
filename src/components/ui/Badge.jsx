export default function Badge({ children, className = '' }) {
  return (
    <span className={`inline-block px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-full border border-current ${className}`}>
      {children}
    </span>
  )
}
