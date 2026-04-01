import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { caseCategoriesApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = { en: '', ar: '' }

export default function CaseCategoriesPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)

  const load = () =>
    caseCategoriesApi.getAll().then(setItems).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => { setEditing(null); setForm(empty); setModal(true) }
  const openEdit = (row) => { setEditing(row._id); setForm({ en: row.en, ar: row.ar }); setModal(true) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await caseCategoriesApi.update(editing, form)
        toast.success('Category updated')
      } else {
        await caseCategoriesApi.create(form)
        toast.success('Category created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await caseCategoriesApi.remove(delModal._id)
      toast.success('Deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'en', label: 'English' },
    { key: 'ar', label: 'Arabic' },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="CASE CATEGORIES">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Category
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Category' : 'New Category'}>
        <form onSubmit={handleSubmit}>
          <AdminFormField label="English" name="en" value={form.en} onChange={onChange} required />
          <AdminFormField label="Arabic" name="ar" value={form.ar} onChange={onChange} required />
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
