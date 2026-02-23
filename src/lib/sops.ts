import { db } from './db';
import { getSession } from './auth';

export interface SopRecord {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  steps: string[];
  created_at: string;
}

async function ensureSopsTable(): Promise<void> {
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS sops (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      summary TEXT,
      steps JSONB NOT NULL DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
      updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_sops_user_id ON sops(user_id)`;
}

export async function listSops(): Promise<SopRecord[]> {
  const user = await getSession();
  if (!user) return [];
  await ensureSopsTable();
  const sql = db();
  const rows = await sql`
    SELECT id, user_id, title, summary, steps, created_at
    FROM sops
    WHERE user_id = ${user.id}
    ORDER BY created_at DESC
  `;
  return rows.map((row) => ({
    id: row.id as string,
    user_id: row.user_id as string,
    title: row.title as string,
    summary: row.summary as string | null,
    steps: Array.isArray(row.steps)
      ? (row.steps as string[])
      : row.steps
        ? (JSON.parse(row.steps as string) as string[])
        : [],
    created_at: row.created_at as string,
  }));
}

export async function createSop(input: { title: string; summary?: string | null; steps: string[] }): Promise<void> {
  const user = await getSession();
  if (!user) throw new Error('Not authenticated');
  await ensureSopsTable();
  const sql = db();
  await sql`
    INSERT INTO sops (user_id, title, summary, steps)
    VALUES (${user.id}, ${input.title}, ${input.summary || null}, ${JSON.stringify(input.steps)})
  `;
}
