import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { servicesApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = { num: '', en: '', ar: '', descEn: '', descAr: '', features: '' }

export default function ServicesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)

  const load = () =>
    servicesApi.getAll().then(setItems).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => { setEditing(null); setForm(empty); setImageFile(null); setModal(true) }
  const openEdit = (row) => {
    setEditing(row._id)
    setForm({ num: row.num, en: row.en, ar: row.ar || '', descEn: row.descEn || '', descAr: row.descAr || '', features: (row.features || []).join(', ') })
    setImageFile(null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('num', form.num)
    fd.append('en', form.en)
    fd.append('ar', form.ar)
    fd.append('descEn', form.descEn)
    fd.append('descAr', form.descAr)
    form.features.split(',').map((f) => f.trim()).filter(Boolean).forEach((f) => fd.append('features', f))
    if (imageFile) fd.append('image', imageFile)

    try {
      if (editing) {
        await servicesApi.update(editing, fd)
        toast.success('Service updated')
      } else {
        await servicesApi.create(fd)
        toast.success('Service created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await servicesApi.remove(delModal._id)
      toast.success('Service deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'image', label: 'Image', render: (r) => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded object-cover" /> : '—' },
    { key: 'num', label: '#' },
    { key: 'en', label: 'Name (EN)' },
    { key: 'ar', label: 'Name (AR)' },
    { key: 'features', label: 'Features', render: (r) => (r.features || []).length + ' items' },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="SERVICES">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Service
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Service' : 'New Service'} wide>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Number" name="num" value={form.num} onChange={onChange} required placeholder="01" />
            <AdminFormField label="Name (EN)" name="en" value={form.en} onChange={onChange} required />
            <AdminFormField label="Name (AR)" name="ar" value={form.ar} onChange={onChange} />
          </div>
          <AdminFormField label="Description (EN)" name="descEn" value={form.descEn} onChange={onChange} type="textarea" />
          <AdminFormField label="Description (AR)" name="descAr" value={form.descAr} onChange={onChange} type="textarea" />
          <AdminFormField label="Features (comma-separated)" name="features" value={form.features} onChange={onChange} placeholder="SEO, SEM, Social Media" />
          <AdminImageUpload
            label="Service Image"
            currentUrl={editing ? items.find((i) => i._id === editing)?.image : null}
            onFileSelect={(f) => setImageFile(f)}
          />
          <div className="flex gap-3 justify-end mt-5">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#dc1e1e] text-white text-sm hover:bg-red-700 transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <DeleteConfirmModal open={!!delModal} onClose={() => setDelModal(null)} onConfirm={handleDelete} itemName={delModal?.en} />
    </>
  )
}
