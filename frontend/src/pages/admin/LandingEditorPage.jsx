import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { getSiteContent, bulkUpdateSiteContent } from '../../services/adminApi'
import AdminPageHeader from '../../components/admin/AdminPageHeader'

function Section({ title, open, onToggle, children }) {
  return (
    <div className="border border-white/10 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 bg-white/[0.03] hover:bg-white/[0.05] transition-colors"
      >
        <h3 className="font-display text-lg text-white">{title}</h3>
        <span className="text-white/40 text-xl">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="p-5 border-t border-white/10">{children}</div>}
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', rows }) {
  const cls = 'w-full bg-white/5 border border-white/10 rounded px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#dc1e1e] transition-colors'
  return (
    <div className="mb-3">
      <label className="block text-white/50 text-xs uppercase tracking-wider mb-1">{label}</label>
      {type === 'textarea' ? (
        <textarea value={value} onChange={onChange} rows={rows || 3} className={cls + ' resize-y'} />
      ) : (
        <input type={type} value={value} onChange={onChange} className={cls} />
      )}
    </div>
  )
}

export default function LandingEditorPage() {
  const [content, setContent] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState({})
  const [openSections, setOpenSections] = useState({ hero: true })

  useEffect(() => {
    getSiteContent()
      .then((data) => {
        const map = {}
        data.forEach((item) => { map[item.key] = item })
        setContent(map)
      })
      .catch(() => toast.error('Failed to load site content'))
      .finally(() => setLoading(false))
  }, [])

  const val = (key) => content[key]?.value ?? ''
  const setVal = (key, value, group) =>
    setContent((prev) => ({ ...prev, [key]: { ...prev[key], key, value, group: group || prev[key]?.group } }))

  const saveGroup = async (group) => {
    setSaving((p) => ({ ...p, [group]: true }))
    const items = Object.values(content).filter((c) => c.group === group).map((c) => ({ key: c.key, value: c.value, group: c.group }))
    try {
      await bulkUpdateSiteContent(items)
      toast.success(`${group} section saved!`)
    } catch {
      toast.error('Failed to save')
    }
    setSaving((p) => ({ ...p, [group]: false }))
  }

  const toggle = (key) => setOpenSections((p) => ({ ...p, [key]: !p[key] }))

  const SaveBtn = ({ group }) => (
    <button
      onClick={() => saveGroup(group)}
      disabled={saving[group]}
      className="mt-4 bg-[#dc1e1e] text-white px-5 py-2 rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
    >
      {saving[group] ? 'Saving...' : 'Save Changes'}
    </button>
  )

  if (loading) return <div className="text-white/40 py-10 text-center">Loading...</div>

  return (
    <>
      <Toaster position="top-right" />
      <AdminPageHeader title="LANDING PAGE EDITOR" />
      <p className="text-white/40 text-sm mb-6">Edit the content displayed on the landing page. Changes take effect after saving.</p>

      {/* Hero Section */}
      <Section title="HERO SECTION" open={openSections.hero} onToggle={() => toggle('hero')}>
        <Field label="Hero Title" value={val('hero_title')} onChange={(e) => setVal('hero_title', e.target.value, 'hero')} />
        <Field label="Video URL" value={val('hero_video_url')} onChange={(e) => setVal('hero_video_url', e.target.value, 'hero')} />
        <Field label="Poster Image URL" value={val('hero_poster_url')} onChange={(e) => setVal('hero_poster_url', e.target.value, 'hero')} />
        {val('hero_poster_url') && (
          <div className="mb-3">
            <img src={val('hero_poster_url')} alt="Poster preview" className="h-24 rounded border border-white/10 object-cover" />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Eyebrow (EN)" value={val('hero_eyebrow_en')} onChange={(e) => setVal('hero_eyebrow_en', e.target.value, 'hero')} />
          <Field label="Eyebrow (AR)" value={val('hero_eyebrow_ar')} onChange={(e) => setVal('hero_eyebrow_ar', e.target.value, 'hero')} />
          <Field label="Subtitle (EN) — supports &lt;em&gt; tags" value={val('hero_sub_en')} onChange={(e) => setVal('hero_sub_en', e.target.value, 'hero')} type="textarea" />
          <Field label="Subtitle (AR) — supports &lt;em&gt; tags" value={val('hero_sub_ar')} onChange={(e) => setVal('hero_sub_ar', e.target.value, 'hero')} type="textarea" />
        </div>
        <SaveBtn group="hero" />
      </Section>

      {/* Taglines Section */}
      <Section title="TAGLINES" open={openSections.taglines} onToggle={() => toggle('taglines')}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Tagline 1 (EN)" value={val('tagline_1_en')} onChange={(e) => setVal('tagline_1_en', e.target.value, 'taglines')} />
          <Field label="Tagline 1 (AR)" value={val('tagline_1_ar')} onChange={(e) => setVal('tagline_1_ar', e.target.value, 'taglines')} />
          <Field label="Tagline 2 (EN)" value={val('tagline_2_en')} onChange={(e) => setVal('tagline_2_en', e.target.value, 'taglines')} />
          <Field label="Tagline 2 (AR)" value={val('tagline_2_ar')} onChange={(e) => setVal('tagline_2_ar', e.target.value, 'taglines')} />
          <Field label="Tagline 3 (EN)" value={val('tagline_3_en')} onChange={(e) => setVal('tagline_3_en', e.target.value, 'taglines')} />
          <Field label="Tagline 3 (AR)" value={val('tagline_3_ar')} onChange={(e) => setVal('tagline_3_ar', e.target.value, 'taglines')} />
        </div>
        <SaveBtn group="taglines" />
      </Section>

      {/* Counters Section */}
      <Section title="COUNTERS" open={openSections.counters} onToggle={() => toggle('counters')}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Field label="Years Value" value={val('counter_years_value')} onChange={(e) => setVal('counter_years_value', Number(e.target.value) || 0, 'counters')} type="number" />
          <Field label="Years Suffix" value={val('counter_years_suffix')} onChange={(e) => setVal('counter_years_suffix', e.target.value, 'counters')} />
          <Field label="Campaigns Value" value={val('counter_campaigns_value')} onChange={(e) => setVal('counter_campaigns_value', Number(e.target.value) || 0, 'counters')} type="number" />
          <Field label="Campaigns Suffix" value={val('counter_campaigns_suffix')} onChange={(e) => setVal('counter_campaigns_suffix', e.target.value, 'counters')} />
          <Field label="Markets Value" value={val('counter_markets_value')} onChange={(e) => setVal('counter_markets_value', Number(e.target.value) || 0, 'counters')} type="number" />
          <Field label="Markets Suffix" value={val('counter_markets_suffix')} onChange={(e) => setVal('counter_markets_suffix', e.target.value, 'counters')} />
          <Field label="Awards Value" value={val('counter_awards_value')} onChange={(e) => setVal('counter_awards_value', Number(e.target.value) || 0, 'counters')} type="number" />
          <Field label="Awards Suffix" value={val('counter_awards_suffix')} onChange={(e) => setVal('counter_awards_suffix', e.target.value, 'counters')} />
        </div>
        <SaveBtn group="counters" />
      </Section>

      {/* Clients Section */}
      <Section title="CLIENTS MARQUEE" open={openSections.clients} onToggle={() => toggle('clients')}>
        {(() => {
          const clients = Array.isArray(val('client_list')) ? val('client_list') : []
          const updateClient = (idx, field, value) => {
            const list = [...clients]
            list[idx] = { ...list[idx], [field]: value }
            setVal('client_list', list, 'clients')
          }
          const addClient = () => setVal('client_list', [...clients, { abbr: '', name: '' }], 'clients')
          const removeClient = (idx) => setVal('client_list', clients.filter((_, i) => i !== idx), 'clients')

          return (
            <>
              {clients.map((c, i) => (
                <div key={i} className="flex gap-2 mb-2">
                  <input value={c.abbr} onChange={(e) => updateClient(i, 'abbr', e.target.value)} placeholder="Abbreviation"
                    className="w-20 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <input value={c.name} onChange={(e) => updateClient(i, 'name', e.target.value)} placeholder="Client name"
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <button type="button" onClick={() => removeClient(i)} className="text-red-400 hover:text-red-300 px-2">&times;</button>
                </div>
              ))}
              <button type="button" onClick={addClient} className="text-[#dc1e1e] text-xs hover:underline mt-1">+ Add Client</button>
              <div><SaveBtn group="clients" /></div>
            </>
          )
        })()}
      </Section>

      {/* Contact Section */}
      <Section title="CONTACT INFO" open={openSections.contact} onToggle={() => toggle('contact')}>
        <Field label="Email" value={val('contact_email')} onChange={(e) => setVal('contact_email', e.target.value, 'contact')} />
        {(() => {
          const phones = Array.isArray(val('contact_phones')) ? val('contact_phones') : []
          const updatePhone = (idx, field, value) => {
            const list = [...phones]
            list[idx] = { ...list[idx], [field]: value }
            setVal('contact_phones', list, 'contact')
          }
          const addPhone = () => setVal('contact_phones', [...phones, { country: '', flag: '', number: '', tel: '' }], 'contact')
          const removePhone = (idx) => setVal('contact_phones', phones.filter((_, i) => i !== idx), 'contact')

          return (
            <>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2">Phone Numbers</label>
              {phones.map((p, i) => (
                <div key={i} className="grid grid-cols-[60px_1fr_1fr_1fr_auto] gap-2 mb-2">
                  <input value={p.flag} onChange={(e) => updatePhone(i, 'flag', e.target.value)} placeholder="Flag"
                    className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm text-center focus:outline-none focus:border-[#dc1e1e]" />
                  <input value={p.country} onChange={(e) => updatePhone(i, 'country', e.target.value)} placeholder="Country"
                    className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <input value={p.number} onChange={(e) => updatePhone(i, 'number', e.target.value)} placeholder="Number"
                    className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <input value={p.tel} onChange={(e) => updatePhone(i, 'tel', e.target.value)} placeholder="tel:+..."
                    className="bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <button type="button" onClick={() => removePhone(i)} className="text-red-400 hover:text-red-300 px-2">&times;</button>
                </div>
              ))}
              <button type="button" onClick={addPhone} className="text-[#dc1e1e] text-xs hover:underline mt-1">+ Add Phone</button>
            </>
          )
        })()}
        <div><SaveBtn group="contact" /></div>
      </Section>

      {/* About Section */}
      <Section title="ABOUT SECTION" open={openSections.about} onToggle={() => toggle('about')}>
        <Field label="Since Label" value={val('about_since')} onChange={(e) => setVal('about_since', e.target.value, 'about')} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Story Paragraph 1 (EN)" value={val('about_story_p1_en')} onChange={(e) => setVal('about_story_p1_en', e.target.value, 'about')} type="textarea" />
          <Field label="Story Paragraph 1 (AR)" value={val('about_story_p1_ar')} onChange={(e) => setVal('about_story_p1_ar', e.target.value, 'about')} type="textarea" />
          <Field label="Story Paragraph 2 (EN)" value={val('about_story_p2_en')} onChange={(e) => setVal('about_story_p2_en', e.target.value, 'about')} type="textarea" />
          <Field label="Story Paragraph 2 (AR)" value={val('about_story_p2_ar')} onChange={(e) => setVal('about_story_p2_ar', e.target.value, 'about')} type="textarea" />
          <Field label="Story Paragraph 3 (EN)" value={val('about_story_p3_en')} onChange={(e) => setVal('about_story_p3_en', e.target.value, 'about')} type="textarea" />
          <Field label="Story Paragraph 3 (AR)" value={val('about_story_p3_ar')} onChange={(e) => setVal('about_story_p3_ar', e.target.value, 'about')} type="textarea" />
        </div>

        {/* Offices */}
        {(() => {
          const offices = Array.isArray(val('about_offices')) ? val('about_offices') : []
          const updateOffice = (idx, field, value) => {
            const list = [...offices]
            list[idx] = { ...list[idx], [field]: value }
            setVal('about_offices', list, 'about')
          }
          const addOffice = () => setVal('about_offices', [...offices, { id: '', city: '', country: '', hq: false }], 'about')
          const removeOffice = (idx) => setVal('about_offices', offices.filter((_, i) => i !== idx), 'about')

          return (
            <>
              <label className="block text-white/50 text-xs uppercase tracking-wider mb-2 mt-4">Offices</label>
              {offices.map((o, i) => (
                <div key={i} className="flex gap-2 mb-2 items-center">
                  <input value={o.id} onChange={(e) => updateOffice(i, 'id', e.target.value)} placeholder="ID"
                    className="w-14 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <input value={o.city} onChange={(e) => updateOffice(i, 'city', e.target.value)} placeholder="City"
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <input value={o.country} onChange={(e) => updateOffice(i, 'country', e.target.value)} placeholder="Country"
                    className="flex-1 bg-white/5 border border-white/10 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-[#dc1e1e]" />
                  <label className="flex items-center gap-1 text-white/50 text-xs whitespace-nowrap">
                    <input type="checkbox" checked={o.hq} onChange={(e) => updateOffice(i, 'hq', e.target.checked)} className="accent-[#dc1e1e]" />
                    HQ
                  </label>
                  <button type="button" onClick={() => removeOffice(i)} className="text-red-400 hover:text-red-300 px-2">&times;</button>
                </div>
              ))}
              <button type="button" onClick={addOffice} className="text-[#dc1e1e] text-xs hover:underline mt-1">+ Add Office</button>
            </>
          )
        })()}
        <div><SaveBtn group="about" /></div>
      </Section>
    </>
  )
}
