export default function Footer() {
  return (
    <footer className="bg-[#080F16] border-t border-white/5 py-7">
      <div className="max-w-6xl mx-auto px-8 flex flex-wrap items-center justify-between gap-4">
        <span className="font-serif text-xl font-extrabold text-white">
          IA<span className="text-coral">.</span>
        </span>
        <span className="text-xs text-white/30">
          Built by Ishtiaque Ahmed · {new Date().getFullYear()}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-widest text-white/20 hidden sm:block">
          Data Scientist & AI Developer
        </span>
      </div>
    </footer>
  )
}
