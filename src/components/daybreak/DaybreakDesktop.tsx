import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  CloudSun,
  Disc3,
  ExternalLink,
  LogOut,
  MonitorCog,
  Music2,
  NotebookPen,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Square,
  Trash2,
  UserRound,
  Volume2,
  VolumeX,
  X,
  FastForward,
  Rewind,
  Shuffle,
  Repeat,
} from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type AppId = "focus" | "timer" | "notes" | "reading" | "budget" | "archive" | "display" | "account" | "trash";
type Wallpaper = "pastel-cyber" | "retro-grid" | "vintage-lavender" | "pixel-clouds";
type Task = Tables<"tasks">;
type Book = Tables<"reading_queue">;
type Expense = Tables<"expenses">;
type Category = Tables<"budget_categories">;

const APP_META: Record<AppId, { label: string; icon: typeof CloudSun; iconClass: string }> = {
  focus:   { label: "Daily 3",      icon: Check,            iconClass: "icon-focus" },
  timer:   { label: "Focus Player", icon: Music2,           iconClass: "icon-timer" },
  notes:   { label: "Scratch Note", icon: NotebookPen,      iconClass: "icon-notes" },
  reading: { label: "Reading Shelf",icon: BookOpen,         iconClass: "icon-reading" },
  budget:  { label: "Budget Ledger",icon: CircleDollarSign, iconClass: "icon-budget" },
  archive: { label: "Logbook",      icon: CalendarDays,     iconClass: "icon-archive" },
  display: { label: "Display",      icon: MonitorCog,       iconClass: "icon-display" },
  account: { label: "Account",      icon: UserRound,        iconClass: "icon-account" },
  trash:   { label: "Recycle Bin",  icon: Trash2,           iconClass: "icon-trash" },
};

// Default layout of desktop icons (arranged neatly on the left in 2 columns like reference image)
const ICON_DEFAULTS: Record<AppId, { x: number; y: number }> = {
  focus:   { x: 24,  y: 60 },
  timer:   { x: 24,  y: 170 },
  notes:   { x: 24,  y: 280 },
  reading: { x: 24,  y: 390 },
  budget:  { x: 24,  y: 500 },
  archive: { x: 130, y: 60 },
  display: { x: 130, y: 170 },
  account: { x: 130, y: 280 },
  trash:   { x: 130, y: 390 },
};

const today = () => new Date().toLocaleDateString("en-CA");
const monthStart = () => `${today().slice(0, 7)}-01`;
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function RetroButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} className={`retro-button ${props.className ?? ""}`} />;
}

/* ============================================================
   LOGIN WINDOW (Vintage Y2K OS Sign In)
   ============================================================ */
function LoginWindow() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("Welcome. Please identify yourself.");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      setStatus(error ? error.message : "Password reset mail sent. Check your inbox.");
      setBusy(false);
      return;
    }
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { display_name: displayName || "Daybreaker" } },
      });
      setStatus(error ? error.message : data.session ? "Account ready." : "Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setStatus(error ? error.message : "Opening your desktop...");
    }
    setBusy(false);
  }

  async function google() {
    setBusy(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) setStatus(result.error.message);
    setBusy(false);
  }

  return (
    <main className="boot-screen wallpaper-pastel-cyber">
      <div className="login-brand">
        <CloudSun />
        <span>daybreak</span>
        <small>PERSONAL OS</small>
      </div>
      <section className="os-window login-window" aria-label="Daybreak account">
        <div className="titlebar">
          <span className="titlebar-title"><UserRound size={18} /> Daybreak Account</span>
          <span className="window-glyph">?</span>
        </div>
        <div className="login-body">
          <div className="login-art" aria-hidden>
            <span>☀</span>
            <strong>GOOD<br />MORNING</strong>
          </div>
          <form onSubmit={submit}>
            <h1>{mode === "signin" ? "Sign in to Daybreak" : mode === "signup" ? "Create your account" : "Reset password"}</h1>
            <p className="status-line">{status}</p>
            {mode === "signup" && (
              <label>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} /></label>
            )}
            <label>Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            {mode !== "forgot" && (
              <label>Password<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            )}
            <div className="login-actions">
              <RetroButton disabled={busy} type="submit">{busy ? "Please wait..." : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}</RetroButton>
              {mode !== "forgot" && <RetroButton type="button" onClick={google}>G <span>Continue with Google</span></RetroButton>}
            </div>
            <div className="mode-links">
              <button type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "I already have an account" : "Create new account"}</button>
              <button type="button" onClick={() => setMode(mode === "forgot" ? "signin" : "forgot")}>{mode === "forgot" ? "Back to sign in" : "Forgot password?"}</button>
            </div>
          </form>
        </div>
        <div className="window-status">Secure connection to Daybreak Cloud</div>
      </section>
    </main>
  );
}

/* ============================================================
   DRAGGABLE DESKTOP ICON
   ============================================================ */
function DesktopIcon({
  id, selected, position, onSelect, onOpen, onMove,
}: {
  id: AppId; selected: boolean; position: { x: number; y: number };
  onSelect: () => void; onOpen: () => void; onMove: (x: number, y: number) => void;
}) {
  const meta = APP_META[id];
  const Icon = meta.icon;
  const dragRef = useRef<{ startX: number; startY: number; startPX: number; startPY: number; moved: boolean } | null>(null);

  function handlePointerDown(e: React.PointerEvent) {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPX: position.x, startPY: position.y, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      onMove(Math.max(0, dragRef.current.startPX + dx), Math.max(0, dragRef.current.startPY + dy));
    }
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <button
      className={`desktop-icon ${selected ? "selected" : ""}`}
      style={{ left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={onSelect}
      onDoubleClick={onOpen}
      aria-label={`${meta.label}, double click to open`}
    >
      <span className={`pixel-icon ${meta.iconClass}`}>
        <Icon />
      </span>
      <span>{meta.label}</span>
    </button>
  );
}

/* ============================================================
   OS WINDOW COMPONENT
   ============================================================ */
function OSWindow({
  id, active, minimized, maximized, onFocus, onClose, onMinimize, onMaximize, children,
}: {
  id: AppId; active: boolean; minimized: boolean; maximized: boolean;
  onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState(() => {
    const offsets: Record<AppId, { x: number; y: number }> = {
      focus:   { x: 260, y: 70 },
      timer:   { x: 680, y: 70 },
      notes:   { x: 300, y: 110 },
      reading: { x: 280, y: 90 },
      budget:  { x: 270, y: 80 },
      archive: { x: 290, y: 95 },
      display: { x: 340, y: 120 },
      account: { x: 320, y: 100 },
      trash:   { x: 350, y: 130 },
    };
    return offsets[id] ?? { x: 280, y: 90 };
  });

  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  if (minimized) return null;

  return (
    <section
      className={`app-window window-${id} ${active ? "active" : ""} ${maximized ? "maximized" : ""}`}
      style={maximized ? undefined : { transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseDown={onFocus}
    >
      <div
        className="titlebar"
        onPointerDown={(e) => {
          if (maximized) return;
          if ((e.target as HTMLElement).closest(".window-controls")) return;
          drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!drag.current) return;
          setPos({
            x: Math.max(0, drag.current.px + e.clientX - drag.current.x),
            y: Math.max(0, drag.current.py + e.clientY - drag.current.y),
          });
        }}
        onPointerUp={() => { drag.current = null; }}
      >
        <span className="titlebar-title">
          {(() => { const I = APP_META[id].icon; return <I size={18} />; })()}
          {APP_META[id].label}
        </span>
        <div className="window-controls">
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            aria-label="Minimize"
            title="Minimize"
          >_</button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            aria-label="Maximize"
            title="Maximize"
          >□</button>
          <button
            className="close-btn"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            aria-label="Close"
            title="Close"
          >×</button>
        </div>
      </div>
      <div className="window-body">
        {children}
      </div>
    </section>
  );
}

/* ============================================================
   DAILY 3 FOCUS APP
   ============================================================ */
function FocusApp({ tasks, userId, refresh, chime }: { tasks: Task[]; userId: string; refresh: () => void; chime: () => void }) {
  const [title, setTitle] = useState("");
  const todays = tasks.filter((t) => t.task_date === today()).sort((a,b) => a.priority - b.priority);
  const recommended = todays.filter((t) => t.is_recommended).slice(0,3);
  const allDone = recommended.length === 3 && recommended.every((t) => t.completed_at);
  const celebrated = useRef(false);
  const [victoryDismissed, setVictoryDismissed] = useState(false);

  useEffect(() => {
    if (allDone && !celebrated.current) {
      celebrated.current = true;
      chime();
      setVictoryDismissed(false);
    }
  }, [allDone, chime]);

  async function addTask() {
    if (!title.trim()) return;
    await supabase.from("tasks").insert({
      user_id: userId,
      title: title.trim(),
      task_date: today(),
      priority: todays.length + 1,
      is_recommended: recommended.length < 3,
    });
    setTitle("");
    refresh();
  }

  async function toggle(task: Task) {
    await supabase.from("tasks").update({ completed_at: task.completed_at ? null : new Date().toISOString(), is_active: false }).eq("id", task.id);
    refresh();
  }

  async function activate(task: Task) {
    await supabase.from("tasks").update({ is_active: false }).eq("user_id", userId).eq("task_date", today());
    await supabase.from("tasks").update({ is_active: true }).eq("id", task.id);
    refresh();
  }

  async function remove(task: Task) {
    await supabase.from("tasks").delete().eq("id", task.id);
    refresh();
  }

  return (
    <div className="focus-content">
      <div className="focus-header">
        <div>
          <span className="eyebrow">TODAY'S PRIORITY LOCK</span>
          <h2>Daily 3 Focus</h2>
        </div>
        <div className="three-meter">
          {recommended.filter((t) => t.completed_at).length}<span>/3</span>
        </div>
      </div>

      <div className="task-list">
        {todays.map((task, i) => (
          <div className={`task-row ${task.is_active ? "active-task" : ""}`} key={task.id}>
            <button className="pixel-check" onClick={() => toggle(task)} aria-label={`Complete ${task.title}`}>
              {task.completed_at && <Check size={18} />}
            </button>
            <span className={task.completed_at ? "done" : ""}>
              {task.is_recommended && <b>0{i+1}</b>}
              {task.title}
            </span>
            {!task.completed_at && (
              <RetroButton size="sm" onClick={() => activate(task)} disabled={task.is_active}>
                {task.is_active ? "ACTIVE" : "FOCUS"}
              </RetroButton>
            )}
            <button className="bare-icon" onClick={() => remove(task)} aria-label={`Delete ${task.title}`}>
              <X size={18} />
            </button>
          </div>
        ))}
      </div>

      <form className="inline-add" onSubmit={(e) => { e.preventDefault(); void addTask(); }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={recommended.length < 3 ? "Add a daily priority..." : "Add an extra task..."}
          maxLength={240}
        />
        <RetroButton type="submit" size="icon"><Plus size={18} /></RetroButton>
      </form>

      {allDone && !victoryDismissed && (
        <div className="victory-dialog">
          <div className="confetti">✦ ▪ ✧ ▪ ✦</div>
          <strong>MISSION COMPLETE!</strong>
          <span>Your Daily 3 are completed today.</span>
          <RetroButton onClick={() => setVictoryDismissed(true)}>OK</RetroButton>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   WINAMP TIMER APP (Authentic Player Skin from Reference)
   ============================================================ */
function TimerApp() {
  const [mode, setMode] = useState<"up" | "25" | "50">("25");
  const [running, setRunning] = useState(false);
  const [seconds, setSeconds] = useState(1500);

  const reset = useCallback((next = mode) => {
    setRunning(false);
    setSeconds(next === "up" ? 0 : Number(next) * 60);
  }, [mode]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setSeconds((s) => (mode === "up" ? s + 1 : Math.max(0, s - 1)));
    }, 1000);
    return () => clearInterval(id);
  }, [running, mode]);

  const mm = Math.floor(seconds / 60).toString().padStart(2, "0");
  const ss = (seconds % 60).toString().padStart(2, "0");

  return (
    <div className="winamp-skin">
      {/* Top Display Screen */}
      <div className="winamp-top-screen">
        <div className="winamp-time-display">
          <span className="winamp-play-indicator">{running ? "▶" : "❚❚"}</span>
          <span>{mm}:{ss}</span>
        </div>
        <div className="winamp-track-info">
          <div className="winamp-track-title">
            {mode === "up" ? "1. STOPWATCH (FREE)" : mode === "25" ? "1. POMODORO BLOCK (25:00)" : "1. DEEP FOCUS BLOCK (50:00)"}
          </div>
          <div className="winamp-badges">
            <span className="winamp-badge active">192 kbps</span>
            <span className="winamp-badge active">44 kHz</span>
            <span className="winamp-badge">mono</span>
            <span className="winamp-badge active">stereo</span>
          </div>
        </div>
      </div>

      {/* Dancing Spectrum Analyzer */}
      <div className="winamp-spectrum">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((n) => (
          <div key={n} className="winamp-spectrum-bar" style={{ animationPlayState: running ? "running" : "paused" }} />
        ))}
      </div>

      {/* Mode Switches */}
      <div className="winamp-modes">
        {(["up", "25", "50"] as const).map((m) => (
          <button
            key={m}
            className={`winamp-mode-btn ${mode === m ? "active" : ""}`}
            onClick={() => { setMode(m); reset(m); }}
          >
            {m === "up" ? "STOPWATCH" : `${m} MIN`}
          </button>
        ))}
      </div>

      {/* Tactile Player Buttons (Exact styling from reference image!) */}
      <div className="winamp-controls-row">
        <div className="winamp-btn-group">
          <button className="winamp-btn" onClick={() => reset()} title="Rewind / Restart"><Rewind size={16} /></button>
          <button className="winamp-btn" onClick={() => setRunning(true)} title="Play"><Play size={16} /></button>
          <button className="winamp-btn" onClick={() => setRunning(false)} title="Pause"><Pause size={16} /></button>
          <button className="winamp-btn" onClick={() => { setRunning(false); reset(); }} title="Stop"><Square size={14} /></button>
          <button className="winamp-btn" onClick={() => reset()} title="Fast Forward"><FastForward size={16} /></button>
        </div>
        <button className="winamp-toggle-btn" onClick={() => reset()} title="Reset">
          <RotateCcw size={16} /> RESET
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   NOTEPAD APP
   ============================================================ */
function NotesApp({ userId, initial, refresh }: { userId: string; initial: string; refresh: () => void }) {
  const [text, setText] = useState(initial);
  const [saved, setSaved] = useState("Ready");

  useEffect(() => setText(initial), [initial]);

  async function save() {
    setSaved("Saving...");
    await supabase.from("notes").upsert({ user_id: userId, note_date: today(), content: text }, { onConflict: "user_id,note_date" });
    setSaved("Saved");
    refresh();
  }

  async function sticky() {
    if (!text.trim()) return;
    await supabase.from("stickies").insert({ user_id: userId, content: text.slice(0, 300), color: "yellow", position_x: 480, position_y: 120 });
    refresh();
  }

  return (
    <div className="notepad-container">
      <div className="notepad-menubar">
        <span>File</span>
        <span>Edit</span>
        <span>Format</span>
        <span>Help</span>
      </div>
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        placeholder="Type something before it floats away..."
      />
      <div className="notepad-statusbar">
        <span>{text.length} characters</span>
        <span>{saved}</span>
        <RetroButton size="sm" onClick={sticky}>Tear off sticky note</RetroButton>
      </div>
    </div>
  );
}

/* ============================================================
   READING QUEUE APP (Wooden Bookshelf)
   ============================================================ */
function ReadingApp({ books, userId, refresh }: { books: Book[]; userId: string; refresh: () => void }) {
  const [selected, setSelected] = useState<Book | null>(null);

  async function add(slot: number) {
    const title = window.prompt("Book title");
    if (!title) return;
    const url = window.prompt("Link to the book or article", "https://");
    if (!url) return;
    const color = window.prompt("Spine color: rose, teal, violet, amber", "rose") || "rose";
    await supabase.from("reading_queue").insert({ user_id: userId, title, url, slot, spine_color: color });
    refresh();
  }

  async function progress(book: Book, value: number) {
    await supabase.from("reading_queue").update({ progress: value }).eq("id", book.id);
    refresh();
    setSelected({ ...book, progress: value });
  }

  return (
    <div className="reading-container">
      <div className="focus-header">
        <div>
          <span className="eyebrow">FIVE BOOK QUEUE</span>
          <h2>Reading Shelf</h2>
        </div>
        <div className="three-meter">{books.length}<span>/5</span></div>
      </div>

      <div className="wood-shelf">
        {[1, 2, 3, 4, 5].map((slot) => {
          const b = books.find((x) => x.slot === slot);
          return b ? (
            <button key={slot} className={`book-spine spine-${b.spine_color}`} onClick={() => setSelected(b)}>
              <span>{b.title}</span>
              <small>{b.progress}%</small>
            </button>
          ) : (
            <button key={slot} className="empty-book-slot" onClick={() => add(slot)}>
              + EMPTY
            </button>
          );
        })}
      </div>

      {selected && (
        <div className="book-detail-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <strong>{selected.title}</strong>
            <span>Reading progress: {selected.progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={selected.progress}
            onChange={(e) => progress(selected, Number(e.target.value))}
          />
          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <RetroButton onClick={() => window.open(selected.url, "_blank", "noopener,noreferrer")}>
              <ExternalLink size={16} /> Open Link
            </RetroButton>
            <RetroButton onClick={async () => { await supabase.from("reading_queue").delete().eq("id", selected.id); setSelected(null); refresh(); }}>
              Remove
            </RetroButton>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   BUDGET LEDGER APP (Dual-Pane)
   ============================================================ */
function BudgetApp({
  userId, settings, categories, expenses, refresh,
}: {
  userId: string; settings: Tables<"budget_settings"> | null; categories: Category[]; expenses: Expense[]; refresh: () => void;
}) {
  const [income, setIncome] = useState(String(settings?.income ?? 0));
  const [fixed, setFixed] = useState(String(settings?.fixed_costs ?? 0));
  const [goal, setGoal] = useState(String(settings?.saving_goal ?? 0));
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");

  useEffect(() => {
    setIncome(String(settings?.income ?? 0));
    setFixed(String(settings?.fixed_costs ?? 0));
    setGoal(String(settings?.saving_goal ?? 0));
  }, [settings]);

  const spent = expenses.reduce((n, e) => n + Number(e.amount), 0);
  const now = new Date();
  const days = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate() - now.getDate() + 1;
  const surplus = Number(income) - Number(fixed) - Number(goal);
  const allowance = (surplus - spent) / Math.max(days, 1);

  async function save() {
    await supabase.from("budget_settings").upsert({
      user_id: userId,
      month: monthStart(),
      income: Number(income) || 0,
      fixed_costs: Number(fixed) || 0,
      saving_goal: Number(goal) || 0,
    }, { onConflict: "user_id,month" });
    refresh();
  }

  async function addExpense() {
    if (!(Number(amount) > 0)) return;
    await supabase.from("expenses").insert({
      user_id: userId,
      amount: Number(amount),
      description: desc,
      spent_on: today(),
      category_id: categories[0]?.id ?? null,
    });
    setAmount("");
    setDesc("");
    refresh();
  }

  return (
    <div className="ledger-container">
      {/* Top Pane: Daily Burn Allowance */}
      <div className="allowance-box">
        <div>
          <span style={{ fontSize: "18px", letterSpacing: "1px" }}>DAILY BURN ALLOWANCE</span>
          <strong>{money(allowance)}</strong>
        </div>
        <div className="allowance-box-info">
          <span>SURPLUS REMAINING</span>
          <small>{money(Math.max(surplus - spent, 0))} across {days} days</small>
        </div>
      </div>

      {/* Ledger Settings Inputs */}
      <div className="ledger-settings-grid">
        <label>Monthly Income<input type="number" value={income} onChange={(e) => setIncome(e.target.value)} onBlur={save} /></label>
        <label>Fixed Costs<input type="number" value={fixed} onChange={(e) => setFixed(e.target.value)} onBlur={save} /></label>
        <label>Saving Goal<input type="number" value={goal} onChange={(e) => setGoal(e.target.value)} onBlur={save} /></label>
      </div>

      {/* Bottom Pane: Spending Envelopes */}
      <div className="envelope-list">
        {categories.map((c) => {
          const used = expenses.filter((e) => e.category_id === c.id).reduce((n, e) => n + Number(e.amount), 0);
          return (
            <div className="envelope-item" key={c.id}>
              <span>{c.icon} {c.name}</span>
              <b>{money(used)} / {money(Number(c.monthly_limit))}</b>
              <div className="envelope-bar-track">
                <div className="envelope-bar-fill" style={{ width: `${Math.min(100, used / Math.max(Number(c.monthly_limit), 1) * 100)}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Expense Form */}
      <form className="inline-add" onSubmit={(e) => { e.preventDefault(); void addExpense(); }}>
        <input placeholder="What did you buy?" value={desc} onChange={(e) => setDesc(e.target.value)} />
        <input aria-label="Amount" type="number" step="0.01" placeholder="0.00" style={{ width: "120px" }} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <RetroButton type="submit">Log Spend</RetroButton>
      </form>
    </div>
  );
}

/* ============================================================
   ARCHIVE / LOGBOOK APP
   ============================================================ */
function ArchiveApp({ tasks, expenses, notes }: { tasks: Task[]; expenses: Expense[]; notes: Tables<"notes">[] }) {
  const [date, setDate] = useState(today());
  const dayTasks = tasks.filter((t) => t.task_date === date && t.completed_at);
  const daySpend = expenses.filter((e) => e.spent_on === date).reduce((n, e) => n + Number(e.amount), 0);
  const note = notes.find((n) => n.note_date === date)?.content;

  function download() {
    const dates = [...new Set([...tasks.map((t) => t.task_date), ...expenses.map((e) => e.spent_on), ...notes.map((n) => n.note_date)])].sort();
    const text = dates.map((d) => {
      const ts = tasks.filter((t) => t.task_date === d && t.completed_at).map((t) => `[x] ${t.title}`).join("\n") || "No completed tasks";
      const ns = notes.find((n) => n.note_date === d)?.content || "No notes";
      const sp = expenses.filter((e) => e.spent_on === d).reduce((n, e) => n + Number(e.amount), 0);
      return `DAYBREAK LOGBOOK: ${d}\n\n${ts}\n\nFOCUS TIME: ${Math.round(tasks.filter((t) => t.task_date === d).reduce((n, t) => n + t.focus_seconds, 0) / 60)} min\nSPEND LOG: ${money(sp)}\n\nNOTES:\n${ns}`;
    }).join("\n\n========================================\n\n");

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "daybreak-logbook.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="archive-container">
      <div className="archive-toolbar">
        <input type="date" max={today()} value={date} onChange={(e) => setDate(e.target.value)} />
        <RetroButton onClick={download}><Disc3 size={18} /> Export Floppy</RetroButton>
      </div>
      <div className="archive-paper">
        <h3>{new Date(`${date}T12:00:00`).toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</h3>
        <p><b>Completed Tasks:</b></p>
        {dayTasks.length ? dayTasks.map((t) => <p key={t.id}>☑ {t.title}</p>) : <p style={{ color: "var(--muted-ink)" }}>No completed tasks recorded.</p>}
        <p><b>Total Focus Time:</b> {Math.round(dayTasks.reduce((n, t) => n + t.focus_seconds, 0) / 60)} minutes</p>
        <p><b>Total Daily Spend:</b> {money(daySpend)}</p>
        <p><b>Notes:</b></p>
        <pre>{note || "No scratch notes recorded for this date."}</pre>
      </div>
    </div>
  );
}

/* ============================================================
   DISPLAY PROPERTIES APP
   ============================================================ */
function DisplayApp({ wallpaper, setWallpaper }: { wallpaper: Wallpaper; setWallpaper: (w: Wallpaper) => void }) {
  const options: [Wallpaper, string][] = [
    ["pastel-cyber", "Pastel Cyber"],
    ["retro-grid", "Retro Tech Grid"],
    ["vintage-lavender", "Vintage Lavender"],
    ["pixel-clouds", "Pixel Clouds"],
  ];

  return (
    <div className="display-properties-body">
      <div className={`monitor-frame wallpaper-${wallpaper}`}>
        <span>daybreak</span>
      </div>
      <fieldset className="wallpaper-fieldset">
        <legend>Desktop Wallpaper</legend>
        {options.map(([id, label]) => (
          <label key={id}>
            <input type="radio" checked={wallpaper === id} onChange={() => setWallpaper(id)} />
            <span className={`swatch wallpaper-${id}`} />
            {label}
          </label>
        ))}
      </fieldset>
    </div>
  );
}

/* ============================================================
   ACCOUNT APP
   ============================================================ */
function AccountApp({
  session, displayName, setDisplayName, onSignOut,
}: {
  session: Session; displayName: string; setDisplayName: (s: string) => void; onSignOut: () => void;
}) {
  return (
    <div className="account-body">
      <div className="account-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span className="eyebrow">SIGNED IN AS</span>
        <h2 style={{ margin: 0, fontSize: "28px" }}>{displayName}</h2>
        <p style={{ margin: 0, color: "var(--muted-ink)" }}>{session.user.email}</p>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "20px" }}>
          Display Name
          <input
            value={displayName}
            maxLength={60}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => supabase.from("profiles").update({ display_name: displayName }).eq("user_id", session.user.id)}
          />
        </label>
        <RetroButton onClick={onSignOut}><LogOut size={18} /> Sign Out</RetroButton>
      </div>
    </div>
  );
}

/* ============================================================
   MAIN DAYBREAK OS COMPONENT
   ============================================================ */
function DaybreakOS({ session }: { session: Session }) {
  const [open, setOpen] = useState<AppId[]>(["focus", "timer"]);
  const [active, setActive] = useState<AppId>("focus");
  const [minimized, setMinimized] = useState<AppId[]>([]);
  const [maximized, setMaximized] = useState<AppId[]>([]);
  const [selected, setSelected] = useState<AppId | null>(null);
  const [start, setStart] = useState(false);
  const [search, setSearch] = useState("");
  const [wallpaper, setWallpaperState] = useState<Wallpaper>("pastel-cyber");
  const [muted, setMuted] = useState(false);
  const [displayName, setDisplayName] = useState(String(session.user.user_metadata?.["display_name"] ?? "Daybreaker"));
  const [tasks, setTasks] = useState<Task[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [notes, setNotes] = useState<Tables<"notes">[]>([]);
  const [stickies, setStickies] = useState<Tables<"stickies">[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<Tables<"budget_settings"> | null>(null);
  const [balloon, setBalloon] = useState("Double-click an icon to begin.");

  // Draggable icons position state
  const [iconPositions, setIconPositions] = useState<Record<AppId, { x: number; y: number }>>(() => ({ ...ICON_DEFAULTS }));

  const refresh = useCallback(async () => {
    const uid = session.user.id;
    const [t, b, n, s, e, c, bs, p] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", uid),
      supabase.from("reading_queue").select("*").eq("user_id", uid),
      supabase.from("notes").select("*").eq("user_id", uid),
      supabase.from("stickies").select("*").eq("user_id", uid),
      supabase.from("expenses").select("*").eq("user_id", uid),
      supabase.from("budget_categories").select("*").eq("user_id", uid),
      supabase.from("budget_settings").select("*").eq("user_id", uid).eq("month", monthStart()).maybeSingle(),
      supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
    ]);
    setTasks(t.data ?? []);
    setBooks(b.data ?? []);
    setNotes(n.data ?? []);
    setStickies(s.data ?? []);
    setExpenses(e.data ?? []);
    setCategories(c.data ?? []);
    setSettings(bs.data ?? null);
    if (p.data) {
      setWallpaperState(p.data.wallpaper as Wallpaper);
      setMuted(p.data.sound_muted);
      setDisplayName(p.data.display_name);
    }
  }, [session.user.id]);

  useEffect(() => {
    async function init() {
      await supabase.from("profiles").upsert({ user_id: session.user.id, display_name: displayName }, { onConflict: "user_id", ignoreDuplicates: true });
      const { data } = await supabase.from("budget_categories").select("id").eq("user_id", session.user.id).limit(1);
      if (!data?.length) {
        await supabase.from("budget_categories").insert([
          { user_id: session.user.id, name: "Essentials", icon: "▣", monthly_limit: 800 },
          { user_id: session.user.id, name: "Food", icon: "◆", monthly_limit: 350 },
          { user_id: session.user.id, name: "Fun", icon: "★", monthly_limit: 180 },
        ]);
      }
      await refresh();
    }
    void init();
  }, [session.user.id]);

  const sound = useCallback((kind = "click") => {
    if (muted) return;
    const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = kind === "victory" ? "square" : "triangle";
    osc.frequency.value = kind === "victory" ? 880 : kind === "trash" ? 90 : 260;
    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  }, [muted]);

  function launch(id: AppId) {
    sound();
    setOpen((v) => (v.includes(id) ? v : [...v, id]));
    setMinimized((v) => v.filter((x) => x !== id));
    setActive(id);
    setStart(false);
  }

  async function setWallpaper(w: Wallpaper) {
    setWallpaperState(w);
    await supabase.from("profiles").update({ wallpaper: w }).eq("user_id", session.user.id);
    setBalloon(`Display: ${w.replaceAll("-", " ")} applied.`);
  }

  async function toggleMute() {
    const next = !muted;
    setMuted(next);
    await supabase.from("profiles").update({ sound_muted: next }).eq("user_id", session.user.id);
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  function closeApp(id: AppId) {
    sound();
    setOpen((v) => v.filter((x) => x !== id));
    setMinimized((v) => v.filter((x) => x !== id));
    setMaximized((v) => v.filter((x) => x !== id));
  }

  const filtered = (Object.keys(APP_META) as AppId[]).filter((id) => APP_META[id].label.toLowerCase().includes(search.toLowerCase()));

  const content = (id: AppId) => {
    if (id === "focus") return <FocusApp tasks={tasks} userId={session.user.id} refresh={refresh} chime={() => sound("victory")} />;
    if (id === "timer") return <TimerApp />;
    if (id === "notes") return <NotesApp userId={session.user.id} initial={notes.find((n) => n.note_date === today())?.content ?? ""} refresh={refresh} />;
    if (id === "reading") return <ReadingApp books={books} userId={session.user.id} refresh={refresh} />;
    if (id === "budget") return <BudgetApp userId={session.user.id} settings={settings} categories={categories} expenses={expenses} refresh={refresh} />;
    if (id === "archive") return <ArchiveApp tasks={tasks} expenses={expenses} notes={notes} />;
    if (id === "display") return <DisplayApp wallpaper={wallpaper} setWallpaper={setWallpaper} />;
    if (id === "account") return <AccountApp session={session} displayName={displayName} setDisplayName={setDisplayName} onSignOut={signOut} />;
    return (
      <div style={{ textAlign: "center", padding: "24px" }}>
        <Trash2 size={56} style={{ margin: "0 auto 12px", color: "var(--muted-ink)" }} />
        <h3 style={{ fontSize: "28px", margin: "0 0 8px" }}>Recycle Bin</h3>
        <p style={{ fontSize: "20px" }}>{balloon.includes("deleted") ? "1 crumpled item in bin" : "The bin is empty."}</p>
        <RetroButton onClick={() => { sound("trash"); setBalloon("Recycle Bin emptied with a crunch."); }}>Empty Bin</RetroButton>
      </div>
    );
  };

  const [clockTime, setClockTime] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setClockTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <main className={`desktop wallpaper-${wallpaper}`} onClick={() => { setSelected(null); setStart(false); }}>
      {/* Top Navigation Bar (from the reference fashion OS design!) */}
      <header className="top-navbar" onClick={(e) => e.stopPropagation()}>
        <div className="top-navbar-left">
          <div className="top-brand">
            <CloudSun size={22} />
            <span>daybreak</span>
          </div>
          <nav className="top-nav-links">
            <button className={`top-nav-btn ${active === "focus" && open.includes("focus") ? "active" : ""}`} onClick={() => launch("focus")}>Daily 3</button>
            <button className={`top-nav-btn ${active === "timer" && open.includes("timer") ? "active" : ""}`} onClick={() => launch("timer")}>Timer</button>
            <button className={`top-nav-btn ${active === "notes" && open.includes("notes") ? "active" : ""}`} onClick={() => launch("notes")}>Notepad</button>
            <button className={`top-nav-btn ${active === "reading" && open.includes("reading") ? "active" : ""}`} onClick={() => launch("reading")}>Bookshelf</button>
            <button className={`top-nav-btn ${active === "budget" && open.includes("budget") ? "active" : ""}`} onClick={() => launch("budget")}>Ledger</button>
          </nav>
        </div>
        <div className="top-navbar-right">
          <button className="top-sound-btn" onClick={toggleMute} aria-label={muted ? "Unmute sound" : "Mute sound"}>
            {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <button className="top-user-pill" onClick={() => launch("account")}>
            <UserRound size={16} /> {displayName}
          </button>
          <time className="top-clock-pill">
            {clockTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} - {clockTime.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </time>
        </div>
      </header>

      {/* Pinned Homescreen Digital Clock Widget (Top Right of Wallpaper) */}
      <div className="homescreen-clock-widget">
        <div className="homescreen-clock-time">
          {clockTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
        </div>
        <div className="homescreen-clock-date">
          {clockTime.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* Draggable Desktop Icons */}
      {(Object.keys(APP_META) as AppId[]).map((id) => (
        <DesktopIcon
          key={id}
          id={id}
          selected={selected === id}
          position={iconPositions[id]}
          onSelect={() => { setSelected(id); sound(); }}
          onOpen={() => launch(id)}
          onMove={(x, y) => setIconPositions((prev) => ({ ...prev, [id]: { x, y } }))}
        />
      ))}

      {/* Stickies */}
      {stickies.map((s) => (
        <textarea
          key={s.id}
          className={`sticky sticky-${s.color}`}
          style={{ left: s.position_x, top: s.position_y }}
          value={s.content}
          onChange={(e) => setStickies((v) => v.map((x) => (x.id === s.id ? { ...x, content: e.target.value } : x)))}
          onBlur={(e) => supabase.from("stickies").update({ content: e.target.value }).eq("id", s.id)}
        />
      ))}

      {/* Windows Layer */}
      <div className="window-layer">
        {open.map((id) => (
          <OSWindow
            key={id}
            id={id}
            active={active === id}
            minimized={minimized.includes(id)}
            maximized={maximized.includes(id)}
            onFocus={() => setActive(id)}
            onClose={() => closeApp(id)}
            onMinimize={() => setMinimized((v) => [...v, id])}
            onMaximize={() => setMaximized((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]))}
          >
            {content(id)}
          </OSWindow>
        ))}
      </div>

      {/* Windows 98 Balloon Tooltip */}
      {balloon && (
        <div className="balloon-tip">
          <button className="balloon-tip-close" onClick={() => setBalloon("")}><X size={16} /></button>
          <b>Daybreak Notification</b>
          <p style={{ margin: "4px 0 0" }}>{balloon}</p>
        </div>
      )}

      {/* Start Menu (Spotlight Quick Launcher) */}
      {start && (
        <div className="start-menu-panel" onClick={(e) => e.stopPropagation()}>
          <div className="start-menu-rail">DAYBREAK 2000</div>
          <div className="start-menu-body">
            <div className="start-search-box">
              <Search size={18} />
              <input autoFocus placeholder="Find an app..." value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            {filtered.map((id) => {
              const I = APP_META[id].icon;
              return (
                <button key={id} className="start-item-btn" onClick={() => launch(id)}>
                  <I size={20} />
                  <span>{APP_META[id].label}</span>
                  <ChevronRight size={18} />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Bottom Taskbar */}
      <nav className="bottom-taskbar" onClick={(e) => e.stopPropagation()}>
        <RetroButton className="start-btn" onClick={() => setStart((v) => !v)}>
          <CloudSun size={18} /> Start
        </RetroButton>
        <div className="taskbar-buttons">
          {open.map((id) => (
            <button
              key={id}
              className={`taskbar-app-btn ${active === id && !minimized.includes(id) ? "pressed" : ""}`}
              onClick={() => { setActive(id); setMinimized((v) => v.filter((x) => x !== id)); }}
            >
              {APP_META[id].label}
            </button>
          ))}
        </div>
        <div className="taskbar-tray">
          <button className="tray-mute-btn" onClick={toggleMute} aria-label={muted ? "Unmute sounds" : "Mute sounds"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <span>{clockTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}</span>
        </div>
      </nav>

      {/* Pocket OS Mobile Tabs */}
      <nav className="pocket-tabs">
        {(["focus", "timer", "notes", "budget"] as AppId[]).map((id) => {
          const I = APP_META[id].icon;
          return (
            <button key={id} className={`pocket-tab-btn ${active === id ? "active" : ""}`} onClick={() => launch(id)}>
              <I size={22} />
              <span>{APP_META[id].label.split(" ")[0]}</span>
            </button>
          );
        })}
      </nav>
    </main>
  );
}

export function DaybreakDesktop() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (!ready) {
    return (
      <main className="boot-screen wallpaper-pastel-cyber">
        <div className="boot-word">
          daybreak
          <span>loading personal os...</span>
        </div>
      </main>
    );
  }

  return session ? <DaybreakOS session={session} /> : <LoginWindow />;
}