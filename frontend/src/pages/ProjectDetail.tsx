import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { getProject, getAbout } from '../api/client'
import { SiteSettings } from '../types'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'

function catClass(cat: string) {
  if (cat === 'AI')         return 'cat-AI'
  if (cat === 'Data')       return 'cat-Data'
  if (cat === 'Automation') return 'cat-Automation'
  return 'cat-AI'
}

// Extract YouTube/Vimeo embed URL
function embedUrl(url: string): string | null {
  // YouTube
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/)
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`
  // Vimeo
  const vi = url.match(/vimeo\.com\/(\d+)/)
  if (vi) return `https://player.vimeo.com/video/${vi[1]}`
  // direct mp4 / other — return as-is
  return url
}

export default function ProjectDetail() {
  const { slug }    = useParams<{ slug: string }>()
  const navigate    = useNavigate()

  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['project', slug],
    queryFn:  () => getProject(slug!),
    enabled:  !!slug,
  })
  const { data: settings } = useQuery({ queryKey: ['about'], queryFn: getAbout })
  const s = settings as SiteSettings | undefined

  if (isLoading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-navy border-t-coral rounded-full animate-spin" />
        <p className="font-mono text-xs text-light uppercase tracking-widest">Loading project…</p>
      </div>
    </div>
  )

  if (isError || !project) return (
    <div className="min-h-screen bg-bg flex items-center justify-center flex-col gap-6">
      <h1 className="font-serif text-5xl font-extrabold text-navy">Not <em className="text-coral font-light not-italic">found.</em></h1>
      <button onClick={() => navigate('/')} className="btn-primary">← Back to Portfolio</button>
    </div>
  )

  const html = project.readme_content
    ? DOMPurify.sanitize(marked.parse(project.readme_content) as string)
    : null

  const videoEmbed = project.video_url ? embedUrl(project.video_url) : null
  const isDirectVideo = videoEmbed && (videoEmbed.endsWith('.mp4') || videoEmbed.endsWith('.webm'))

  return (
    <div className="min-h-screen bg-bg">
      <Navbar resumeUrl={s?.resume_url} />

      {/* Hero band */}
      <div className="bg-navy pt-28 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'48px 48px' }} />
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <button onClick={() => navigate(-1)} className="font-mono text-xs text-white/40 hover:text-white transition-colors mb-8 flex items-center gap-2">
            ← Back
          </button>
          <div className="flex items-start gap-4 mb-5">
            <span className="text-4xl">{project.icon}</span>
            <span className={catClass(project.category)}>{project.category}</span>
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            {project.title}
          </h1>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mb-6">{project.tagline}</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {project.tags.map((t: string) => (
              <span key={t} className="font-mono text-[10px] text-white/50 bg-white/8 border border-white/12 rounded px-2 py-1">{t}</span>
            ))}
          </div>
          <div className="flex flex-wrap gap-4">
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer"
                className="font-mono text-xs text-blue-l border border-blue-l/30 px-4 py-2 rounded-lg hover:bg-blue-l/10 transition-colors">
                GitHub ↗
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noreferrer"
                className="font-mono text-xs text-coral border border-coral/30 px-4 py-2 rounded-lg hover:bg-coral/10 transition-colors">
                Live Demo ↗
              </a>
            )}
            {project.client && (
              <span className="font-mono text-xs text-white/35 flex items-center gap-1">
                <span className="text-white/20">|</span> {project.client}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="grid md:grid-cols-[1fr_260px] gap-12 items-start">

          {/* Main — readme */}
          <div>
            {/* Video embed */}
            {videoEmbed && (
              <div className="mb-10 rounded-2xl overflow-hidden border border-border shadow-lg">
                {isDirectVideo ? (
                  <video controls className="w-full aspect-video bg-black">
                    <source src={videoEmbed} />
                  </video>
                ) : (
                  <iframe
                    src={videoEmbed}
                    className="w-full aspect-video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={project.title}
                  />
                )}
              </div>
            )}

            {html ? (
              <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div>
                <p className="section-label mb-3">Overview</p>
                <p className="text-mid leading-relaxed text-lg mb-8">{project.description}</p>
              </div>
            )}
          </div>

          {/* Sidebar — highlights */}
          <div className="md:sticky md:top-24">
            <div className="card p-6 mb-5">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-light mb-4">Key Highlights</h3>
              <ul className="flex flex-col gap-3">
                {project.highlights.map((h: string, i: number) => (
                  <li key={i} className="text-sm text-mid pl-4 relative before:content-['›'] before:absolute before:left-0 before:text-coral before:font-bold leading-snug">
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-light mb-4">Details</h3>
              <div className="flex flex-col gap-3 text-sm">
                {project.date && (
                  <div><p className="text-[10px] font-mono uppercase tracking-widest text-light mb-0.5">Date</p><p className="text-mid">{project.date}</p></div>
                )}
                {project.client && (
                  <div><p className="text-[10px] font-mono uppercase tracking-widest text-light mb-0.5">Client</p><p className="text-mid">{project.client}</p></div>
                )}
                <div><p className="text-[10px] font-mono uppercase tracking-widest text-light mb-0.5">Category</p><span className={catClass(project.category)}>{project.category}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
