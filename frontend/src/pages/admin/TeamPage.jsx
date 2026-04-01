import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { teamApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = { name: '', roleKey: '' }

export default function TeamPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(empty)
  const [imageFile, setImageFile] = useState(null)

  const load = () =>
    teamApi.getAll().then(setItems).catch(() => toast.error('Failed to load')).finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const openCreate = () => { setEditing(null); setForm(empty); setImageFile(null); setModal(true) }
  const openEdit = (row) => {
    setEditing(row._id)
    setForm({ name: row.name, roleKey: row.roleKey })
    setImageFile(null)
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('roleKey', form.roleKey)
    if (imageFile) fd.append('image', imageFile)

    try {
      if (editing) {
        await teamApi.update(editing, fd)
        toast.success('Team member updated')
      } else {
        await teamApi.create(fd)
        toast.success('Team member created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await teamApi.remove(delModal._id)
      toast.success('Deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'image', label: 'Photo', render: (r) => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded-full object-cover" /> : '—' },
    { key: 'name', label: 'Name' },
    { key: 'roleKey', label: 'Role Key' },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="TEAM">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Member
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Member' : 'New Member'}>
        <form onSubmit={handleSubmit}>
          <AdminFormField label="Name" name="name" value={form.name} onChange={onChange} required />
          <AdminFormField label="Role Key" name="roleKey" value={form.roleKey} onChange={onChange} required placeholder="team_role_ceo" />
          <AdminImageUpload label="Photo" currentUrl={editing ? items.find((i) => i._id === editing)?.image : null} onFileSelect={(f) => setImageFile(f)} />
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
