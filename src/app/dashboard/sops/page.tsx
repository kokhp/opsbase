import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import { listSops } from '@/lib/sops';
import SopForm from './sop-form';

export const dynamic = 'force-dynamic';

export default async function SopsPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const sops = await listSops();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SOP Builder</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Create repeatable playbooks your team can follow without you.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr),minmax(0,0.9fr)]">
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your SOPs</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {sops.length} document{sops.length === 1 ? '' : 's'} created
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {sops.length === 0 && (
                <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                  No SOPs yet. Create your first one to start delegating with confidence.
                </div>
              )}
              {sops.map((sop) => (
                <div key={sop.id} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{sop.title}</h3>
                      {sop.summary && (
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{sop.summary}</p>
                      )}
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      {sop.steps.length} step{sop.steps.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  {sop.steps.length > 0 && (
                    <ol className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                      {sop.steps.slice(0, 4).map((step, idx) => (
                        <li key={`${sop.id}-step-${idx}`} className="flex gap-2">
                          <span className="font-semibold text-gray-400">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                      {sop.steps.length > 4 && (
                        <li className="text-xs text-gray-400">+ {sop.steps.length - 4} more steps</li>
                      )}
                    </ol>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <SopForm />
      </div>
    </div>
  );
}
