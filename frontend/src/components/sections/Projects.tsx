import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Project } from '../../types'

const FILTERS = ['All', 'AI', 'Data', 'Automation'] as const

function catClass(cat: string) {
  if (cat === 'AI')         return 'cat-AI'
  if (cat === 'Data')       return 'cat-Data'
  if (cat === 'Automation') return 'cat-Automation'
  return 'cat-AI'
}

function ProjectCard({ project, delay }: { project: Project; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el) } }, { threshold: 0.08 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      onClick={() => navigate(`/project/${project.slug}`)}
      className={`reveal proj-card card p-8 flex flex-col gap-4 cursor-pointer ${project.featured ? 'md:col-span-2' : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-3xl leading-none">{project.icon}</span>
        <span className={catClass(project.category)}>{project.category}</span>
      </div>

      <div>
        <h3 className="font-serif text-xl font-bold text-navy leading-snug mb-2">{project.title}</h3>
        <p className="text-mid text-sm leading-relaxed">{project.tagline}</p>
      </div>

      <ul className="flex flex-col gap-1.5">
        {project.highlights.slice(0, project.featured ? 4 : 2).map((h, i) => (
          <li key={i} className="text-[13px] text-mid pl-4 relative before:content-['›'] before:absolute before:left-0 before:text-coral before:font-bold leading-snug">
            {h}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
        {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>

      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-4">
          {project.github && (
            <a href={project.github} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="font-mono text-xs text-blue border-b border-blue/25 pb-px hover:text-navy hover:border-navy transition-colors">
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a href={project.live} target="_blank" rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="font-mono text-xs text-blue border-b border-blue/25 pb-px hover:text-navy hover:border-navy transition-colors">
              Live ↗
            </a>
          )}
        </div>
        <span className="font-mono text-[10px] text-light">{project.date}</span>
      </div>
    </div>
  )
}

export default function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<string>('All')
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = titleRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el) } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const visible = filter === 'All' ? projects : projects.filter(p => p.category === filter)

  return (
    <section id="projects" className="py-28 bg-bg-alt">
      <div className="max-w-6xl mx-auto px-8">
        <div ref={titleRef} className="reveal text-center mb-10">
          <p className="section-label mb-4">Projects</p>
          <h2 className="section-title">Things I've built</h2>
        </div>

        {/* Filter buttons */}
        <div className="flex justify-center gap-2 flex-wrap mb-12">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`font-mono text-[11px] uppercase tracking-widest px-5 py-2 rounded-full border-[1.5px] transition-all duration-200 ${
                filter === f
                  ? 'bg-navy border-navy text-white'
                  : 'border-border text-mid hover:border-navy hover:text-navy'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {visible.map((p, i) => <ProjectCard key={p.id} project={p} delay={i * 70} />)}
        </div>
      </div>
    </section>
  )
}
