import { useState, useRef, useEffect } from 'react'
import { SiteSettings, SocialLink } from '../../types'
import { submitContact } from '../../api/client'

export default function Contact({ settings }: { settings: SiteSettings }) {
  const [form,    setForm]    = useState({ name:'', email:'', subject:'', body:'' })
  const [status,  setStatus]  = useState<'idle'|'sending'|'ok'|'err'>('idle')
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = innerRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el) } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  let socials: SocialLink[] = []
  try { socials = JSON.parse(settings.social_links) } catch { /* noop */ }

  const send = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await submitContact(form)
      setStatus('ok')
      setForm({ name:'', email:'', subject:'', body:'' })
    } catch {
      setStatus('err')
    }
  }

  const inp = 'w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all'

  return (
    <section id="contact" className="py-28 bg-navy relative overflow-hidden">
      {/* grid overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />

      <div className="max-w-5xl mx-auto px-8 relative z-10">
        <div ref={innerRef} className="reveal text-center mb-14">
          <p className="section-label mb-4" style={{ color:'rgba(255,255,255,.45)' }}>Contact</p>
          <h2 className="section-title text-white">
            Let's work<br /><em>together.</em>
          </h2>
          <p className="text-white/50 mt-5 text-base max-w-md mx-auto leading-relaxed">
            {settings.contact_sub}
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_280px] gap-10 items-start">
          {/* Form */}
          <form onSubmit={send} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Name</label>
                <input className={inp} placeholder="Your name" value={form.name}
                  onChange={e => setForm(f => ({...f, name: e.target.value}))} required />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Email</label>
                <input className={inp} type="email" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm(f => ({...f, email: e.target.value}))} required />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Subject</label>
              <input className={inp} placeholder="What's this about?" value={form.subject}
                onChange={e => setForm(f => ({...f, subject: e.target.value}))} required />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-white/40">Message</label>
              <textarea className={inp + ' resize-y min-h-[140px]'} placeholder="Tell me about your project, role, or idea..."
                value={form.body} onChange={e => setForm(f => ({...f, body: e.target.value}))} required />
            </div>
            <button type="submit" disabled={status==='sending'} className="btn-coral self-start">
              {status==='sending' ? 'Sending…' : 'Send Message →'}
            </button>
            {status==='ok'  && <p className="font-mono text-xs text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 rounded-lg px-4 py-3">✓ Message sent! I'll get back to you soon.</p>}
            {status==='err' && <p className="text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">Something went wrong. Please email me directly at {settings.email}</p>}
          </form>

          {/* Side cards */}
          <div className="flex flex-col gap-3 pt-1">
            <p className="font-mono text-[10px] uppercase tracking-widest text-white/30 mb-1">Or reach me directly</p>
            {[
              { icon:'✉', label:'Email',    value: settings.email,   href:`mailto:${settings.email}` },
              ...socials.map(s => ({ icon: s.label[0], label: s.label, value: s.url.replace('https://','').replace('www.','').split('/')[0], href: s.url }))
            ].map(c => (
              <a key={c.label} href={c.href} target={c.href.startsWith('mailto') ? undefined : '_blank'} rel="noreferrer"
                className="flex items-center gap-3 px-4 py-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/9 hover:border-white/18 hover:translate-x-1 transition-all duration-200">
                <span className="w-9 h-9 rounded-lg bg-coral/12 border border-coral/20 text-coral flex items-center justify-center font-mono font-bold text-sm flex-shrink-0">
                  {c.icon}
                </span>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-widest text-white/35">{c.label}</p>
                  <p className="text-[13px] font-medium text-white/85">{c.value}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
