import { supabase } from "@/integrations/supabase/client";

/*
  Anonymous (local) mode: a tiny browser storage stand-in for the cloud tables.
  It supports only the query shapes Daybreak uses: select, insert, update,
  delete, upsert, eq, limit, maybeSingle.
*/

export const LOCAL_FLAG = "daybreak-local-mode";
export const LOCAL_USER_ID = "00000000-0000-0000-0000-000000000000";
const KEY = (t: string) => `daybreak-local:${t}`;

type Row = Record<string, unknown>;

function load(t: string): Row[] {
  try { return JSON.parse(localStorage.getItem(KEY(t)) ?? "[]"); } catch { return []; }
}
function save(t: string, rows: Row[]) {
  localStorage.setItem(KEY(t), JSON.stringify(rows));
}
function stamp(r: Row): Row {
  const now = new Date().toISOString();
  return { id: crypto.randomUUID(), created_at: now, updated_at: now, ...r };
}

class Query {
  private filters: [string, unknown][] = [];
  private op: "select" | "insert" | "update" | "delete" | "upsert" = "select";
  private payload: Row | Row[] | null = null;
  private conflict: string[] = ["id"];
  private ignoreDup = false;
  private max: number | null = null;
  private single = false;
  constructor(private table: string) {}

  select() { return this; }
  insert(p: Row | Row[]) { this.op = "insert"; this.payload = p; return this; }
  update(p: Row) { this.op = "update"; this.payload = p; return this; }
  delete() { this.op = "delete"; return this; }
  upsert(p: Row | Row[], o?: { onConflict?: string; ignoreDuplicates?: boolean }) {
    this.op = "upsert"; this.payload = p;
    if (o?.onConflict) this.conflict = o.onConflict.split(",");
    this.ignoreDup = !!o?.ignoreDuplicates;
    return this;
  }
  eq(col: string, val: unknown) { this.filters.push([col, val]); return this; }
  limit(n: number) { this.max = n; return this; }
  maybeSingle() { this.single = true; return this; }
  order() { return this; }

  private match(r: Row) { return this.filters.every(([c, v]) => r[c] === v); }

  private run(): { data: unknown; error: null } {
    let rows = load(this.table);
    const list = (p: Row | Row[] | null) => (Array.isArray(p) ? p : p ? [p] : []);
    if (this.op === "insert") {
      const added = list(this.payload).map(stamp);
      save(this.table, [...rows, ...added]);
      return { data: added, error: null };
    }
    if (this.op === "upsert") {
      for (const p of list(this.payload)) {
        const i = rows.findIndex((r) => this.conflict.every((c) => r[c] === p[c]));
        if (i >= 0) { if (!this.ignoreDup) rows[i] = { ...rows[i], ...p, updated_at: new Date().toISOString() }; }
        else rows.push(stamp(p));
      }
      save(this.table, rows);
      return { data: null, error: null };
    }
    if (this.op === "update") {
      rows = rows.map((r) => (this.match(r) ? { ...r, ...(this.payload as Row), updated_at: new Date().toISOString() } : r));
      save(this.table, rows);
      return { data: null, error: null };
    }
    if (this.op === "delete") {
      save(this.table, rows.filter((r) => !this.match(r)));
      return { data: null, error: null };
    }
    let out = rows.filter((r) => this.match(r));
    if (this.max != null) out = out.slice(0, this.max);
    return { data: this.single ? out[0] ?? null : out, error: null };
  }

  then<T>(res: (v: { data: unknown; error: null }) => T, rej?: (e: unknown) => T) {
    try { return Promise.resolve(res(this.run())); } catch (e) { return rej ? Promise.resolve(rej(e)) : Promise.reject(e); }
  }
}

const localClient = { from: (t: string) => new Query(t) };

export function isLocalMode() {
  return typeof window !== "undefined" && localStorage.getItem(LOCAL_FLAG) === "1";
}

/** Returns the cloud client, or the browser storage stand-in in anonymous mode. */
export function db(): Pick<typeof supabase, "from"> {
  return isLocalMode() ? (localClient as unknown as Pick<typeof supabase, "from">) : supabase;
}
