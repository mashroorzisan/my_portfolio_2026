import { useQuery } from '@tanstack/react-query'
import { getProjects, getSkills, getAbout, getExperience, getCertifications } from '../api/client'
import { SiteSettings } from '../types'
import Navbar      from '../components/layout/Navbar'
import Footer      from '../components/layout/Footer'
import Hero        from '../components/sections/Hero'
import About       from '../components/sections/About'
import Skills      from '../components/sections/Skills'
import Projects    from '../components/sections/Projects'
import Experience  from '../components/sections/Experience'
import Contact     from '../components/sections/Contact'

export default function Home() {
  const { data: settings } = useQuery({ queryKey: ['about'],          queryFn: getAbout })
  const { data: projects  } = useQuery({ queryKey: ['projects'],       queryFn: getProjects })
  const { data: skills    } = useQuery({ queryKey: ['skills'],         queryFn: getSkills })
  const { data: experience} = useQuery({ queryKey: ['experience'],     queryFn: getExperience })
  const { data: certs     } = useQuery({ queryKey: ['certifications'], queryFn: getCertifications })

  const s = settings as SiteSettings | undefined

  return (
    <div className="min-h-screen">
      <Navbar resumeUrl={s?.resume_url} />
      {s   && <Hero       settings={s} />}
      {s   && <About      settings={s} />}
      {skills     && <Skills      skills={skills} />}
      {projects   && <Projects    projects={projects} />}
      {experience && certs && <Experience experience={experience} certifications={certs} />}
      {s   && <Contact    settings={s} />}
      <Footer />
    </div>
  )
}
