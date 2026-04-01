import { useRef, useState } from 'react'

export default function AdminImageUpload({ label, currentUrl, onFileSelect, name }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)

  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
    onFileSelect(file, name)
  }

  const displayUrl = preview || currentUrl

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">
          {label}
        </label>
      )}
      <div
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-white/20 rounded-lg p-4 text-center cursor-pointer hover:border-[#dc1e1e]/50 transition-colors"
      >
        {displayUrl ? (
          <img src={displayUrl} alt="Preview" className="max-h-40 mx-auto rounded object-cover" />
        ) : (
          <p className="text-white/30 text-sm">Click to upload image</p>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
    </div>
  )
}
