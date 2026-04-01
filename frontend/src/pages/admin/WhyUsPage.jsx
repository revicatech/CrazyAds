import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { whyUsApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = { eyebrowEn: '', headingEn: '', bodyEn: '', bodyAr: '', tag: '', bg: '#f1f1f1', accent: '#dc1e1e', textColor: '#111' }

export default function WhyUsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const load = () =>
    whyUsApi.getAll().then(setItems).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (row) => {
    setEditing(row._id)
    setForm({
      eyebrowEn: row.eyebrowEn || '', headingEn: row.headingEn || '',
      bodyEn: row.bodyEn || '', bodyAr: row.bodyAr || '',
      tag: row.tag || '', bg: row.bg || '#f1f1f1',
      accent: row.accent || '#dc1e1e', textColor: row.textColor || '#111',
    })
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await whyUsApi.update(editing, form)
        toast.success('Why Us item updated')
      } else {
        await whyUsApi.create(form)
        toast.success('Why Us item created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await whyUsApi.remove(delModal._id)
      toast.success('Deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'eyebrowEn', label: 'Eyebrow' },
    { key: 'headingEn', label: 'Heading' },
    { key: 'tag', label: 'Tag' },
    { key: 'bg', label: 'Background', render: (r) => (
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded border border-white/20" style={{ background: r.bg }} />
        <span className="text-xs">{r.bg}</span>
      </div>
    )},
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="WHY US">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Item
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Why Us' : 'New Why Us'} wide>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Eyebrow" name="eyebrowEn" value={form.eyebrowEn} onChange={onChange} placeholder="Reason 01 / 05" />
            <AdminFormField label="Heading" name="headingEn" value={form.headingEn} onChange={onChange} required />
            <AdminFormField label="Tag" name="tag" value={form.tag} onChange={onChange} placeholder="360° Agency" />
          </div>
          <AdminFormField label="Body (EN)" name="bodyEn" value={form.bodyEn} onChange={onChange} type="textarea" />
          <AdminFormField label="Body (AR)" name="bodyAr" value={form.bodyAr} onChange={onChange} type="textarea" />
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" name="bg" value={form.bg} onChange={onChange} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <input type="text" name="bg" value={form.bg} onChange={onChange}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#dc1e1e]" />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">Accent</label>
              <div className="flex items-center gap-2">
                <input type="color" name="accent" value={form.accent} onChange={onChange} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <input type="text" name="accent" value={form.accent} onChange={onChange}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#dc1e1e]" />
              </div>
            </div>
            <div>
              <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">Text Color</label>
              <div className="flex items-center gap-2">
                <input type="color" name="textColor" value={form.textColor} onChange={onChange} className="w-8 h-8 rounded cursor-pointer bg-transparent border-0" />
                <input type="text" name="textColor" value={form.textColor} onChange={onChange}
                  className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1 text-white text-xs focus:outline-none focus:border-[#dc1e1e]" />
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-end mt-5">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#dc1e1e] text-white text-sm hover:bg-red-700 transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <DeleteConfirmModal open={!!delModal} onClose={() => setDelModal(null)} onConfirm={handleDelete} itemName={delModal?.headingEn} />
    </>
  )
}
