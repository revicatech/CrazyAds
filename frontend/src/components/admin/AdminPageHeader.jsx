export default function AdminPageHeader({ title, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="font-display text-3xl text-white tracking-wide">{title}</h1>
      {children}
    </div>
  )
}
