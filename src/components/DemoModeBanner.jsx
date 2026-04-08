import { isDemoMode } from '../config/demoMode'

export default function DemoModeBanner() {
  if (!isDemoMode()) return null

  return (
    <div className="border-b border-amber-700/40 bg-amber-500 px-4 py-2 text-center text-xs font-semibold text-amber-950 sm:text-sm">
      <strong className="font-bold">Presentation mode:</strong> Sign-in and checkout are simulated — no real charges or
      server calls. Set <code className="rounded bg-amber-600/40 px-1">VITE_DEMO_MODE=false</code> when you go live.
    </div>
  )
}
