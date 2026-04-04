import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { caseStudiesApi, caseCategoriesApi } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const emptyForm = {
  slug: '',
  titleEn: '', titleAr: '',
  tagEn: '', tagAr: '',
  categoryEn: '', categoryAr: '',
  descriptionEn: '', descriptionAr: '',
  fullDescriptionEn: '', fullDescriptionAr: '',
  challengeEn: '', challengeAr: '',
  solutionEn: '', solutionAr: '',
  metrics: [{ num: '', labelEn: '', labelAr: '' }],
}

export default function CaseStudiesPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [delModal, setDelModal] = useState(null)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [imageFile, setImageFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  const load = () =>
    Promise.all([caseStudiesApi.getAll(), caseCategoriesApi.getAll()])
      .then(([cs, cc]) => { setItems(cs); setCategories(cc) })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))

  useEffect(() => { load() }, [])

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const updateMetric = (idx, field, val) => {
    const m = [...form.metrics]
    m[idx] = { ...m[idx], [field]: val }
    setForm({ ...form, metrics: m })
  }
  const addMetric = () => setForm({ ...form, metrics: [...form.metrics, { num: '', labelEn: '', labelAr: '' }] })
  const removeMetric = (idx) => setForm({ ...form, metrics: form.metrics.filter((_, i) => i !== idx) })

  const openCreate = () => { setEditing(null); setForm(emptyForm); setImageFile(null); setGalleryFiles([]); setModal(true) }
  const openEdit = (row) => {
    setEditing(row._id)
    setForm({
      slug: row.slug,
      titleEn: row.title?.en || '', titleAr: row.title?.ar || '',
      tagEn: row.tag?.en || '', tagAr: row.tag?.ar || '',
      categoryEn: row.category?.en || '', categoryAr: row.category?.ar || '',
      descriptionEn: row.description?.en || '', descriptionAr: row.description?.ar || '',
      fullDescriptionEn: row.fullDescription?.en || '', fullDescriptionAr: row.fullDescription?.ar || '',
      challengeEn: row.challenge?.en || '', challengeAr: row.challenge?.ar || '',
      solutionEn: row.solution?.en || '', solutionAr: row.solution?.ar || '',
      metrics: row.metrics?.length
        ? row.metrics.map((m) => ({ num: m.num, labelEn: m.label?.en || '', labelAr: m.label?.ar || '' }))
        : [{ num: '', labelEn: '', labelAr: '' }],
    })
    setImageFile(null)
    setGalleryFiles([])
    setModal(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    fd.append('slug', form.slug)
    fd.append('title[en]', form.titleEn)
    fd.append('title[ar]', form.titleAr)
    fd.append('tag[en]', form.tagEn)
    fd.append('tag[ar]', form.tagAr)
    fd.append('category[en]', form.categoryEn)
    fd.append('category[ar]', form.categoryAr)
    fd.append('description[en]', form.descriptionEn)
    fd.append('description[ar]', form.descriptionAr)
    fd.append('fullDescription[en]', form.fullDescriptionEn)
    fd.append('fullDescription[ar]', form.fullDescriptionAr)
    fd.append('challenge[en]', form.challengeEn)
    fd.append('challenge[ar]', form.challengeAr)
    fd.append('solution[en]', form.solutionEn)
    fd.append('solution[ar]', form.solutionAr)
    fd.append(
      'metrics',
      JSON.stringify(
        form.metrics
          .filter((m) => m.num || m.labelEn || m.labelAr)
          .map((m) => ({ num: m.num, label: { en: m.labelEn, ar: m.labelAr } }))
      )
    )
    if (imageFile) fd.append('image', imageFile)
    galleryFiles.forEach((f) => fd.append('gallery', f))

    try {
      if (editing) {
        await caseStudiesApi.update(editing, fd)
        toast.success('Case study updated')
      } else {
        await caseStudiesApi.create(fd)
        toast.success('Case study created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    }
  }

  const handleDelete = async () => {
    try {
      await caseStudiesApi.remove(delModal._id)
      toast.success('Deleted')
      setDelModal(null)
      load()
    } catch { toast.error('Error deleting') }
  }

  const columns = [
    { key: 'image', label: 'Image', render: (r) => r.image ? <img src={r.image} alt="" className="w-10 h-10 rounded object-cover" /> : '—' },
    { key: 'title', label: 'Title', render: (r) => r.title?.en || '—' },
    { key: 'slug', label: 'Slug' },
    { key: 'category', label: 'Category', render: (r) => r.category?.en || '—' },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="CASE STUDIES">
        <button onClick={openCreate} className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors">
          + Add Case Study
        </button>
      </AdminPageHeader>
      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal open={modal} onClose={() => setModal(false)} title={editing ? 'Edit Case Study' : 'New Case Study'} wide>
        <form onSubmit={handleSubmit}>
          {/* Slug */}
          <AdminFormField label="Slug" name="slug" value={form.slug} onChange={onChange} required placeholder="my-case-study" />

          {/* Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Title (EN)" name="titleEn" value={form.titleEn} onChange={onChange} required />
            <AdminFormField label="Title (AR)" name="titleAr" value={form.titleAr} onChange={onChange} placeholder="العنوان" />
          </div>

          {/* Tag */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Tag (EN)" name="tagEn" value={form.tagEn} onChange={onChange} placeholder="Banking · KSA · 2024" />
            <AdminFormField label="Tag (AR)" name="tagAr" value={form.tagAr} onChange={onChange} placeholder="بنوك · السعودية · 2024" />
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
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

          {/* Short Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Short Description (EN)" name="descriptionEn" value={form.descriptionEn} onChange={onChange} type="textarea" />
            <AdminFormField label="Short Description (AR)" name="descriptionAr" value={form.descriptionAr} onChange={onChange} type="textarea" placeholder="الوصف المختصر" />
          </div>

          {/* Full Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Full Description (EN)" name="fullDescriptionEn" value={form.fullDescriptionEn} onChange={onChange} type="textarea" rows={4} />
            <AdminFormField label="Full Description (AR)" name="fullDescriptionAr" value={form.fullDescriptionAr} onChange={onChange} type="textarea" rows={4} placeholder="الوصف الكامل" />
          </div>

          {/* Challenge */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Challenge (EN)" name="challengeEn" value={form.challengeEn} onChange={onChange} type="textarea" />
            <AdminFormField label="Challenge (AR)" name="challengeAr" value={form.challengeAr} onChange={onChange} type="textarea" placeholder="التحدي" />
          </div>

          {/* Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Solution (EN)" name="solutionEn" value={form.solutionEn} onChange={onChange} type="textarea" />
            <AdminFormField label="Solution (AR)" name="solutionAr" value={form.solutionAr} onChange={onChange} type="textarea" placeholder="الحل" />
          </div>

          {/* Metrics */}
          <div className="mb-4">
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">Metrics</label>
            {form.metrics.map((m, i) => (
              <div key={i} className="flex gap-2 mb-2 flex-wrap">
                <input value={m.num} onChange={(e) => updateMetric(i, 'num', e.target.value)} placeholder="Value (e.g. +38%)"
                  className="w-28 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                <input value={m.labelEn} onChange={(e) => updateMetric(i, 'labelEn', e.target.value)} placeholder="Label (EN)"
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                <input value={m.labelAr} onChange={(e) => updateMetric(i, 'labelAr', e.target.value)} placeholder="التسمية (AR)"
                  className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" dir="rtl" />
                <button type="button" onClick={() => removeMetric(i)} className="text-red-400 hover:text-red-300 px-2">&times;</button>
              </div>
            ))}
            <button type="button" onClick={addMetric} className="text-[#dc1e1e] text-xs hover:underline">+ Add metric</button>
          </div>

          <AdminImageUpload label="Main Image" currentUrl={editing ? items.find((i) => i._id === editing)?.image : null} onFileSelect={(f) => setImageFile(f)} />

          {/* Gallery */}
          <div className="mb-4">
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-1.5">Gallery Images</label>
            {editing && items.find((i) => i._id === editing)?.gallery?.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {items.find((i) => i._id === editing).gallery.map((url, idx) => (
                  <img key={idx} src={url} alt="" className="w-16 h-16 rounded object-cover border border-white/10" />
                ))}
              </div>
            )}
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryFiles([...e.target.files])}
              className="text-white/40 text-sm file:mr-3 file:rounded file:border-0 file:bg-white/10 file:text-white/70 file:px-3 file:py-1 file:text-sm file:cursor-pointer" />
          </div>

          <div className="flex gap-3 justify-end mt-5">
            <button type="button" onClick={() => setModal(false)} className="px-4 py-2 rounded bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-[#dc1e1e] text-white text-sm hover:bg-red-700 transition-colors">
              {editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <DeleteConfirmModal open={!!delModal} onClose={() => setDelModal(null)} onConfirm={handleDelete} itemName={delModal?.title?.en || delModal?.title} />
    </>
  )
}
