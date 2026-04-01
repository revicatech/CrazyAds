import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { portfolioApi, portfolioCategoriesApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = { titleEn: '', titleAr: '', categoryEn: '', categoryAr: '', tags: '', featured: false }

export default function PortfolioPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)

  const load = () =>
    Promise.all([portfolioApi.getAll(), portfolioCategoriesApi.getAll()])
      .then(([p, c]) => { setItems(p); setCategories(c) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  const openCreate = () => { setEditing(null); setForm(empty); setImageFile(null); setModal(true) }
  const openEdit = (row) => {
    setEditing(row._id)
    setForm({
      titleEn: row.titleEn, titleAr: row.titleAr || '',
      categoryEn: row.category?.en || '', categoryAr: row.category?.ar || '',
      tags: (row.tags || []).join(', '), featured: row.featured || false,
    })
    setImageFile(null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('titleEn', form.titleEn)
    fd.append('titleAr', form.titleAr)
    fd.append('category[en]', form.categoryEn)
    fd.append('category[ar]', form.categoryAr)
    fd.append('featured', form.featured)
    form.tags.split(',').map((t) => t.trim()).filter(Boolean).forEach((t) => fd.append('tags', t))
    if (imageFile) fd.append('image', imageFile)

    try {
      if (editing) {
        await portfolioApi.update(editing, fd)
        toast.success('Portfolio item updated')
      } else {
        await portfolioApi.create(fd)
        toast.success('Portfolio item created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await portfolioApi.remove(delModal._id)
      toast.success('Deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'image', label: 'Image', render: (r) => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded object-cover" /> : '—' },
    { key: 'titleEn', label: 'Title (EN)' },
    { key: 'category', label: 'Category', render: (r) => r.category?.en || '—' },
    { key: 'featured', label: 'Featured', render: (r) => r.featured ? <span className="text-[#dc1e1e]">Yes</span> : 'No' },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="PORTFOLIO">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Item
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Portfolio Item' : 'New Portfolio Item'} wide>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Title (EN)" name="titleEn" value={form.titleEn} onChange={onChange} required />
            <AdminFormField label="Title (AR)" name="titleAr" value={form.titleAr} onChange={onChange} />
            <AdminFormField label="Category (EN)" name="categoryEn" value={form.categoryEn} onChange={onChange}>
              <select name="categoryEn" value={form.categoryEn} onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c.en}>{c.en}</option>)}
              </select>
            </AdminFormField>
            <AdminFormField label="Category (AR)" name="categoryAr" value={form.categoryAr} onChange={onChange}>
              <select name="categoryAr" value={form.categoryAr} onChange={(e) => setForm({ ...form, categoryAr: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]">
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c.ar}>{c.ar}</option>)}
              </select>
            </AdminFormField>
          </div>
          <AdminFormField label="Tags (comma-separated)" name="tags" value={form.tags} onChange={onChange} />
          <div className="mb-4 flex items-center gap-2">
            <input type="checkbox" name="featured" checked={form.featured} onChange={onChange} className="accent-[#dc1e1e]" />
            <label className="text-white/60 text-sm">Featured</label>
          </div>
          <AdminImageUpload label="Image" currentUrl={editing ? items.find((i) => i._id === editing)?.image : null} onFileSelect={(f) => setImageFile(f)} />
          <div className="flex gap-3 justify-end mt-5">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#dc1e1e] text-white text-sm hover:bg-red-700 transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <DeleteConfirmModal open={!!delModal} onClose={() => setDelModal(null)} onConfirm={handleDelete} itemName={delModal?.titleEn} />
    </>
  )
}
