/** Full-width medical disclaimer — placed above site footer */
export default function EmergencyDisclaimerBar() {
  return (
    <div className="border-y border-slate-200 bg-slate-100 px-4 py-4 sm:px-8">
      <p className="mx-auto max-w-5xl text-left text-sm leading-relaxed text-slate-800">
        <strong className="font-semibold text-slate-900">Emergency?</strong> Call your local emergency number. For
        poison concerns, contact your regional poison center. This page does not provide diagnosis or treatment.
      </p>
    </div>
  )
}
