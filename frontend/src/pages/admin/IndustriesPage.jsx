import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { industriesApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = { name: '', nameAr: '', headlineEn: '', headlineEmEn: '', colorIndex: '0', descEn: '', descAr: '', services: '' }

export default function IndustriesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)

  const load = () =>
    industriesApi.getAll().then(setItems).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => { setEditing(null); setForm(empty); setImageFile(null); setModal(true) }
  const openEdit = (row) => {
    setEditing(row._id)
    setForm({
      name: row.name, nameAr: row.nameAr || '', headlineEn: row.headlineEn || '', headlineEmEn: row.headlineEmEn || '',
      colorIndex: String(row.colorIndex || 0), descEn: row.descEn || '', descAr: row.descAr || '',
      services: (row.services || []).join(', '),
    })
    setImageFile(null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (k === 'services') {
        v.split(',').map((s) => s.trim()).filter(Boolean).forEach((s) => fd.append('services', s))
      } else {
        fd.append(k, v)
      }
    })
    if (imageFile) fd.append('image', imageFile)

    try {
      if (editing) {
        await industriesApi.update(editing, fd)
        toast.success('Industry updated')
      } else {
        await industriesApi.create(fd)
        toast.success('Industry created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await industriesApi.remove(delModal._id)
      toast.success('Industry deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'nameAr', label: 'Name (AR)' },
    { key: 'image', label: 'Image', render: (r) => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded object-cover" /> : '—' },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="INDUSTRIES">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Industry
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Industry' : 'New Industry'} wide>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Name (EN)" name="name" value={form.name} onChange={onChange} required />
            <AdminFormField label="Name (AR)" name="nameAr" value={form.nameAr} onChange={onChange} />
            <AdminFormField label="Headline (EN)" name="headlineEn" value={form.headlineEn} onChange={onChange} />
            <AdminFormField label="Headline Emphasis" name="headlineEmEn" value={form.headlineEmEn} onChange={onChange} />
            <AdminFormField label="Color Index" name="colorIndex" value={form.colorIndex} onChange={onChange} type="number" />
          </div>
          <AdminFormField label="Description (EN)" name="descEn" value={form.descEn} onChange={onChange} type="textarea" />
          <AdminFormField label="Description (AR)" name="descAr" value={form.descAr} onChange={onChange} type="textarea" />
          <AdminFormField label="Services (comma-separated)" name="services" value={form.services} onChange={onChange} />
          <AdminImageUpload label="Image" currentUrl={editing ? items.find((i) => i._id === editing)?.image : null} onFileSelect={(f) => setImageFile(f)} />
          <div className="flex gap-3 justify-end mt-5">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#dc1e1e] text-white text-sm hover:bg-red-700 transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <DeleteConfirmModal open={!!delModal} onClose={() => setDelModal(null)} onConfirm={handleDelete} itemName={delModal?.name} />
    </>
  )
}
