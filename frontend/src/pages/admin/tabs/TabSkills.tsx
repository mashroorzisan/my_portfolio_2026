import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSkills, adminCreateSkill, adminUpdateSkill, adminDeleteSkill } from '../../../api/client'
import { SkillCategory } from '../../../types'

const inp  = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-bg focus:outline-none focus:border-navy transition-colors'
const label= 'font-mono text-[10px] uppercase tracking-widest text-light block mb-1.5'

const EMPTY = { icon:'🔧', title:'', tags:[] as string[], order:0 }

export default function TabSkills() {
  const qc = useQueryClient()
  const { data: skills = [] } = useQuery({ queryKey:['skills'], queryFn: getSkills })
  const [editing,  setEditing]  = useState<SkillCategory|null>(null)
  const [creating, setCreating] = useState(false)
  const [form,     setForm]     = useState(EMPTY)
  const [tagsStr,  setTagsStr]  = useState('')
  const [saved,    setSaved]    = useState(false)

  const inv = () => qc.invalidateQueries({ queryKey:['skills'] })
  const createMut = useMutation({ mutationFn: adminCreateSkill, onSuccess:()=>{ inv(); closeForm() } })
  const updateMut = useMutation({ mutationFn:({id,d}:{id:number;d:object})=>adminUpdateSkill(id,d), onSuccess:()=>{ inv(); setSaved(true); setTimeout(()=>setSaved(false),2000) } })
  const deleteMut = useMutation({ mutationFn: adminDeleteSkill, onSuccess: inv })

  const openCreate = () => { setForm(EMPTY); setTagsStr(''); setEditing(null); setCreating(true) }
  const openEdit   = (s: SkillCategory) => { setForm({...s}); setTagsStr(s.tags.join(', ')); setEditing(s); setCreating(false) }
  const closeForm  = () => { setEditing(null); setCreating(false) }

  const save = () => {
    const data = { ...form, tags: tagsStr.split(',').map(s=>s.trim()).filter(Boolean) }
    if (creating) createMut.mutate(data)
    else if (editing) updateMut.mutate({ id: editing.id, d: data })
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-extrabold text-navy">Skills</h1>
          <p className="text-mid text-sm mt-1">Manage skill categories shown on the homepage</p>
        </div>
        <button onClick={openCreate} className="btn-coral">+ Add Category</button>
      </div>

      {!editing && !creating && (
        <div className="flex flex-col gap-3">
          {skills.map((s: SkillCategory) => (
            <div key={s.id} className="card px-5 py-4 flex items-start gap-4">
              <span className="text-2xl">{s.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-navy text-sm mb-2">{s.title}</p>
                <div className="flex flex-wrap gap-1.5">
                  {s.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
              </div>
              <div className="flex gap-3 flex-shrink-0">
                <button onClick={()=>openEdit(s)} className="font-mono text-xs text-blue hover:underline">Edit</button>
                <button onClick={()=>{ if(window.confirm('Delete?')) deleteMut.mutate(s.id) }} className="font-mono text-xs text-red-400 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {(editing || creating) && (
        <div className="card p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-xl font-bold text-navy">{creating ? 'New Skill Category' : `Edit: ${editing?.title}`}</h2>
            <button onClick={closeForm} className="text-mid hover:text-navy font-mono text-xs">← Cancel</button>
          </div>
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <div><label className={label}>Icon (emoji)</label><input className={inp} value={form.icon} onChange={e=>setForm(p=>({...p,icon:e.target.value}))} /></div>
              <div><label className={label}>Title</label><input className={inp} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} /></div>
            </div>
            <div><label className={label}>Order</label><input className={inp} type="number" value={form.order} onChange={e=>setForm(p=>({...p,order:+e.target.value}))} /></div>
            <div><label className={label}>Skills / Tags (comma separated)</label>
              <textarea className={inp+' min-h-[100px] resize-y'} value={tagsStr} onChange={e=>setTagsStr(e.target.value)} placeholder="Python, Pandas, NumPy, Power BI" />
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button onClick={save} disabled={createMut.isPending||updateMut.isPending} className="btn-coral">
                {createMut.isPending||updateMut.isPending ? 'Saving…' : (creating ? 'Create' : 'Save Changes')}
              </button>
              {saved && <span className="font-mono text-xs text-emerald-500">✓ Saved!</span>}
              <button onClick={closeForm} className="text-mid text-sm hover:text-navy ml-auto">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
