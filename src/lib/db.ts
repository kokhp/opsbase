import { neon } from '@neondatabase/serverless';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SqlQuery = (strings: TemplateStringsArray, ...values: any[]) => Promise<Record<string, any>[]>;

type LocalUser = {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

type LocalSession = {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
};

type LocalSubscription = {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'pro' | 'business';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
};

type LocalUsage = {
  id: string;
  user_id: string;
  feature: string;
  count: number;
  period: string;
  created_at: string;
};

type LocalSop = {
  id: string;
  user_id: string;
  title: string;
  summary: string | null;
  steps: string[];
  created_at: string;
  updated_at: string;
};

type LocalData = {
  users: LocalUser[];
  sessions: LocalSession[];
  subscriptions: LocalSubscription[];
  usage: LocalUsage[];
  sops: LocalSop[];
};

const LOCAL_DB_PATH =
  process.env.LOCAL_DB_PATH || join(process.env.LOCAL_DB_DIR || '/tmp', 'saas-factory-local-db.json');

function readLocalData(): LocalData {
  if (!existsSync(LOCAL_DB_PATH)) {
    return { users: [], sessions: [], subscriptions: [], usage: [], sops: [] };
  }
  try {
    const raw = readFileSync(LOCAL_DB_PATH, 'utf-8');
    const parsed = JSON.parse(raw) as LocalData;
    return {
      users: parsed.users || [],
      sessions: parsed.sessions || [],
      subscriptions: parsed.subscriptions || [],
      usage: parsed.usage || [],
      sops: parsed.sops || [],
    };
  } catch {
    return { users: [], sessions: [], subscriptions: [], usage: [], sops: [] };
  }
}

function writeLocalData(data: LocalData): void {
  writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
}

function normalizeQuery(strings: TemplateStringsArray, values: unknown[]): string {
  const text = strings.reduce(
    (acc, part, idx) => acc + part + (idx < values.length ? `__val${idx}__` : ''),
    ''
  );
  return text.replace(/\s+/g, ' ').trim().toLowerCase();
}

function nowIso(): string {
  return new Date().toISOString();
}

async function localSql(strings: TemplateStringsArray, ...values: unknown[]): Promise<Record<string, any>[]> {
  const query = normalizeQuery(strings, values);

  if (query.startsWith('create table') || query.startsWith('create index') || query.startsWith('create extension')) {
    return [];
  }

  const data = readLocalData();

  if (query.startsWith('select id from users where email = __val0__')) {
    const email = String(values[0]);
    return data.users.filter((user) => user.email === email).map((user) => ({ id: user.id }));
  }

  if (query.startsWith('select id, email, name, avatar_url, password_hash, created_at from users where email = __val0__')) {
    const email = String(values[0]);
    return data.users
      .filter((user) => user.email === email)
      .map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        password_hash: user.password_hash,
        created_at: user.created_at,
      }));
  }

  if (query.startsWith('insert into users (id, email, password_hash, name) values (__val0__, __val1__, __val2__, __val3__)')) {
    const [id, email, passwordHash, name] = values.map((value) => String(value));
    const timestamp = nowIso();
    data.users.push({
      id,
      email,
      password_hash: passwordHash,
      name: name || null,
      avatar_url: null,
      created_at: timestamp,
      updated_at: timestamp,
    });
    writeLocalData(data);
    return [];
  }

  if (query.startsWith("insert into subscriptions (user_id, plan, status) values (__val0__, 'free', 'active')")) {
    const userId = String(values[0]);
    const timestamp = nowIso();
    data.subscriptions.push({
      id: crypto.randomUUID(),
      user_id: userId,
      stripe_customer_id: null,
      stripe_subscription_id: null,
      plan: 'free',
      status: 'active',
      current_period_end: null,
      created_at: timestamp,
      updated_at: timestamp,
    });
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('insert into sessions (user_id, token, expires_at) values (__val0__, __val1__, __val2__)')) {
    const [userId, token, expiresAt] = values.map((value) => String(value));
    data.sessions.push({
      id: crypto.randomUUID(),
      user_id: userId,
      token,
      expires_at: expiresAt,
      created_at: nowIso(),
    });
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('select u.id, u.email, u.name, u.avatar_url, u.created_at from sessions s join users u on s.user_id = u.id where s.token = __val0__ and s.expires_at > now()')) {
    const token = String(values[0]);
    const session = data.sessions.find((row) => row.token === token && row.expires_at > nowIso());
    if (!session) return [];
    const user = data.users.find((row) => row.id === session.user_id);
    if (!user) return [];
    return [
      {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      },
    ];
  }

  if (query.startsWith('delete from sessions where token = __val0__')) {
    const token = String(values[0]);
    data.sessions = data.sessions.filter((row) => row.token !== token);
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('create table if not exists sops')) {
    return [];
  }

  if (query.startsWith('select id, user_id, title, summary, steps, created_at from sops where user_id = __val0__ order by created_at desc')) {
    const userId = String(values[0]);
    return data.sops
      .filter((sop) => sop.user_id === userId)
      .sort((a, b) => (a.created_at > b.created_at ? -1 : 1))
      .map((sop) => ({
        id: sop.id,
        user_id: sop.user_id,
        title: sop.title,
        summary: sop.summary,
        steps: sop.steps,
        created_at: sop.created_at,
      }));
  }

  if (query.startsWith('insert into sops (user_id, title, summary, steps) values (__val0__, __val1__, __val2__, __val3__)')) {
    const [userId, title, summary, stepsRaw] = values;
    const steps = typeof stepsRaw === 'string' ? (JSON.parse(stepsRaw) as string[]) : (stepsRaw as string[]);
    const timestamp = nowIso();
    data.sops.push({
      id: crypto.randomUUID(),
      user_id: String(userId),
      title: String(title),
      summary: summary ? String(summary) : null,
      steps,
      created_at: timestamp,
      updated_at: timestamp,
    });
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('select name, avatar_url from users where id = __val0__')) {
    const userId = String(values[0]);
    return data.users
      .filter((user) => user.id === userId)
      .map((user) => ({ name: user.name, avatar_url: user.avatar_url }));
  }

  if (query.startsWith('update users set name = __val0__ where id = __val1__')) {
    const name = String(values[0]);
    const userId = String(values[1]);
    data.users = data.users.map((user) =>
      user.id === userId ? { ...user, name, updated_at: nowIso() } : user
    );
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('select id, email, name, avatar_url, created_at from users where id = __val0__')) {
    const userId = String(values[0]);
    return data.users
      .filter((user) => user.id === userId)
      .map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        avatar_url: user.avatar_url,
        created_at: user.created_at,
      }));
  }

  if (query.startsWith('select plan, status, current_period_end from subscriptions where user_id = __val0__')) {
    const userId = String(values[0]);
    return data.subscriptions
      .filter((sub) => sub.user_id === userId)
      .map((sub) => ({
        plan: sub.plan,
        status: sub.status,
        current_period_end: sub.current_period_end,
      }));
  }

  if (query.startsWith('select feature, count, period from usage where user_id = __val0__')) {
    const userId = String(values[0]);
    return data.usage
      .filter((row) => row.user_id === userId)
      .map((row) => ({ feature: row.feature, count: row.count, period: row.period }));
  }

  if (query.startsWith('delete from users where id = __val0__')) {
    const userId = String(values[0]);
    data.users = data.users.filter((user) => user.id !== userId);
    data.sessions = data.sessions.filter((row) => row.user_id !== userId);
    data.subscriptions = data.subscriptions.filter((row) => row.user_id !== userId);
    data.usage = data.usage.filter((row) => row.user_id !== userId);
    data.sops = data.sops.filter((row) => row.user_id !== userId);
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('select stripe_customer_id from subscriptions where user_id = __val0__')) {
    const userId = String(values[0]);
    return data.subscriptions
      .filter((sub) => sub.user_id === userId)
      .map((sub) => ({ stripe_customer_id: sub.stripe_customer_id }));
  }

  if (query.startsWith('select stripe_subscription_id from subscriptions where user_id = __val0__')) {
    const userId = String(values[0]);
    return data.subscriptions
      .filter((sub) => sub.user_id === userId)
      .map((sub) => ({ stripe_subscription_id: sub.stripe_subscription_id }));
  }

  if (query.startsWith('update subscriptions set stripe_customer_id = __val0__, stripe_subscription_id = __val1__, plan = __val2__, status =')) {
    const [stripeCustomerId, stripeSubscriptionId, plan, _status, userId] = values;
    data.subscriptions = data.subscriptions.map((sub) =>
      sub.user_id === String(userId)
        ? {
            ...sub,
            stripe_customer_id: String(stripeCustomerId),
            stripe_subscription_id: String(stripeSubscriptionId),
            plan: String(plan) as LocalSubscription['plan'],
            status: 'active',
            updated_at: nowIso(),
          }
        : sub
    );
    writeLocalData(data);
    return [];
  }

  if (query.startsWith('update subscriptions set status = __val0__, current_period_end = __val1__ where stripe_subscription_id = __val2__')) {
    const [status, currentPeriodEnd, stripeSubscriptionId] = values;
    data.subscriptions = data.subscriptions.map((sub) =>
      sub.stripe_subscription_id === String(stripeSubscriptionId)
        ? {
            ...sub,
            status: String(status) as LocalSubscription['status'],
            current_period_end: String(currentPeriodEnd),
            updated_at: nowIso(),
          }
        : sub
    );
    writeLocalData(data);
    return [];
  }

  if (query.startsWith("update subscriptions set status = 'canceled', plan = 'free' where stripe_subscription_id = __val0__")) {
    const stripeSubscriptionId = String(values[0]);
    data.subscriptions = data.subscriptions.map((sub) =>
      sub.stripe_subscription_id === stripeSubscriptionId
        ? {
            ...sub,
            status: 'canceled',
            plan: 'free',
            updated_at: nowIso(),
          }
        : sub
    );
    writeLocalData(data);
    return [];
  }

  throw new Error(`Local DB does not support query: ${query}`);
}

let _sql: SqlQuery | null = null;

export function db(): SqlQuery {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (url) {
      _sql = neon(url) as SqlQuery;
    } else {
      _sql = localSql;
    }
  }
  return _sql;
}

// For cases where you need a fresh connection (e.g., different database)
export function createDb(url: string): SqlQuery {
  return neon(url) as SqlQuery;
}
