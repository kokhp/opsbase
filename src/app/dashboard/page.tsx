import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getSession();
  if (!user) redirect('/login');

  const stats = [
    { label: 'Active SOPs', value: '0', change: '+0%' },
    { label: 'Tasks Delegated', value: '0', change: '+0%' },
    { label: 'Escalations', value: '0', change: '+0%' },
    { label: 'Team Coverage', value: '0%', change: '+0%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Welcome back, {user.name || user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            <p className="mt-1 text-xs text-green-600">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Start with your first SOP</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Document a repeatable process, assign it to a role, and keep your team moving without bottlenecks.
          </p>
          <a
            href="/dashboard/sops"
            className="mt-4 inline-flex items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Open SOP Builder
          </a>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Next up</h2>
          <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <li>Invite a team lead and assign them your new SOP.</li>
            <li>Set escalation rules for overdue tasks.</li>
            <li>Enable owner-absence mode before your next day off.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
