import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { portfolioApi, portfolioCategoriesApi, uploadImageDirect } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'
import AdminTable from '../../components/admin/AdminTable'
import AdminModal from '../../components/admin/AdminModal'
import AdminFormField from '../../components/admin/AdminFormField'
import AdminImageUpload from '../../components/admin/AdminImageUpload'
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal'

const empty = {
  slug: '',
  titleEn: '', titleAr: '',
  categoryEn: '', categoryAr: '',
  clientEn: '', clientAr: '',
  year: '', order: '0',
  descriptionEn: '', descriptionAr: '',
  bodyEn: '', bodyAr: '',
  tags: '',
  services: '',
  url: '',
  featured: false,
}

/* Thin section divider used inside the modal form */
function FormSection({ title }) {
  return (
    <div className="flex items-center gap-3 my-5">
      <span className="text-[#dc1e1e] text-[10px] font-bold tracking-widest uppercase">{title}</span>
      <div className="flex-1 h-px bg-white/10" />
    </div>
  )
}

export default function PortfolioPage() {
  const [items, setItems]         = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(false)
  const [delModal, setDelModal]   = useState(null)
  const [editing, setEditing]     = useState(null)
  const [form, setForm]           = useState(empty)
  const [saving, setSaving]       = useState(false)

  // Image state
  const [imageFile, setImageFile]     = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])     // new files to add
  const [galleryUrls, setGalleryUrls] = useState([])       // existing URLs

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

  const openCreate = () => {
    setEditing(null)
    setForm(empty)
    setImageFile(null)
    setGalleryFiles([])
    setGalleryUrls([])
    setModal(true)
  }

  const openEdit = (row) => {
    setEditing(row._id)
    setForm({
      slug:          row.slug || '',
      titleEn:       row.titleEn || '',
      titleAr:       row.titleAr || '',
      categoryEn:    row.category?.en || '',
      categoryAr:    row.category?.ar || '',
      clientEn:      row.client?.en || '',
      clientAr:      row.client?.ar || '',
      year:          row.year ? String(row.year) : '',
      order:         row.order != null ? String(row.order) : '0',
      descriptionEn: row.descriptionEn || '',
      descriptionAr: row.descriptionAr || '',
      bodyEn:        row.bodyEn || '',
      bodyAr:        row.bodyAr || '',
      tags:          (row.tags || []).join(', '),
      services:      (row.services || []).join(', '),
      url:           row.url || '',
      featured:      row.featured || false,
    })
    setImageFile(null)
    setGalleryFiles([])
    setGalleryUrls(row.gallery || [])
    setModal(true)
  }

  const removeGalleryUrl = (idx) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const toArr = (str) => str.split(',').map((s) => s.trim()).filter(Boolean)

      // 1. Upload cover image if a new file was selected
      let imageUrl = editing ? items.find((i) => i._id === editing)?.image : undefined
      if (imageFile) {
        imageUrl = await uploadImageDirect(imageFile)
      }

      // 2. Upload any new gallery files; keep existing URLs as-is
      const newGalleryUrls = galleryFiles.length
        ? await Promise.all(galleryFiles.map((f) => uploadImageDirect(f)))
        : []
      const allGallery = [...galleryUrls, ...newGalleryUrls]

      // 3. Build plain JSON payload — no FormData, no bracket-notation issues
      const payload = {
        slug:          form.slug || undefined,
        titleEn:       form.titleEn,
        titleAr:       form.titleAr,
        category:      { en: form.categoryEn, ar: form.categoryAr },
        client:        { en: form.clientEn,   ar: form.clientAr   },
        year:          form.year  ? Number(form.year)  : undefined,
        order:         Number(form.order) || 0,
        descriptionEn: form.descriptionEn,
        descriptionAr: form.descriptionAr,
        bodyEn:        form.bodyEn,
        bodyAr:        form.bodyAr,
        featured:      form.featured,
        url:           form.url,
        tags:          toArr(form.tags),
        services:      toArr(form.services),
        gallery:       allGallery,
      }
      if (imageUrl) payload.image = imageUrl
      console.log(payload);
      
      if (editing) {
        await portfolioApi.update(editing, payload)
        toast.success('Portfolio item updated')
      } else {
        await portfolioApi.create(payload)
        toast.success('Portfolio item created')
      }
      setModal(false)
      load()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    } finally {
      setSaving(false)
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
    { key: 'image', label: 'Image', render: (r) => r.image
        ? <img src={r.image} alt="" className="w-10 h-10 rounded object-cover" />
        : <span className="text-white/20">—</span> },
    { key: 'titleEn',  label: 'Title (EN)' },
    { key: 'slug',     label: 'Slug', render: (r) => <span className="text-white/40 text-xs font-mono">{r.slug || '—'}</span> },
    { key: 'category', label: 'Category', render: (r) => r.category?.en || '—' },
    { key: 'year',     label: 'Year', render: (r) => r.year || '—' },
    { key: 'featured', label: 'Featured', render: (r) => r.featured
        ? <span className="text-[#dc1e1e] text-xs font-semibold">Yes</span>
        : <span className="text-white/30 text-xs">No</span> },
  ]

  if (loading) return <div className="text-white/40 py-10 text-center">Loading…</div>

  return (
    <>
      <Toaster position="top-right" />

      <AdminPageHeader title="PORTFOLIO">
        <button
          onClick={openCreate}
          className="bg-[#dc1e1e] text-white px-4 py-2 rounded text-sm hover:bg-red-700 transition-colors"
        >
          + Add Item
        </button>
      </AdminPageHeader>

      <AdminTable columns={columns} data={items} onEdit={openEdit} onDelete={setDelModal} />

      <AdminModal
        open={modal}
        onClose={() => setModal(false)}
        title={editing ? 'Edit Portfolio Item' : 'New Portfolio Item'}
        wide
      >
        <form onSubmit={handleSubmit}>

          {/* ── IDENTITY ─────────────────────────────────────────── */}
          <FormSection title="Identity" />

          <AdminFormField
            label="Slug"
            name="slug"
            value={form.slug}
            onChange={onChange}
            placeholder="auto-generated if left empty"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Title (EN)" name="titleEn" value={form.titleEn} onChange={onChange} required />
            <AdminFormField label="Title (AR)" name="titleAr" value={form.titleAr} onChange={onChange} placeholder="العنوان" />
          </div>

          {/* ── CATEGORY & META ──────────────────────────────────── */}
          <FormSection title="Category & Meta" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Category (EN)" name="categoryEn" value={form.categoryEn} onChange={onChange}>
              <select
                name="categoryEn"
                value={form.categoryEn}
                onChange={onChange}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c.en}>{c.en}</option>)}
              </select>
            </AdminFormField>
            <AdminFormField label="Category (AR)" name="categoryAr" value={form.categoryAr} onChange={onChange}>
              <select
                name="categoryAr"
                value={form.categoryAr}
                onChange={(e) => setForm({ ...form, categoryAr: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm focus:outline-none focus:border-[#dc1e1e]"
              >
                <option value="">Select category</option>
                {categories.map((c) => <option key={c._id} value={c.ar}>{c.ar}</option>)}
              </select>
            </AdminFormField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Client (EN)" name="clientEn" value={form.clientEn} onChange={onChange} placeholder="Client name" />
            <AdminFormField label="Client (AR)" name="clientAr" value={form.clientAr} onChange={onChange} placeholder="اسم العميل" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField label="Year" name="year" value={form.year} onChange={onChange} type="number" placeholder="2024" />
            <AdminFormField label="Sort Order" name="order" value={form.order} onChange={onChange} type="number" placeholder="0" />
          </div>

          {/* ── CONTENT ──────────────────────────────────────────── */}
          <FormSection title="Content" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField
              label="Short Description (EN)"
              name="descriptionEn"
              value={form.descriptionEn}
              onChange={onChange}
              type="textarea"
              placeholder="One-line project summary shown in cards"
            />
            <AdminFormField
              label="Short Description (AR)"
              name="descriptionAr"
              value={form.descriptionAr}
              onChange={onChange}
              type="textarea"
              placeholder="ملخص المشروع"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
            <AdminFormField
              label="Body Text (EN)"
              name="bodyEn"
              value={form.bodyEn}
              onChange={onChange}
              type="textarea"
              rows={5}
              placeholder="Full project description shown on detail page"
            />
            <AdminFormField
              label="Body Text (AR)"
              name="bodyAr"
              value={form.bodyAr}
              onChange={onChange}
              type="textarea"
              rows={5}
              placeholder="النص الكامل للمشروع"
            />
          </div>

          {/* ── TAGS & SERVICES ──────────────────────────────────── */}
          <FormSection title="Tags & Services" />

          <AdminFormField
            label="Tags (comma-separated)"
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="Branding, Print, Social Media"
          />
          <AdminFormField
            label="Services Provided (comma-separated)"
            name="services"
            value={form.services}
            onChange={onChange}
            placeholder="Brand Identity, Campaign Design, Video Production"
          />

          {/* ── LINKS & SETTINGS ─────────────────────────────────── */}
          <FormSection title="Links & Settings" />

          <AdminFormField
            label="External URL (live site / Behance)"
            name="url"
            value={form.url}
            onChange={onChange}
            placeholder="https://..."
          />

          <div className="mb-4 flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              name="featured"
              checked={form.featured}
              onChange={onChange}
              className="accent-[#dc1e1e] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="featured" className="text-white/60 text-sm cursor-pointer select-none">
              Featured — pin to top of portfolio grid
            </label>
          </div>

          {/* ── IMAGES ───────────────────────────────────────────── */}
          <FormSection title="Images" />

          <AdminImageUpload
            label="Cover Image"
            currentUrl={editing ? items.find((i) => i._id === editing)?.image : null}
            onFileSelect={(f) => setImageFile(f)}
          />

          {/* Gallery */}
          <div className="mb-4">
            <label className="block text-white/60 text-xs uppercase tracking-wider mb-2">
              Gallery Images
            </label>

            {/* Existing gallery thumbnails */}
            {galleryUrls.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-3">
                {galleryUrls.map((url, idx) => (
                  <div key={idx} className="relative group">
                    <img src={url} alt="" className="w-16 h-16 rounded object-cover border border-white/10" />
                    <button
                      type="button"
                      onClick={() => removeGalleryUrl(idx)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#dc1e1e] text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New gallery file input */}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setGalleryFiles([...e.target.files])}
              className="text-white/40 text-sm file:mr-3 file:rounded file:border-0 file:bg-white/10 file:text-white/70 file:px-3 file:py-1.5 file:text-xs file:cursor-pointer hover:file:bg-white/20 transition-colors"
            />
            {galleryFiles.length > 0 && (
              <p className="text-white/30 text-xs mt-1">{galleryFiles.length} new file(s) selected</p>
            )}
          </div>

          {/* ── ACTIONS ──────────────────────────────────────────── */}
          <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={() => setModal(false)}
              className="px-4 py-2 rounded bg-white/10 text-white/70 text-sm hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded bg-[#dc1e1e] text-white text-sm hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-wait"
            >
              {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>

      <DeleteConfirmModal
        open={!!delModal}
        onClose={() => setDelModal(null)}
        onConfirm={handleDelete}
        itemName={delModal?.titleEn}
      />
    </>
  )
}
