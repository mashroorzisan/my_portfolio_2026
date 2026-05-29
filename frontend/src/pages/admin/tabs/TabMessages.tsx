import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminGetMessages, adminMarkRead, adminDeleteMsg } from '../../../api/client'
import { Message } from '../../../types'

export default function TabMessages() {
  const qc = useQueryClient()
  const { data: messages = [], isLoading } = useQuery({ queryKey:['messages'], queryFn: adminGetMessages })
  const [open, setOpen] = useState<Message|null>(null)

  const inv = () => qc.invalidateQueries({ queryKey:['messages'] })
  const readMut   = useMutation({ mutationFn: adminMarkRead,  onSuccess: inv })
  const deleteMut = useMutation({ mutationFn: adminDeleteMsg, onSuccess: ()=>{ inv(); setOpen(null) } })

  const unread = messages.filter((m: Message) => !m.read).length

  const openMsg = (m: Message) => {
    setOpen(m)
    if (!m.read) readMut.mutate(m.id)
  }

  if (isLoading) return <p className="text-mid text-sm">Loading…</p>

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-navy">Messages</h1>
        <p className="text-mid text-sm mt-1">
          {messages.length} total · {unread > 0 ? <span className="text-coral font-medium">{unread} unread</span> : 'all read'}
        </p>
      </div>

      {messages.length === 0 && (
        <div className="card p-12 text-center">
          <p className="text-4xl mb-4">✉️</p>
          <p className="text-mid text-sm">No messages yet. When someone uses the contact form, they'll appear here.</p>
        </div>
      )}

      {/* List */}
      {!open && messages.length > 0 && (
        <div className="flex flex-col gap-2">
          {messages.map((m: Message) => (
            <div
              key={m.id}
              onClick={() => openMsg(m)}
              className={`card px-5 py-4 flex items-start gap-4 cursor-pointer hover:shadow-md ${!m.read ? 'border-l-4 border-l-coral' : ''}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-sm font-semibold ${!m.read ? 'text-navy' : 'text-mid'}`}>{m.name}</span>
                  <span className="text-xs text-light">·</span>
                  <span className="text-xs text-mid truncate">{m.email}</span>
                  {!m.read && <span className="w-2 h-2 rounded-full bg-coral flex-shrink-0 ml-auto" />}
                </div>
                <p className={`text-sm truncate ${!m.read ? 'text-navy font-medium' : 'text-mid'}`}>{m.subject}</p>
                <p className="text-xs text-light mt-0.5">{new Date(m.created_at).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Open message */}
      {open && (
        <div className="card p-8">
          <button onClick={()=>setOpen(null)} className="font-mono text-xs text-mid hover:text-navy mb-6">← Back to inbox</button>
          <div className="mb-6 pb-6 border-b border-border">
            <h2 className="font-serif text-2xl font-bold text-navy mb-2">{open.subject}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-mid">
              <span><strong className="text-navy">From:</strong> {open.name}</span>
              <span><strong className="text-navy">Email:</strong>
                <a href={`mailto:${open.email}`} className="text-blue ml-1 hover:underline">{open.email}</a>
              </span>
              <span><strong className="text-navy">Received:</strong> {new Date(open.created_at).toLocaleString()}</span>
            </div>
          </div>
          <p className="text-mid leading-relaxed whitespace-pre-wrap">{open.body}</p>
          <div className="flex gap-3 mt-8 pt-6 border-t border-border">
            <a href={`mailto:${open.email}?subject=Re: ${open.subject}`} className="btn-coral text-sm py-2 px-5">
              Reply via Email →
            </a>
            <button
              onClick={()=>{ if(window.confirm('Delete this message?')) deleteMut.mutate(open.id) }}
              className="text-sm text-red-400 hover:text-red-600 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
