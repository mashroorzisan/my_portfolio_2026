import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import TabProjects    from './tabs/TabProjects'
import TabSkills      from './tabs/TabSkills'
import TabAbout       from './tabs/TabAbout'
import TabExperience  from './tabs/TabExperience'
import TabMessages    from './tabs/TabMessages'
import TabPassword    from './tabs/TabPassword'
import TabImages      from './tabs/TabImages'

const TABS = [
  { id: 'projects',   label: 'Projects',    icon: '🚀' },
  { id: 'skills',     label: 'Skills',      icon: '⚙️' },
  { id: 'about',      label: 'About & Site',icon: '👤' },
  { id: 'images',     label: 'Photos',      icon: '🖼️' },
  { id: 'experience', label: 'Experience',  icon: '📋' },
  { id: 'messages',   label: 'Messages',    icon: '✉️' },
  { id: 'password',   label: 'Password',    icon: '🔑' },
]

export default function Dashboard() {
  const [tab,     setTab]     = useState('projects')
  const [sideOpen,setSideOpen]= useState(false)
  const { signOut }           = useAuth()
  const navigate              = useNavigate()

  const handleLogout = () => { signOut(); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-bg-alt flex">

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-60 bg-bg border-r border-border flex flex-col
        transform transition-transform duration-300
        ${sideOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border">
          <a href="/" className="font-serif text-xl font-extrabold text-navy">
            IA<span className="text-coral">.</span>
            <span className="font-sans text-xs font-normal text-mid ml-2">Admin</span>
          </a>
          <button className="md:hidden text-mid text-lg" onClick={() => setSideOpen(false)}>✕</button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => { setTab(t.id); setSideOpen(false) }}
              className={`admin-nav-item ${tab === t.id ? 'active' : ''}`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <a href="/" target="_blank" rel="noreferrer"
            className="admin-nav-item text-blue mb-1 block text-sm">
            🌐 View Portfolio ↗
          </a>
          <button onClick={handleLogout} className="admin-nav-item text-red-500 hover:bg-red-50 w-full text-left">
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sideOpen && <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSideOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <header className="md:hidden flex items-center justify-between px-5 py-4 bg-bg border-b border-border sticky top-0 z-20">
          <button onClick={() => setSideOpen(true)} className="text-navy flex flex-col gap-1 p-1">
            <span className="block w-5 h-0.5 bg-navy rounded" />
            <span className="block w-5 h-0.5 bg-navy rounded" />
            <span className="block w-5 h-0.5 bg-navy rounded" />
          </button>
          <span className="font-serif font-bold text-navy">
            {TABS.find(t => t.id === tab)?.label}
          </span>
          <span />
        </header>

        {/* Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          {tab === 'projects'   && <TabProjects />}
          {tab === 'skills'     && <TabSkills />}
          {tab === 'about'      && <TabAbout />}
          {tab === 'images'     && <TabImages />}
          {tab === 'experience' && <TabExperience />}
          {tab === 'messages'   && <TabMessages />}
          {tab === 'password'   && <TabPassword />}
        </main>
      </div>
    </div>
  )
}
