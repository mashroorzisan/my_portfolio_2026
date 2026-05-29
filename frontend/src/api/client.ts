import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Attach token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('admin_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

// Auto-logout on 401
api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401 && window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      localStorage.removeItem('admin_token')
      window.location.href = '/admin/login'
    }
    return Promise.reject(err)
  }
)

// ── Public endpoints ─────────────────────────────────────────
export const getProjects      = ()           => api.get('/projects').then(r => r.data)
export const getProject       = (slug: string) => api.get(`/projects/${slug}`).then(r => r.data)
export const getSkills        = ()           => api.get('/skills').then(r => r.data)
export const getAbout         = ()           => api.get('/about').then(r => r.data)
export const getExperience    = ()           => api.get('/experience').then(r => r.data)
export const getCertifications= ()           => api.get('/certifications').then(r => r.data)
export const submitContact    = (d: object)  => api.post('/contact', d).then(r => r.data)

// ── Auth ─────────────────────────────────────────────────────
export const login            = (d: object)  => api.post('/auth/login', d).then(r => r.data)
export const changePassword   = (d: object)  => api.put('/auth/password', d).then(r => r.data)

// ── Admin — projects ─────────────────────────────────────────
export const adminCreateProject = (d: object)        => api.post('/projects', d).then(r => r.data)
export const adminUpdateProject = (id: number, d: object) => api.put(`/projects/${id}`, d).then(r => r.data)
export const adminDeleteProject = (id: number)       => api.delete(`/projects/${id}`).then(r => r.data)

// ── Admin — skills ───────────────────────────────────────────
export const adminCreateSkill  = (d: object)         => api.post('/skills', d).then(r => r.data)
export const adminUpdateSkill  = (id: number, d: object) => api.put(`/skills/${id}`, d).then(r => r.data)
export const adminDeleteSkill  = (id: number)        => api.delete(`/skills/${id}`).then(r => r.data)

// ── Admin — about ────────────────────────────────────────────
export const adminUpdateAbout  = (d: object)         => api.put('/about', d).then(r => r.data)

// ── Admin — experience ───────────────────────────────────────
export const adminCreateExp    = (d: object)         => api.post('/experience', d).then(r => r.data)
export const adminUpdateExp    = (id: number, d: object) => api.put(`/experience/${id}`, d).then(r => r.data)
export const adminDeleteExp    = (id: number)        => api.delete(`/experience/${id}`).then(r => r.data)

// ── Admin — certifications ───────────────────────────────────
export const adminCreateCert   = (d: object)         => api.post('/certifications', d).then(r => r.data)
export const adminUpdateCert   = (id: number, d: object) => api.put(`/certifications/${id}`, d).then(r => r.data)
export const adminDeleteCert   = (id: number)        => api.delete(`/certifications/${id}`).then(r => r.data)

// ── Admin — messages ─────────────────────────────────────────
export const adminGetMessages  = ()                  => api.get('/contact/messages').then(r => r.data)
export const adminMarkRead     = (id: number)        => api.put(`/contact/messages/${id}/read`).then(r => r.data)
export const adminDeleteMsg    = (id: number)        => api.delete(`/contact/messages/${id}`).then(r => r.data)

export default api
