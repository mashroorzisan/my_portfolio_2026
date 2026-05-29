import { useEffect, useRef } from 'react'
import { SkillCategory } from '../../types'

function SkillCard({ skill, delay }: { skill: SkillCategory; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el) } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="reveal card p-8" style={{ transitionDelay: `${delay}ms` }}>
      <div className="text-3xl mb-4">{skill.icon}</div>
      <h3 className="font-serif text-lg font-bold text-navy mb-5">{skill.title}</h3>
      <div className="flex flex-wrap gap-1.5">
        {skill.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  )
}

export default function Skills({ skills }: { skills: SkillCategory[] }) {
  const titleRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = titleRef.current; if (!el) return
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.classList.add('visible'); io.unobserve(el) } }, { threshold: 0.1 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <section id="skills" className="py-28 bg-bg">
      <div className="max-w-6xl mx-auto px-8">
        <div ref={titleRef} className="reveal text-center mb-14">
          <p className="section-label mb-4">Skills</p>
          <h2 className="section-title">What I work with</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {skills.map((s, i) => <SkillCard key={s.id} skill={s} delay={i * 80} />)}
        </div>
      </div>
    </section>
  )
}
