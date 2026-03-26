/**
 * variant: 'primary' | 'ghost' | 'nav' | 'cta'
 */
const variants = {
  primary: 'bg-brand-red text-white px-6 py-3 rounded-full font-semibold tracking-wide hover:bg-red-700 transition-colors duration-200',
  ghost:   'border border-current text-current px-6 py-3 rounded-full font-semibold tracking-wide hover:bg-white/10 transition-colors duration-200',
  nav:     'text-sm font-medium tracking-wide hover:text-brand-red transition-colors duration-200',
  cta:     'bg-brand-red text-white px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide hover:bg-red-700 transition-colors duration-200',
}

export default function Button({ variant = 'primary', className = '', children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
