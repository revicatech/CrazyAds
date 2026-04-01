export default function AdminFormField({
  label, name, value, onChange, type = 'text', placeholder, rows, required, children
}) {
  const baseClass =
    'w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#dc1e1e] transition-colors'

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-[#dc1e1e]">*</span>}
        </label>
      )}
      {children || (
        type === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows || 3}
            className={baseClass + ' resize-y'}
          />
        ) : type === 'select' ? null : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={baseClass}
          />
        )
      )}
    </div>
  )
}
