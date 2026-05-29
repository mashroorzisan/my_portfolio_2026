import { useEffect, useRef } from 'react'
import { Experience, Certification } from '../../types'

export default function ExperienceSection({
  experience,
  certifications,
}: {
  experience: Experience[]
  certifications: Certification[]
}) {
  const leftRef  = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target) } }),
      { threshold: 0.08 }
    )
    ;[leftRef.current, rightRef.current].forEach(el => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section id="experience" className="py-28 bg-bg">
      <div className="max-w-6xl mx-auto px-8">
        <div className="grid md:grid-cols-[1fr_1.6fr] gap-20 items-start">

          {/* Left sticky */}
          <div ref={leftRef} className="reveal md:sticky md:top-24">
            <p className="section-label mb-4">Experience & Education</p>
            <h2 className="section-title">
              The path<br /><em>so far.</em>
            </h2>
          </div>

          {/* Right timeline + certs */}
          <div ref={rightRef} className="reveal">

            {/* Timeline */}
            <div className="border-l-2 border-border ml-2.5 mb-14">
              {experience.map((item, i) => (
                <div key={item.id} className="relative pl-9 pb-10 last:pb-0 group"
                  style={{ transitionDelay: `${i * 80}ms` }}>
                  {/* dot */}
                  <div className="absolute left-[-9px] top-1.5 w-4 h-4 rounded-full bg-bg border-[2.5px] border-coral group-hover:bg-coral transition-colors duration-200" />

                  <p className="font-mono text-[10px] uppercase tracking-widest text-light mb-1.5">{item.date}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-lg font-bold text-navy leading-snug">{item.title}</h3>
                    {item.type === 'education' && (
                      <span className="font-mono text-[9px] uppercase tracking-widest text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-full">Edu</span>
                    )}
                  </div>
                  <p className="text-blue text-sm font-medium mb-2">{item.organization}</p>
                  {item.description && (
                    <p className="text-mid text-sm leading-relaxed">{item.description}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h3 className="font-serif text-xl font-bold text-navy mb-5">Certifications</h3>
                <div className="flex flex-col gap-3">
                  {certifications.map(c => (
                    <div key={c.id} className="flex items-start gap-3">
                      <span className="font-mono text-[10px] uppercase tracking-wide text-navy bg-bg-alt border border-border rounded px-2 py-1 whitespace-nowrap flex-shrink-0 mt-0.5">
                        {c.issuer}
                      </span>
                      <div>
                        <p className="text-sm text-mid leading-snug">{c.name}</p>
                        {c.date && <p className="font-mono text-[10px] text-light mt-0.5">{c.date}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
