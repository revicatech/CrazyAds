export default function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`rounded-2xl overflow-hidden bg-white ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
