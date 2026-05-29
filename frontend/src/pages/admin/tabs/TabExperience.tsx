import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExperience, getCertifications, adminCreateExp, adminUpdateExp, adminDeleteExp, adminCreateCert, adminUpdateCert, adminDeleteCert } from '../../../api/client'
import { Experience, Certification } from '../../../types'

const inp   = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-bg focus:outline-none focus:border-navy transition-colors'
const label = 'font-mono text-[10px] uppercase tracking-widest text-light block mb-1.5'

const EXP_EMPTY  = { type:'work' as const, date:'', title:'', organization:'', description:'', order:0 }
const CERT_EMPTY = { issuer:'', name:'', date:'', order:0 }

export default function TabExperience() {
  const qc = useQueryClient()
  const { data: experience     = [] } = useQuery({ queryKey:['experience'],     queryFn: getExperience })
  const { data: certifications = [] } = useQuery({ queryKey:['certifications'], queryFn: getCertifications })

  // --- Experience state ---
  const [expEdit,  setExpEdit]  = useState<Experience|null>(null)
  const [expNew,   setExpNew]   = useState(false)
  const [expForm,  setExpForm]  = useState(EXP_EMPTY)

  const invExp  = () => qc.invalidateQueries({ queryKey:['experience'] })
  const expCreate = useMutation({ mutationFn: adminCreateExp,  onSuccess:()=>{ invExp(); setExpNew(false); setExpEdit(null) } })
  const expUpdate = useMutation({ mutationFn:({id,d}:{id:number;d:object})=>adminUpdateExp(id,d), onSuccess: invExp })
  const expDelete = useMutation({ mutationFn: adminDeleteExp,  onSuccess: invExp })

  // --- Cert state ---
  const [certEdit, setCertEdit] = useState<Certification|null>(null)
  const [certNew,  setCertNew]  = useState(false)
  const [certForm, setCertForm] = useState(CERT_EMPTY)

  const invCert  = () => qc.invalidateQueries({ queryKey:['certifications'] })
  const certCreate = useMutation({ mutationFn: adminCreateCert,  onSuccess:()=>{ invCert(); setCertNew(false); setCertEdit(null) } })
  const certUpdate = useMutation({ mutationFn:({id,d}:{id:number;d:object})=>adminUpdateCert(id,d), onSuccess: invCert })
  const certDelete = useMutation({ mutationFn: adminDeleteCert,  onSuccess: invCert })

  const saveExp = () => {
    if (expNew)       expCreate.mutate(expForm)
    else if (expEdit) expUpdate.mutate({ id: expEdit.id, d: expForm })
  }
  const saveCert = () => {
    if (certNew)       certCreate.mutate(certForm)
    else if (certEdit) certUpdate.mutate({ id: certEdit.id, d: certForm })
  }

  return (
    <div className="max-w-3xl flex flex-col gap-10">
      <div>
        <h1 className="font-serif text-3xl font-extrabold text-navy">Experience & Education</h1>
        <p className="text-mid text-sm mt-1">Manage timeline and certifications shown on the homepage</p>
      </div>

      {/* ── Experience ─────────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
          <h2 className="font-serif text-xl font-bold text-navy">Timeline</h2>
          <button onClick={()=>{ setExpForm(EXP_EMPTY); setExpNew(true); setExpEdit(null) }} className="btn-coral text-sm py-1.5 px-4">+ Add</button>
        </div>

        {(expNew || expEdit) && (
          <div className="bg-bg-alt rounded-xl p-5 mb-6 border border-border">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div><label className={label}>Type</label>
                <select className={inp} value={expForm.type} onChange={e=>setExpForm(p=>({...p,type:e.target.value as 'work'|'education'}))}>
                  <option value="work">Work</option><option value="education">Education</option>
                </select>
              </div>
              <div><label className={label}>Date</label><input className={inp} value={expForm.date} onChange={e=>setExpForm(p=>({...p,date:e.target.value}))} placeholder="June 2024 — Present" /></div>
              <div><label className={label}>Title</label><input className={inp} value={expForm.title} onChange={e=>setExpForm(p=>({...p,title:e.target.value}))} /></div>
              <div><label className={label}>Organization</label><input className={inp} value={expForm.organization} onChange={e=>setExpForm(p=>({...p,organization:e.target.value}))} /></div>
              <div><label className={label}>Order</label><input className={inp} type="number" value={expForm.order} onChange={e=>setExpForm(p=>({...p,order:+e.target.value}))} /></div>
            </div>
            <div className="mb-4"><label className={label}>Description</label>
              <textarea className={inp+' resize-y min-h-[80px]'} value={expForm.description||''} onChange={e=>setExpForm(p=>({...p,description:e.target.value}))} />
            </div>
            <div className="flex gap-3">
              <button onClick={saveExp} className="btn-coral text-sm py-1.5 px-4">{expNew ? 'Create' : 'Save'}</button>
              <button onClick={()=>{ setExpNew(false); setExpEdit(null) }} className="text-sm text-mid hover:text-navy">Cancel</button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {experience.map((e: Experience) => (
            <div key={e.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-bg-alt group">
              <span className={`font-mono text-[9px] uppercase tracking-wide px-2 py-1 rounded flex-shrink-0 mt-0.5 ${e.type==='education' ? 'text-gold bg-gold/10 border border-gold/20' : 'text-blue bg-blue/10 border border-blue/20'}`}>{e.type}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-navy">{e.title}</p>
                <p className="text-xs text-mid">{e.organization} · {e.date}</p>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>{ setExpForm({type:e.type,date:e.date,title:e.title,organization:e.organization,description:e.description||'',order:e.order}); setExpEdit(e); setExpNew(false) }} className="font-mono text-xs text-blue hover:underline">Edit</button>
                <button onClick={()=>{ if(window.confirm('Delete?')) expDelete.mutate(e.id) }} className="font-mono text-xs text-red-400 hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Certifications ─────────────────────────── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
          <h2 className="font-serif text-xl font-bold text-navy">Certifications</h2>
          <button onClick={()=>{ setCertForm(CERT_EMPTY); setCertNew(true); setCertEdit(null) }} className="btn-coral text-sm py-1.5 px-4">+ Add</button>
        </div>

        {(certNew || certEdit) && (
          <div className="bg-bg-alt rounded-xl p-5 mb-6 border border-border">
            <div className="grid sm:grid-cols-2 gap-4 mb-4">
              <div><label className={label}>Issuer</label><input className={inp} value={certForm.issuer} onChange={e=>setCertForm(p=>({...p,issuer:e.target.value}))} placeholder="IBM / Coursera" /></div>
              <div><label className={label}>Date</label><input className={inp} value={certForm.date} onChange={e=>setCertForm(p=>({...p,date:e.target.value}))} placeholder="May 2024" /></div>
              <div className="sm:col-span-2"><label className={label}>Certificate Name</label><input className={inp} value={certForm.name} onChange={e=>setCertForm(p=>({...p,name:e.target.value}))} /></div>
              <div><label className={label}>Order</label><input className={inp} type="number" value={certForm.order} onChange={e=>setCertForm(p=>({...p,order:+e.target.value}))} /></div>
            </div>
            <div className="flex gap-3">
              <button onClick={saveCert} className="btn-coral text-sm py-1.5 px-4">{certNew ? 'Create' : 'Save'}</button>
              <button onClick={()=>{ setCertNew(false); setCertEdit(null) }} className="text-sm text-mid hover:text-navy">Cancel</button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {certifications.map((c: Certification) => (
            <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-alt group">
              <span className="font-mono text-[9px] text-navy bg-bg-alt border border-border px-2 py-1 rounded flex-shrink-0">{c.issuer}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-navy">{c.name}</p>
                {c.date && <p className="font-mono text-[10px] text-light">{c.date}</p>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={()=>{ setCertForm({issuer:c.issuer,name:c.name,date:c.date,order:c.order}); setCertEdit(c); setCertNew(false) }} className="font-mono text-xs text-blue hover:underline">Edit</button>
                <button onClick={()=>{ if(window.confirm('Delete?')) certDelete.mutate(c.id) }} className="font-mono text-xs text-red-400 hover:underline">Del</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
