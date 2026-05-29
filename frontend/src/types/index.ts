export interface Project {
  id: number
  slug: string
  title: string
  tagline: string
  category: 'AI' | 'Data' | 'Automation'
  tags: string[]
  featured: boolean
  date: string
  client?: string
  description: string
  highlights: string[]
  github?: string
  live?: string
  icon: string
  readme_content?: string
  video_url?: string
  order: number
  created_at: string
  updated_at: string
}

export interface SkillCategory {
  id: number
  icon: string
  title: string
  tags: string[]
  order: number
}

export interface SiteSettings {
  name: string
  tagline: string
  location: string
  email: string
  phone: string
  resume_url: string
  hero_sub: string
  hero_roles: string
  hero_stats: string
  about_heading: string
  about_paragraphs: string
  social_links: string
  contact_sub: string
  hero_photo?: string
  about_photo?: string
  [key: string]: string | undefined
}

export interface HeroStat {
  target: number
  suffix: string
  label: string
}

export interface SocialLink {
  label: string
  url: string
}

export interface Experience {
  id: number
  type: 'work' | 'education'
  date: string
  title: string
  organization: string
  description?: string
  order: number
}

export interface Certification {
  id: number
  issuer: string
  name: string
  date: string
  order: number
}

export interface Message {
  id: number
  name: string
  email: string
  subject: string
  body: string
  read: boolean
  created_at: string
}

export interface LoginPayload {
  username: string
  password: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}
