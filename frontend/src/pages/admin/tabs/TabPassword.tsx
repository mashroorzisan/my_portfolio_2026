import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { changePassword } from '../../../api/client'

const inp = 'w-full border border-border rounded-lg px-3 py-2.5 text-sm bg-bg focus:outline-none focus:border-navy transition-colors'
const label = 'font-mono text-[10px] uppercase tracking-widest text-light block mb-1.5'

export default function TabPassword() {
  const [form,  setForm]  = useState({ current_password:'', new_password:'', confirm:'' })
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  const mut = useMutation({
    mutationFn: changePassword,
    onSuccess:  () => { setSaved(true); setForm({ current_password:'', new_password:'', confirm:'' }); setTimeout(()=>setSaved(false),3000) },
    onError:    (e: unknown) => {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Error changing password.'
      setError(msg)
    },
  })

  const submit = (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSaved(false)
    if (form.new_password !== form.confirm) { setError('New passwords do not match.'); return }
    if (form.new_password.length < 8) { setError('Password must be at least 8 characters.'); return }
    mut.mutate({ current_password: form.current_password, new_password: form.new_password })
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div className="max-w-md">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-navy">Change Password</h1>
        <p className="text-mid text-sm mt-1">Update your admin panel password</p>
      </div>

      <div className="card p-8">
        <form onSubmit={submit} className="flex flex-col gap-5">
          <div><label className={label}>Current Password</label>
            <input className={inp} type="password" value={form.current_password} onChange={f('current_password')} required />
          </div>
          <div><label className={label}>New Password</label>
            <input className={inp} type="password" value={form.new_password} onChange={f('new_password')} required minLength={8} />
          </div>
          <div><label className={label}>Confirm New Password</label>
            <input className={inp} type="password" value={form.confirm} onChange={f('confirm')} required />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          {saved && <p className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">✓ Password updated successfully.</p>}
          <button type="submit" disabled={mut.isPending} className="btn-coral mt-2">
            {mut.isPending ? 'Updating…' : 'Update Password'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-border">
          <p className="font-mono text-[10px] uppercase tracking-widest text-light mb-3">Security Notes</p>
          <ul className="text-xs text-mid space-y-1.5">
            <li>• Default username: <code className="bg-bg-alt px-1.5 py-0.5 rounded font-mono">ishtiaque</code></li>
            <li>• Default password set via <code className="bg-bg-alt px-1.5 py-0.5 rounded font-mono">ADMIN_PASSWORD</code> env var</li>
            <li>• Tokens expire after 7 days — you'll be logged out automatically</li>
            <li>• Never share your admin URL publicly</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
