import Link from 'next/link';
import { product } from '@/config/product';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <span className="text-xl font-bold text-gray-900">{product.name}</span>
          <div className="flex items-center gap-4">
            {product.monetization_mode === 'freemium' && (
              <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
            )}
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Log in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black transition-colors"
            >
              {product.hero?.cta_text || 'Get Started'}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#e0f2fe,transparent_55%),radial-gradient(circle_at_bottom,#dbeafe,transparent_45%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 py-20 lg:grid-cols-[minmax(0,1.05fr),minmax(0,0.95fr)] lg:py-28">
          <div className="text-left">
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gray-600 shadow-sm">
              Operations OS
            </p>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl text-balance">
              {product.hero?.headline}
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              {product.hero?.subheadline}
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={product.hero?.cta_url || '/signup'}
                className="rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-black shadow-lg shadow-gray-900/20 transition-all"
              >
                {product.hero?.cta_text || 'Get Started Free'}
              </Link>
              <Link href="/login" className="text-base font-medium text-gray-700 hover:text-gray-900">
                Log in →
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                { label: 'Owner-free days', value: '7+ / week' },
                { label: 'Avg SOP adoption', value: '92%' },
                { label: 'Escalation response', value: '< 5 min' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-white/80 bg-white/70 p-4 shadow-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-gray-500">{stat.label}</p>
                  <p className="mt-2 text-xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-brand-200/60 blur-2xl" />
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-xl shadow-gray-900/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Live Ops Brief</p>
                  <h3 className="mt-2 text-lg font-semibold text-gray-900">Delegation Snapshot</h3>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">Owner Away</span>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { title: 'Morning open checklist', status: 'Completed', owner: 'SOP: Retail Open' },
                  { title: 'Client callback queue', status: 'In progress', owner: 'Delegate: Front Desk' },
                  { title: 'Inventory reorder', status: 'Escalated', owner: 'Budget rule: $500 limit' },
                ].map((item) => (
                  <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-gray-900">{item.title}</p>
                      <span className="text-xs text-gray-500">{item.status}</span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">{item.owner}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-dashed border-gray-200 p-4 text-sm text-gray-500">
                Auto-generated owner absence report delivered daily at 5:00 PM.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      {product.problem && (
        <section className="border-t border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
              {product.problem.headline}
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {product.problem.points?.map((point: string, i: number) => (
                <div key={i} className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Solution */}
      {product.solution && (
        <section className="mx-auto max-w-6xl px-4 py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr),minmax(0,1.1fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Why OpsBase</p>
              <h2 className="mt-4 text-3xl font-bold text-gray-900">
                {product.solution.headline}
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {product.solution.description}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Owner Absence Mode', body: 'Set delegate authority and keep escalations off your phone.' },
                { title: 'Decision Guardrails', body: 'Pre-approve spending limits and eliminate constant approvals.' },
                { title: 'Execution Checklists', body: 'Interactive SOPs keep standards consistent across shifts.' },
                { title: 'Daily Ops Report', body: 'Everything that happened, summarized in 3 minutes.' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h3 className="text-base font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center">How OpsBase works</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { step: '01', title: 'Document once', body: 'Turn your best practices into SOPs with clear steps and ownership.' },
              { step: '02', title: 'Delegate with guardrails', body: 'Set authority levels, approvals, and escalation paths that match your risk.' },
              { step: '03', title: 'Run without you', body: 'Track completions, handoffs, and issues in a daily ops brief.' },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{item.step}</p>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      {product.features?.length > 0 && (
        <section className="border-t border-gray-100 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Core capabilities</h2>
                <p className="mt-2 text-sm text-gray-500">Everything you need to step back without losing control.</p>
              </div>
              <Link href="/signup" className="hidden rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 md:inline-flex">
                Start free trial
              </Link>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {product.features.slice(0, 6).map((f: { name: string; description: string }, i: number) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
                  <h3 className="font-semibold text-gray-900">{f.name}</h3>
                  <p className="mt-2 text-sm text-gray-600">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {product.faq?.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 py-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">FAQ</h2>
          <div className="space-y-4">
            {product.faq.map((item: { question: string; answer: string }, i: number) => (
              <details key={i} className="group rounded-xl border border-gray-200 bg-white">
                <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-gray-900">
                  {item.question}
                  <svg className="h-5 w-5 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-gray-600">{item.answer}</div>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="border-t border-gray-100 bg-gray-900">
        <div className="mx-auto max-w-6xl px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to operate without the bottlenecks?</h2>
          <p className="mt-4 text-lg text-gray-300">Start with your first SOP and build a business that runs itself.</p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-lg bg-white px-8 py-3 font-medium text-gray-900 hover:bg-gray-100 transition-colors"
          >
            {product.hero?.cta_text || 'Start Free'}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {product.name}. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
