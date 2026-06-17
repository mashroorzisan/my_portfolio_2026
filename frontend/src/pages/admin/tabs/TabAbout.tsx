import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAbout, adminUpdateAbout } from '../../../api/client'
import { SiteSettings } from '../../../types'

const inp   = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-bg focus:outline-none focus:border-navy transition-colors'
const label = 'font-mono text-[10px] uppercase tracking-widest text-light block mb-1.5'
const ta    = inp + ' resize-y'

export default function TabAbout() {
  const qc = useQueryClient()
  const { data: settings, isLoading } = useQuery({ queryKey:['about'], queryFn: getAbout })
  const [form,   setForm]   = useState<Partial<SiteSettings>>({})
  const [saved,  setSaved]  = useState(false)

  useEffect(() => { if (settings) setForm(settings) }, [settings])

  const mut = useMutation({
    mutationFn: adminUpdateAbout,
    onSuccess: () => { qc.invalidateQueries({ queryKey:['about'] }); setSaved(true); setTimeout(()=>setSaved(false),2500) }
  })

  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  if (isLoading) return <p className="text-mid text-sm">Loading…</p>

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-navy">About & Site Settings</h1>
        <p className="text-mid text-sm mt-1">Everything shown on the homepage. Changes go live immediately on Save.</p>
      </div>

      <div className="flex flex-col gap-6">

        {/* Personal */}
        <Section title="Personal Info">
          <Grid>
            <F lbl="Full Name"><input className={inp} value={form.name||''} onChange={f('name')} /></F>
            <F lbl="Tagline"><input className={inp} value={form.tagline||''} onChange={f('tagline')} /></F>
            <F lbl="Location"><input className={inp} value={form.location||''} onChange={f('location')} /></F>
            <F lbl="Email"><input className={inp} value={form.email||''} onChange={f('email')} /></F>
            <F lbl="Phone"><input className={inp} value={form.phone||''} onChange={f('phone')} /></F>
            <F lbl="Resume URL (Google Drive)"><input className={inp} value={form.resume_url||''} onChange={f('resume_url')} /></F>
          </Grid>
        </Section>

        {/* Hero */}
        <Section title="Hero Section">
          <div className="flex flex-col gap-4">
            <F lbl="Hero Subtitle (shown under name)">
              <input className={inp} value={form.hero_sub||''} onChange={f('hero_sub')} />
            </F>
            <F lbl='Roles for typewriter (JSON array, e.g. ["Data Scientist","AI Developer"])'>
              <input className={inp} value={form.hero_roles||''} onChange={f('hero_roles')} />
            </F>
            <F lbl='Hero stats (JSON array: [{target, suffix, label}])'>
              <textarea className={ta+' min-h-[100px] font-mono text-[12px]'} value={form.hero_stats||''} onChange={f('hero_stats')} />
            </F>
          </div>
        </Section>

        {/* About */}
        <Section title="About Section">
          <div className="flex flex-col gap-4">
            <F lbl="About Heading"><input className={inp} value={form.about_heading||''} onChange={f('about_heading')} /></F>
            <F lbl='About Paragraphs (JSON array of strings)'>
              <textarea className={ta+' min-h-[160px] font-mono text-[12px]'} value={form.about_paragraphs||''} onChange={f('about_paragraphs')} />
            </F>
            <F lbl='Social Links (JSON array: [{label, url}])'>
              <textarea className={ta+' min-h-[100px] font-mono text-[12px]'} value={form.social_links||''} onChange={f('social_links')} />
            </F>
          </div>
        </Section>

        {/* Photos */}
        <Section title="Photos">
          <div className="flex flex-col gap-4">
            <p className="text-xs text-mid -mt-1">Paste any direct image URL — Cloudinary, imgur, or any public image link. Changes go live on Save.</p>
            <F lbl="Hero Photo URL (appears top-right in hero section)">
              <input className={inp} value={form.hero_photo||''} onChange={f('hero_photo')} placeholder="https://res.cloudinary.com/..." />
            </F>
            {form.hero_photo && (
              <img src={form.hero_photo} alt="Hero preview" className="w-32 h-32 object-cover rounded-xl border border-border shadow" />
            )}
            <F lbl="Profile Photo URL (circular photo in About section)">
              <input className={inp} value={form.about_photo||''} onChange={f('about_photo')} placeholder="https://res.cloudinary.com/..." />
            </F>
            {form.about_photo && (
              <img src={form.about_photo} alt="Profile preview" className="w-24 h-24 object-cover rounded-full border border-border shadow" />
            )}
          </div>
        </Section>

        {/* Contact */}
        <Section title="Contact Section">
          <F lbl="Contact subtitle text">
            <input className={inp} value={form.contact_sub||''} onChange={f('contact_sub')} />
          </F>
        </Section>

        {/* Save */}
        <div className="flex items-center gap-4 pt-2">
          <button onClick={() => mut.mutate(form)} disabled={mut.isPending} className="btn-coral">
            {mut.isPending ? 'Saving…' : 'Save All Changes'}
          </button>
          {saved && <span className="font-mono text-xs text-emerald-500">✓ Saved! Site updated.</span>}
          {mut.isError && <span className="font-mono text-xs text-red-500">Error saving. Check JSON fields.</span>}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h2 className="font-serif text-lg font-bold text-navy mb-5 pb-3 border-b border-border">{title}</h2>
      {children}
    </div>
  )
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>
}

function F({ lbl, children }: { lbl: string; children: React.ReactNode }) {
  return <div><label className={label}>{lbl}</label>{children}</div>
}
