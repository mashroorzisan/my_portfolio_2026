import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { signIn, isAdmin }     = useAuth()
  const navigate                = useNavigate()

  if (isAdmin) { navigate('/admin'); return null }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      await signIn(username, password)
      navigate('/admin')
    } catch {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  const inp = 'w-full border border-border rounded-lg px-4 py-3 text-sm bg-bg focus:outline-none focus:border-navy transition-colors'

  return (
    <div className="min-h-screen bg-bg-alt flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-navy mb-4">
            <span className="font-serif text-2xl font-extrabold text-white">IA<span className="text-coral">.</span></span>
          </div>
          <h1 className="font-serif text-2xl font-extrabold text-navy">Admin Panel</h1>
          <p className="text-sm text-mid mt-1">Portfolio management — restricted access</p>
        </div>

        <div className="card p-8">
          <form onSubmit={submit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-light">Username</label>
              <input className={inp} value={username} onChange={e => setUsername(e.target.value)} required autoFocus />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-mono text-[10px] uppercase tracking-widest text-light">Password</label>
              <input className={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full text-center justify-center mt-1">
              {loading ? 'Signing in…' : 'Sign In →'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-light mt-6">
          <a href="/" className="hover:text-navy transition-colors">← Back to portfolio</a>
        </p>
      </div>
    </div>
  )
}
