import { useRef, useEffect } from 'react'
import { SiteSettings, SocialLink } from '../../types'

export default function About({ settings }: { settings: SiteSettings }) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.1 }
    )
    ;[leftRef.current, rightRef.current].forEach(el => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  let paragraphs: string[] = []
  try { paragraphs = JSON.parse(settings.about_paragraphs ?? '[]') } catch { paragraphs = [] }

  let socials: SocialLink[] = []
  try { socials = JSON.parse(settings.social_links ?? '[]') } catch { socials = [] }

  const heading = settings.about_heading || ''

  // Build full photo URL — backend serves uploads at /static/uploads/
  const photoUrl = settings.about_photo
    ? (settings.about_photo.startsWith('http') ? settings.about_photo : `http://localhost:8000${settings.about_photo}`)
    : null

  const initials = settings.name.split(' ').map((n: string) => n[0]).join('')

  return (
    <section id="about" className="py-28 bg-bg-alt">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-[1fr_1.4fr] gap-20 items-start">

          {/* Left — sticky title */}
          <div ref={leftRef} className="reveal md:sticky md:top-24">
            <p className="section-label mb-4">About Me</p>
            <h2 className="section-title">
              {heading.split('.').map((part, i, arr) =>
                i < arr.length - 1
                  ? <span key={i}>{part}.<br /></span>
                  : <em key={i}>{part}</em>
              )}
            </h2>
          </div>

          {/* Right — photo + text */}
          <div ref={rightRef} className="reveal">
            {/* Profile photo */}
            <div className="mb-8">
              {photoUrl ? (
                <img
                  src={photoUrl}
                  alt={settings.name}
                  className="w-28 h-28 rounded-full object-cover object-top border-4 border-border shadow-md"
                />
              ) : (
                <div className="w-28 h-28 rounded-full bg-navy flex items-center justify-center border-4 border-border shadow-md">
                  <span className="font-serif text-3xl font-extrabold text-white">{initials}</span>
                </div>
              )}
            </div>

            {paragraphs.map((p, i) => (
              <p key={i} className="text-mid leading-relaxed mb-5 text-[1.05rem]">{p}</p>
            ))}

            <div className="flex gap-5 flex-wrap mt-8">
              {socials.map(s => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs text-blue border-b border-blue/30 pb-px hover:text-navy hover:border-navy transition-colors"
                >
                  {s.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
