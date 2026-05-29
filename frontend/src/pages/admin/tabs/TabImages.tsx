import { useState, useRef } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getAbout } from '../../../api/client'
import api from '../../../api/client'
import { SiteSettings } from '../../../types'

function photoUrl(raw?: string): string | null {
  if (!raw) return null
  if (raw.startsWith('http')) return raw
  // Works on both localhost and Render — uses same origin as the page
  return raw
}

interface UploadZoneProps {
  label: string
  sublabel: string
  currentUrl?: string
  aspect: 'circle' | 'landscape'
  endpoint: string
  onSuccess: () => void
}

function UploadZone({ label, sublabel, currentUrl, aspect, endpoint, onSuccess }: UploadZoneProps) {
  const [dragging,  setDragging]  = useState(false)
  const [uploading, setUploading] = useState(false)
  const [success,   setSuccess]   = useState(false)
  const [error,     setError]     = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const upload = async (file: File) => {
    setError(''); setSuccess(false); setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      await api.post(endpoint, form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSuccess(true)
      onSuccess()
      setTimeout(() => setSuccess(false), 3000)
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { detail?: string } } })?.response?.data?.detail || 'Upload failed. Check file type and size (max 5MB).'
      setError(msg)
    } finally {
      setUploading(false)
    }
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) upload(file)
    e.target.value = '' // reset so same file can be re-uploaded
  }

  const deletePhoto = async () => {
    if (!window.confirm('Remove this photo?')) return
    try {
      await api.delete(endpoint)
      onSuccess()
    } catch { setError('Delete failed.') }
  }

  const displayUrl = photoUrl(currentUrl)

  return (
    <div className="card p-6">
      <h3 className="font-serif text-lg font-bold text-navy mb-1">{label}</h3>
      <p className="text-sm text-mid mb-5">{sublabel}</p>

      {/* Current photo */}
      {displayUrl && (
        <div className="relative mb-5 inline-block">
          <img
            src={displayUrl}
            alt={label}
            className={`border-2 border-border shadow-md object-cover ${
              aspect === 'circle'
                ? 'w-32 h-32 rounded-full object-top'
                : 'w-72 h-40 rounded-xl object-center'
            }`}
          />
          <button
            onClick={deletePhoto}
            className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full text-sm flex items-center justify-center hover:bg-red-600 shadow-md font-bold"
            title="Remove photo"
          >✕</button>
        </div>
      )}

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all duration-200 ${
          dragging ? 'border-coral bg-coral/5' : 'border-border hover:border-navy/40 hover:bg-bg-alt'
        }`}
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={onFile} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-navy border-t-coral rounded-full animate-spin" />
            <p className="text-sm text-mid">Uploading…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <span className="text-4xl">{aspect === 'circle' ? '🤳' : '🖼️'}</span>
            <p className="font-medium text-navy text-sm">
              {displayUrl ? 'Click or drag to replace photo' : 'Click or drag photo here'}
            </p>
            <p className="text-xs text-light">JPG, PNG, WebP — max 5MB</p>
          </div>
        )}
      </div>

      {/* Feedback */}
      {success && (
        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
          <span className="text-base">✓</span>
          <span>Photo uploaded and saved! Visible on your portfolio now.</span>
        </div>
      )}
      {error && (
        <p className="text-xs text-red-500 mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
      )}
    </div>
  )
}

export default function TabImages() {
  const qc = useQueryClient()
  const { data: settings } = useQuery({ queryKey: ['about'], queryFn: getAbout })
  const s = settings as SiteSettings | undefined

  const refresh = () => qc.invalidateQueries({ queryKey: ['about'] })

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-extrabold text-navy">Photos</h1>
        <p className="text-mid text-sm mt-1">
          Upload directly from here — no file system access needed. Photos go live on your portfolio instantly after upload.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <UploadZone
          label="Hero Photo"
          sublabel="Appears top-right in your hero section as a portrait. Square or portrait orientation works best."
          currentUrl={s?.hero_photo}
          aspect="circle"
          endpoint="/api/upload/hero"
          onSuccess={refresh}
        />

        <UploadZone
          label="Profile Photo"
          sublabel="Appears as your circular profile picture in the About section. Square or portrait works best."
          currentUrl={s?.about_photo}
          aspect="circle"
          endpoint="/api/upload/about"
          onSuccess={refresh}
        />
      </div>
    </div>
  )
}