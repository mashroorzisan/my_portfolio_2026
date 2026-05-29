import { useEffect, useState } from 'react'
import { SiteSettings, HeroStat } from '../../types'
import { useCounterReveal } from '../../hooks/useReveal'

function StatItem({ stat }: { stat: HeroStat }) {
  const ref = useCounterReveal()
  return (
    <div className="flex-1 text-center py-6 px-4 bg-card border border-border first:rounded-l-xl last:rounded-r-xl">
      <span
        ref={ref}
        data-target={stat.target}
        data-suffix={stat.suffix}
        className="block font-serif text-3xl md:text-4xl font-extrabold text-navy tracking-tight leading-none"
      >
        0
      </span>
      <span className="block font-mono text-[9px] uppercase tracking-widest text-light mt-1">
        {stat.label}
      </span>
    </div>
  )
}

export default function Hero({ settings }: { settings: SiteSettings }) {
  const [roleText, setRoleText] = useState('')
  const [roleIdx,  setRoleIdx]  = useState(0)
  const [charIdx,  setCharIdx]  = useState(0)
  const [deleting, setDeleting] = useState(false)

  let roles: string[] = ['Data Scientist']
  try { roles = JSON.parse(settings.hero_roles ?? '[]') } catch { /* fallback */ }

  let stats: HeroStat[] = []
  try { stats = JSON.parse(settings.hero_stats ?? '[]') } catch { /* fallback */ }

  // Build hero photo URL
  const heroPhotoUrl = settings.hero_photo
    ? (settings.hero_photo.startsWith('http') ? settings.hero_photo : `http://localhost:8000${settings.hero_photo}`)
    : null

  useEffect(() => {
    const current = roles[roleIdx]
    const timeout = setTimeout(() => {
      if (!deleting) {
        setRoleText(current.slice(0, charIdx + 1))
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), 1600)
        } else {
          setCharIdx(c => c + 1)
        }
      } else {
        setRoleText(current.slice(0, charIdx - 1))
        if (charIdx - 1 === 0) {
          setDeleting(false)
          setRoleIdx(i => (i + 1) % roles.length)
          setCharIdx(0)
        } else {
          setCharIdx(c => c - 1)
        }
      }
    }, deleting ? 45 : 90)
    return () => clearTimeout(timeout)
  }, [charIdx, deleting, roleIdx, roles])

  return (
    <section id="hero" className="min-h-screen flex flex-col justify-center pt-24 pb-16 relative overflow-hidden">
      {/* grid bg */}
      <div className="absolute inset-0 hero-grid opacity-50 pointer-events-none" />

      {/* Hero photo — top right corner, like a portrait */}
      {heroPhotoUrl && (
        <div className="absolute top-24 right-8 md:right-16 z-10 anim-0 hidden md:block">
          <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-2xl overflow-hidden border-4 border-border shadow-2xl">
            <img
              src={heroPhotoUrl}
              alt={settings.name}
              className="w-full h-full object-cover object-top"
            />
          </div>
          {/* decorative accent */}
          <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-coral/30 -z-10" />
        </div>
      )}

      <div className={`max-w-4xl mx-auto px-8 relative z-10 ${heroPhotoUrl ? 'md:pr-80 lg:pr-96' : ''}`}>
        {/* Badge */}
        <div className="anim-0 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-blue bg-blue/8 border border-blue/20 rounded-full px-3.5 py-1.5 mb-7">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-l badge-dot" />
          Open to opportunities
        </div>

        {/* Name */}
        <h1 className="anim-1 font-serif font-extrabold leading-[0.92] tracking-tight text-navy mb-5" style={{ fontSize: 'clamp(3.2rem,9vw,7rem)' }}>
          {settings.name.split(' ')[0]}<br />
          <em className="text-coral font-light not-italic">{settings.name.split(' ').slice(1).join(' ')}</em>
        </h1>

        {/* Roles typewriter */}
        <div className="anim-2 flex items-center gap-1 font-mono text-mid mb-6" style={{ fontSize: 'clamp(.85rem,2vw,1rem)' }}>
          <span className="text-coral font-medium">—&nbsp;</span>
          <span>{roleText}</span>
          <span className="text-blue cursor">|</span>
        </div>

        {/* Subtitle */}
        <p className="anim-3 text-mid text-lg leading-relaxed max-w-lg mb-10">
          {settings.hero_sub}
        </p>

        {/* CTAs */}
        <div className="anim-4 flex gap-4 flex-wrap">
          <a href="#projects" className="btn-primary" onClick={e => { e.preventDefault(); document.getElementById('projects')?.scrollIntoView({ behavior:'smooth' }) }}>
            View Projects
          </a>
          <a href="#contact" className="btn-ghost" onClick={e => { e.preventDefault(); document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' }) }}>
            Get in Touch
          </a>
        </div>
      </div>

      {/* Stats bar */}
      {stats.length > 0 && (
        <div className="anim-4 max-w-4xl mx-auto w-full px-8 mt-20 relative z-10">
          <div className="flex items-stretch">
            {stats.map((s, i) => (
              <div key={i} className="flex-1 flex items-stretch">
                <StatItem stat={s} />
                {i < stats.length - 1 && <div className="w-px bg-border self-stretch" />}
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
