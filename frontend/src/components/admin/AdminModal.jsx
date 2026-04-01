import { useEffect } from 'react'

export default function AdminModal({ open, onClose, title, children, wide }) {
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh] px-4">
      <div className="fixed inset-0 bg-black/70" onClick={onClose} />
      <div
        className={`relative bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl w-full ${
          wide ? 'max-w-3xl' : 'max-w-lg'
        } max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-5 border-b border-white/10 sticky top-0 bg-[#1a1a1a] z-10">
          <h2 className="font-display text-xl text-white">{title}</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl leading-none">
            &times;
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
