import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, adminCreateProject, adminUpdateProject, adminDeleteProject } from '../../../api/client'
import { Project } from '../../../types'

const EMPTY: Omit<Project,'id'|'created_at'|'updated_at'> = {
  slug:'', title:'', tagline:'', category:'AI', tags:[], featured:false,
  date:'', client:'', description:'', highlights:[], github:'', live:'',
  icon:'🚀', readme_content:'', video_url:'', order:0,
}

const inp  = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-bg focus:outline-none focus:border-navy transition-colors'
const label= 'font-mono text-[10px] uppercase tracking-widest text-light block mb-1.5'

function Field({ lbl, children }: { lbl: string; children: React.ReactNode }) {
  return <div><label className={label}>{lbl}</label>{children}</div>
}

export default function TabProjects() {
  const qc  = useQueryClient()
  const { data: projects = [], isLoading } = useQuery({ queryKey:['projects'], queryFn: getProjects })

  const [editing,  setEditing]  = useState<Project | null>(null)
  const [creating, setCreating] = useState(false)
  const [form,     setForm]     = useState<typeof EMPTY>(EMPTY)
  const [tagsStr,  setTagsStr]  = useState('')
  const [hlStr,    setHlStr]    = useState('')
  const [saved,    setSaved]    = useState(false)

  const invalidate = () => qc.invalidateQueries({ queryKey:['projects'] })

  const createMut = useMutation({ mutationFn: adminCreateProject, onSuccess: () => { invalidate(); closeForm() } })
  const updateMut = useMutation({ mutationFn: ({ id, d }: { id:number; d:object }) => adminUpdateProject(id, d), onSuccess: () => { invalidate(); setSaved(true); setTimeout(()=>setSaved(false),2000) } })
  const deleteMut = useMutation({ mutationFn: adminDeleteProject, onSuccess: invalidate })

  const openCreate = () => { setForm(EMPTY); setTagsStr(''); setHlStr(''); setEditing(null); setCreating(true) }
  const openEdit   = (p: Project) => {
    setForm({ ...p }); setTagsStr(p.tags.join(', ')); setHlStr(p.highlights.join('\n'))
    setEditing(p); setCreating(false)
  }
  const closeForm  = () => { setEditing(null); setCreating(false) }

  const save = () => {
    const data = { ...form, tags: tagsStr.split(',').map(s=>s.trim()).filter(Boolean), highlights: hlStr.split('\n').map(s=>s.trim()).filter(Boolean) }
    if (creating) createMut.mutate(data)
    else if (editing) updateMut.mutate({ id: editing.id, d: data })
  }

  const del = (id: number) => { if (window.confirm('Delete this project?')) deleteMut.mutate(id) }

  const f = (k: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }))

  if (isLoading) return <p className="text-mid text-sm">Loading…</p>

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-navy">Projects</h1>
          <p className="text-mid text-sm mt-1">{projects.length} projects · click a row to edit</p>
        </div>
        <button onClick={openCreate} className="btn-coral">+ New Project</button>
      </div>

      {/* List */}
      {!editing && !creating && (
        <div className="flex flex-col gap-3">
          {projects.map((p: Project) => (
            <div key={p.id} className="card px-5 py-4 flex items-center gap-4 hover:shadow-md cursor-pointer" onClick={() => openEdit(p)}>
              <span className="text-2xl">{p.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-navy text-sm">{p.title}</span>
                  {p.featured && <span className="font-mono text-[9px] bg-coral/10 text-coral border border-coral/20 px-2 py-0.5 rounded-full uppercase tracking-widest">Featured</span>}
                  <span className="font-mono text-[9px] text-light">{p.category}</span>
                </div>
                <p className="text-xs text-mid truncate mt-0.5">{p.tagline}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={e=>{e.stopPropagation();openEdit(p)}} className="font-mono text-xs text-blue hover:underline">Edit</button>
                <button onClick={e=>{e.stopPropagation();del(p.id)}} className="font-mono text-xs text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {(editing || creating) && (
        <div className="card p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-serif text-2xl font-bold text-navy">
              {creating ? 'New Project' : `Editing: ${editing?.title}`}
            </h2>
            <button onClick={closeForm} className="text-mid hover:text-navy font-mono text-xs">← Cancel</button>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            <Field lbl="Title"><input className={inp} value={form.title} onChange={f('title')} /></Field>
            <Field lbl="Slug (URL)"><input className={inp} value={form.slug} onChange={f('slug')} placeholder="my-project-name" /></Field>
            <Field lbl="Tagline">
              <input className={inp} value={form.tagline} onChange={f('tagline')} />
            </Field>
            <Field lbl="Icon (emoji)">
              <input className={inp} value={form.icon} onChange={f('icon')} />
            </Field>
            <Field lbl="Category">
              <select className={inp} value={form.category} onChange={f('category')}>
                <option>AI</option><option>Data</option><option>Automation</option>
              </select>
            </Field>
            <Field lbl="Date"><input className={inp} value={form.date} onChange={f('date')} placeholder="2025" /></Field>
            <Field lbl="Client"><input className={inp} value={form.client||''} onChange={f('client')} /></Field>
            <Field lbl="Order (number)"><input className={inp} type="number" value={form.order} onChange={f('order')} /></Field>
            <Field lbl="GitHub URL"><input className={inp} value={form.github||''} onChange={f('github')} /></Field>
            <Field lbl="Live URL"><input className={inp} value={form.live||''} onChange={f('live')} /></Field>
            <Field lbl="Video URL (YouTube / Vimeo / mp4)">
              <input className={inp} value={form.video_url||''} onChange={f('video_url')} placeholder="https://youtube.com/watch?v=..." />
            </Field>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="featured" checked={form.featured} onChange={e=>setForm(p=>({...p,featured:e.target.checked}))} className="w-4 h-4 accent-coral" />
              <label htmlFor="featured" className="text-sm font-medium text-navy">Featured (spans 2 columns)</label>
            </div>
          </div>

          <div className="mt-5">
            <Field lbl="Description (short)">
              <textarea className={inp + ' min-h-[80px] resize-y'} value={form.description} onChange={f('description')} />
            </Field>
          </div>

          <div className="mt-5">
            <Field lbl="Tags (comma separated)">
              <input className={inp} value={tagsStr} onChange={e=>setTagsStr(e.target.value)} placeholder="Python, SQL, FastAPI" />
            </Field>
          </div>

          <div className="mt-5">
            <Field lbl="Highlights (one per line)">
              <textarea className={inp + ' min-h-[100px] resize-y'} value={hlStr} onChange={e=>setHlStr(e.target.value)} placeholder="Identified 1,352 missing records&#10;Built full pipeline in SQL" />
            </Field>
          </div>

          <div className="mt-5">
            <Field lbl="README / Project Page Content (Markdown — supports tables, code blocks, video)">
              <textarea
                className={inp + ' min-h-[320px] resize-y font-mono text-[13px]'}
                value={form.readme_content||''}
                onChange={f('readme_content')}
                placeholder="# My Project&#10;&#10;Write full markdown here. Supports **bold**, `code`, tables, ## headings, and more."
              />
            </Field>
            <p className="font-mono text-[10px] text-light mt-1.5">Supports full Markdown: headings, code blocks, tables, lists, links. Video shows automatically if Video URL is set above.</p>
          </div>

          <div className="flex items-center gap-4 mt-8">
            <button onClick={save} disabled={createMut.isPending || updateMut.isPending} className="btn-coral">
              {(createMut.isPending || updateMut.isPending) ? 'Saving…' : (creating ? 'Create Project' : 'Save Changes')}
            </button>
            {saved && <span className="font-mono text-xs text-emerald-500">✓ Saved!</span>}
            {(createMut.isError || updateMut.isError) && <span className="font-mono text-xs text-red-500">Error saving. Check fields.</span>}
            <button onClick={closeForm} className="text-mid text-sm hover:text-navy ml-auto">Cancel</button>
          </div>
        </div>
      )}
    </div>
  )
}
