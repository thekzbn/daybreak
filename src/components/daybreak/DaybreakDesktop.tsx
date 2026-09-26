import { useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleDollarSign,
  CloudSun,
  Disc3,
  LogOut,
  MonitorCog,
  Music2,
  NotebookPen,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  UserRound,
  Volume2,
  VolumeX,
  X,
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

const APP_META: Record<AppId, { label: string; icon: typeof CloudSun; iconBg: string }> = {
  focus:   { label: "Daily 3",      icon: Check,            iconBg: "#e8a0c8" },
  timer:   { label: "Focus Player", icon: Music2,           iconBg: "#78c8c8" },
  notes:   { label: "Scratch Note", icon: NotebookPen,      iconBg: "#f0b8d0" },
  reading: { label: "Reading Shelf",icon: BookOpen,         iconBg: "#e8a0c8" },
  budget:  { label: "Budget Ledger",icon: CircleDollarSign, iconBg: "#b8a0e0" },
  archive: { label: "Logbook",      icon: CalendarDays,     iconBg: "#b8a0e0" },
  display: { label: "Display",      icon: MonitorCog,       iconBg: "#78c8c8" },
  account: { label: "Account",      icon: UserRound,        iconBg: "#b8a0e0" },
  trash:   { label: "Recycle Bin",  icon: Trash2,           iconBg: "#d0c0e8" },
};

// Default icon positions on the desktop
const ICON_DEFAULTS: Record<AppId, { x: number; y: number }> = {
  focus:   { x: 18, y: 100 },
  timer:   { x: 18, y: 188 },
  notes:   { x: 18, y: 276 },
  reading: { x: 18, y: 364 },
  budget:  { x: 18, y: 452 },
  archive: { x: 18, y: 540 },
  display: { x: 18, y: 628 },
  account: { x: 108,y: 100 },
  trash:   { x: 108,y: 188 },
};

const today = () => new Date().toLocaleDateString("en-CA");
const monthStart = () => `${today().slice(0, 7)}-01`;
const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

function RetroButton(props: React.ComponentProps<typeof Button>) {
  return <Button {...props} className={`retro-button ${props.className ?? ""}`} />;
}

function LoginWindow() {
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [status, setStatus] = useState("Welcome. Please identify yourself.");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true);
    if (mode === "forgot") {
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
      setStatus(error ? error.message : "Password reset mail sent. Check your inbox."); setBusy(false); return;
    }
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { display_name: displayName || "Daybreaker" } } });
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

  return <main className="boot-screen wallpaper-pastel-cyber">
    <div className="login-brand"><CloudSun /><span>daybreak</span><small>PERSONAL OS</small></div>
    <section className="os-window login-window" aria-label="Daybreak account">
      <div className="titlebar"><span><UserRound size={14} /> Daybreak Account</span><span className="window-glyph">?</span></div>
      <div className="login-body">
        <div className="login-art" aria-hidden><span>☀</span><strong>GOOD<br />MORNING</strong></div>
        <form onSubmit={submit}>
          <h1>{mode === "signin" ? "Sign in to Daybreak" : mode === "signup" ? "Create your account" : "Reset password"}</h1>
          <p className="status-line">{status}</p>
          {mode === "signup" && <label>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} /></label>}
          <label>Email address<input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
          {mode !== "forgot" && <label>Password<input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} /></label>}
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
  </main>;
}

// Draggable desktop icon
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
    // Only left button
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

  function handlePointerUp(e: React.PointerEvent) {
    if (!dragRef.current) return;
    if (!dragRef.current.moved) {
      // It was a click - select on single, open on double handled by onClick/onDoubleClick
    }
    dragRef.current = null;
  }

  return (
    <button
      className={`desktop-icon ${selected ? "selected" : ""}`}
      style={{ position: "absolute", left: position.x, top: position.y }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={onSelect}
      onDoubleClick={onOpen}
      aria-label={`${meta.label}, double click to open`}
    >
      <span className="pixel-icon" style={{ background: meta.iconBg }}>
        <Icon />
      </span>
      <span>{meta.label}</span>
    </button>
  );
}

function OSWindow({ id, active, minimized, maximized, onFocus, onClose, onMinimize, onMaximize, children }: {
  id: AppId; active: boolean; minimized: boolean; maximized: boolean; onFocus: () => void; onClose: () => void; onMinimize: () => void; onMaximize: () => void; children: React.ReactNode;
}) {
  const [pos, setPos] = useState(() => {
    const offsets: Partial<Record<AppId, { x: number; y: number }>> = {
      focus: { x: 200, y: 60 }, timer: { x: 220, y: 80 }, notes: { x: 240, y: 90 },
      reading: { x: 210, y: 70 }, budget: { x: 230, y: 85 }, archive: { x: 215, y: 75 },
      display: { x: 250, y: 95 }, account: { x: 235, y: 88 }, trash: { x: 245, y: 92 },
    };
    return offsets[id] ?? { x: 220, y: 80 };
  });
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);

  if (minimized) return null;

  return (
    <section
      className={`os-window app-window window-${id} ${active ? "active" : ""} ${maximized ? "maximized" : ""}`}
      style={maximized ? undefined : { transform: `translate(${pos.x}px, ${pos.y}px)` }}
      onMouseDown={onFocus}
    >
      <div
        className="titlebar"
        onPointerDown={(e) => {
          if (maximized) return;
          // Don't initiate drag if clicking a control button
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
          {(() => { const I = APP_META[id].icon; return <I size={13} />; })()}
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
      {children}
    </section>
  );
}

function DigitalClock({ large = false }: { large?: boolean }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id); }, []);
  return <time className={large ? "desktop-clock" : "tray-clock"} title={now.toLocaleDateString(undefined, { dateStyle: "full" })}>
    {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: large ? "2-digit" : undefined, hour12: true })}
    {large && <small>{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}</small>}
  </time>;
}

function FocusApp({ tasks, userId, refresh, chime }: { tasks: Task[]; userId: string; refresh: () => void; chime: () => void }) {
  const [title, setTitle] = useState("");
  const todays = tasks.filter((t) => t.task_date === today()).sort((a,b) => a.priority-b.priority);
  const recommended = todays.filter((t) => t.is_recommended).slice(0,3);
  const allDone = recommended.length === 3 && recommended.every((t) => t.completed_at);
  const celebrated = useRef(false);
  const [victoryDismissed, setVictoryDismissed] = useState(false);
  useEffect(() => { if (allDone && !celebrated.current) { celebrated.current = true; chime(); setVictoryDismissed(false); } }, [allDone, chime]);
  async function addTask() { if (!title.trim()) return; await supabase.from("tasks").insert({ user_id: userId, title: title.trim(), task_date: today(), priority: todays.length + 1, is_recommended: recommended.length < 3 }); setTitle(""); refresh(); }
  async function toggle(task: Task) { await supabase.from("tasks").update({ completed_at: task.completed_at ? null : new Date().toISOString(), is_active: false }).eq("id", task.id); refresh(); }
  async function activate(task: Task) { await supabase.from("tasks").update({ is_active: false }).eq("user_id", userId).eq("task_date", today()); await supabase.from("tasks").update({ is_active: true }).eq("id", task.id); refresh(); }
  async function remove(task: Task) { await supabase.from("tasks").delete().eq("id", task.id); refresh(); }
  return <div className="window-content focus-content">
    <div className="focus-header"><div><span className="eyebrow">TODAY'S PRIORITY LOCK</span><h2>Daily 3 Focus</h2></div><div className="three-meter">{recommended.filter(t=>t.completed_at).length}<span>/3</span></div></div>
    <div className="task-list">{todays.map((task, i) => <div className={`task-row ${task.is_active ? "active-task" : ""}`} key={task.id}>
      <button className="pixel-check" onClick={() => toggle(task)} aria-label={`Complete ${task.title}`}>{task.completed_at && <Check />}</button>
      <span className={task.completed_at ? "done" : ""}>{task.is_recommended && <b>0{i+1}</b>}{task.title}</span>
      {!task.completed_at && <RetroButton size="sm" onClick={() => activate(task)} disabled={task.is_active}>{task.is_active ? "ACTIVE" : "FOCUS"}</RetroButton>}
      <button className="bare-icon" onClick={() => remove(task)} aria-label={`Delete ${task.title}`}><X /></button>
    </div>)}</div>
    <form className="inline-add" onSubmit={(e) => { e.preventDefault(); void addTask(); }}><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder={recommended.length < 3 ? "Add a daily priority..." : "Add an extra task..."} maxLength={240}/><RetroButton type="submit" size="icon"><Plus /></RetroButton></form>
    {allDone && !victoryDismissed && <div className="victory-dialog"><div className="confetti">✦ ▪ ✧ ▪ ✦</div><strong>MISSION COMPLETE!</strong><span>Your Daily 3 are done.</span><RetroButton onClick={() => setVictoryDismissed(true)}>OK</RetroButton></div>}
  </div>;
}

function TimerApp() {
  const [mode, setMode] = useState<"up"|"25"|"50">("25"); const [running, setRunning] = useState(false); const [seconds, setSeconds] = useState(1500);
  const reset = useCallback((next = mode) => { setRunning(false); setSeconds(next === "up" ? 0 : Number(next)*60); }, [mode]);
  useEffect(() => { if (!running) return; const id = window.setInterval(() => setSeconds(s => mode === "up" ? s+1 : Math.max(0,s-1)), 1000); return () => clearInterval(id); }, [running, mode]);
  const mm = Math.floor(seconds/60).toString().padStart(2,"0"), ss = (seconds%60).toString().padStart(2,"0");
  return <div className="winamp"><div className="winamp-display"><div className="led-time">{running ? "▶" : "Ⅱ"} {mm}:{ss}</div><div className="spectrum">{[1,2,3,4,5,6,7,8,9,10,11,12].map(n=><i key={n} style={{ animationDelay: `${n*-.07}s` }}/>)}</div></div>
    <div className="mode-switch">{(["up","25","50"] as const).map(m=><button key={m} className={mode===m?"on":""} onClick={()=>{setMode(m); reset(m);}}>{m === "up" ? "STOPWATCH" : `${m} MIN`}</button>)}</div>
    <div className="player-controls"><RetroButton size="icon" onClick={()=>setRunning(true)} aria-label="Play"><Play/></RetroButton><RetroButton size="icon" onClick={()=>setRunning(false)} aria-label="Pause"><Pause/></RetroButton><RetroButton size="icon" onClick={()=>reset()} aria-label="Reset"><RotateCcw/></RetroButton></div>
  </div>;
}

function NotesApp({ userId, initial, refresh }: { userId: string; initial: string; refresh: () => void }) {
  const [text,setText]=useState(initial); const [saved,setSaved]=useState("Ready");
  useEffect(()=>setText(initial),[initial]);
  async function save(){setSaved("Saving..."); await supabase.from("notes").upsert({user_id:userId,note_date:today(),content:text},{onConflict:"user_id,note_date"}); setSaved("Saved"); refresh();}
  async function sticky(){if(!text.trim())return; await supabase.from("stickies").insert({user_id:userId,content:text.slice(0,300),color:"yellow",position_x:520,position_y:140}); refresh();}
  return <div className="notepad"><div className="menu-strip">File&nbsp;&nbsp; Edit&nbsp;&nbsp; Format&nbsp;&nbsp; Help</div><textarea value={text} onChange={e=>setText(e.target.value)} onBlur={save} placeholder="Type something before it floats away..."/><div className="notepad-status"><span>{text.length} characters</span><span>{saved}</span><RetroButton size="sm" onClick={sticky}>Tear off note</RetroButton></div></div>;
}

function ReadingApp({ books,userId,refresh }: {books:Book[];userId:string;refresh:()=>void}) {
  const [selected,setSelected]=useState<Book|null>(null);
  async function add(slot:number){const title=window.prompt("Book title"); if(!title)return; const url=window.prompt("Link to the book or article","https://"); if(!url)return; const color=window.prompt("Spine color: rose, teal, violet, amber","rose")||"rose"; await supabase.from("reading_queue").insert({user_id:userId,title,url,slot,spine_color:color});refresh();}
  async function progress(book:Book,value:number){await supabase.from("reading_queue").update({progress:value}).eq("id",book.id);refresh();setSelected({...book,progress:value});}
  return <div className="reading-room"><div className="shelf-title">THE FIVE BOOK SHELF <span>{books.length}/5</span></div><div className="wood-shelf">{[1,2,3,4,5].map(slot=>{const b=books.find(x=>x.slot===slot);return b?<button key={slot} className={`book-spine spine-${b.spine_color}`} onClick={()=>setSelected(b)}><span>{b.title}</span><small>{b.progress}%</small></button>:<button key={slot} className="empty-slot" onClick={()=>add(slot)}>+ EMPTY</button>})}</div>
  {selected&&<div className="book-detail"><strong>{selected.title}</strong><span>Reading progress</span><input type="range" min="0" max="100" value={selected.progress} onChange={e=>progress(selected,Number(e.target.value))}/><div><RetroButton onClick={()=>window.open(selected.url,"_blank","noopener,noreferrer")}>Open link</RetroButton><RetroButton onClick={async()=>{await supabase.from("reading_queue").delete().eq("id",selected.id);setSelected(null);refresh();}}>Remove</RetroButton></div></div>}</div>;
}

function BudgetApp({ userId, settings, categories, expenses, refresh }: { userId:string; settings:Tables<"budget_settings">|null;categories:Category[];expenses:Expense[];refresh:()=>void }) {
  const [income,setIncome]=useState(String(settings?.income??0)),[fixed,setFixed]=useState(String(settings?.fixed_costs??0)),[goal,setGoal]=useState(String(settings?.saving_goal??0));
  const [amount,setAmount]=useState(""),[desc,setDesc]=useState("");
  useEffect(()=>{setIncome(String(settings?.income??0));setFixed(String(settings?.fixed_costs??0));setGoal(String(settings?.saving_goal??0));},[settings]);
  const spent=expenses.reduce((n,e)=>n+Number(e.amount),0), now=new Date(), days=new Date(now.getFullYear(),now.getMonth()+1,0).getDate()-now.getDate()+1;
  const surplus=Number(income)-Number(fixed)-Number(goal), allowance=(surplus-spent)/Math.max(days,1);
  async function save(){await supabase.from("budget_settings").upsert({user_id:userId,month:monthStart(),income:Number(income)||0,fixed_costs:Number(fixed)||0,saving_goal:Number(goal)||0},{onConflict:"user_id,month"});refresh();}
  async function addExpense(){if(!(Number(amount)>0))return;await supabase.from("expenses").insert({user_id:userId,amount:Number(amount),description:desc,spent_on:today(),category_id:categories[0]?.id??null});setAmount("");setDesc("");refresh();}
  return <div className="ledger"><div className="allowance-pane"><span>DAILY BURN ALLOWANCE</span><strong>{money(allowance)}</strong><small>{money(Math.max(surplus-spent,0))} left across {days} days</small></div>
    <div className="ledger-settings"><label>Monthly income<input type="number" value={income} onChange={e=>setIncome(e.target.value)} onBlur={save}/></label><label>Fixed costs<input type="number" value={fixed} onChange={e=>setFixed(e.target.value)} onBlur={save}/></label><label>Saving goal<input type="number" value={goal} onChange={e=>setGoal(e.target.value)} onBlur={save}/></label></div>
    <div className="envelopes">{categories.map(c=>{const used=expenses.filter(e=>e.category_id===c.id).reduce((n,e)=>n+Number(e.amount),0);return <div className="envelope" key={c.id}><span>{c.icon} {c.name}</span><b>{money(used)} / {money(Number(c.monthly_limit))}</b><i><em style={{width:`${Math.min(100,used/Math.max(Number(c.monthly_limit),1)*100)}%`}}/></i></div>})}</div>
    <form className="expense-entry" onSubmit={e=>{e.preventDefault();void addExpense();}}><input placeholder="What did you buy?" value={desc} onChange={e=>setDesc(e.target.value)}/><input aria-label="Amount" type="number" step="0.01" placeholder="0.00" value={amount} onChange={e=>setAmount(e.target.value)}/><RetroButton type="submit">Log spend</RetroButton></form>
  </div>;
}

function ArchiveApp({tasks,expenses,notes}:{tasks:Task[];expenses:Expense[];notes:Tables<"notes">[]}) {
  const [date,setDate]=useState(today()); const dayTasks=tasks.filter(t=>t.task_date===date&&t.completed_at), daySpend=expenses.filter(e=>e.spent_on===date).reduce((n,e)=>n+Number(e.amount),0), note=notes.find(n=>n.note_date===date)?.content;
  function download(){const dates=[...new Set([...tasks.map(t=>t.task_date),...expenses.map(e=>e.spent_on),...notes.map(n=>n.note_date)])].sort();const text=dates.map(d=>{const ts=tasks.filter(t=>t.task_date===d&&t.completed_at).map(t=>`[x] ${t.title}`).join("\n")||"No completed tasks";const ns=notes.find(n=>n.note_date===d)?.content||"No notes";const sp=expenses.filter(e=>e.spent_on===d).reduce((n,e)=>n+Number(e.amount),0);return `DAYBREAK LOG: ${d}\n\n${ts}\n\nFOCUS: ${Math.round(tasks.filter(t=>t.task_date===d).reduce((n,t)=>n+t.focus_seconds,0)/60)} minutes\nSPEND: ${money(sp)}\n\nNOTES\n${ns}`}).join("\n\n====================\n\n");const blob=new Blob([text],{type:"text/plain"}),url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="daybreak-logbook.txt";a.click();URL.revokeObjectURL(url);}
  return <div className="archive"><div className="calendar-toolbar"><input type="date" max={today()} value={date} onChange={e=>setDate(e.target.value)}/><RetroButton onClick={download}><Disc3/> Export floppy</RetroButton></div><div className="archive-paper"><h2>{new Date(`${date}T12:00:00`).toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})}</h2><p><b>Completed tasks</b></p>{dayTasks.length?dayTasks.map(t=><p key={t.id}>☑ {t.title}</p>):<p className="muted-text">No completed tasks</p>}<p><b>Focus time</b> {Math.round(dayTasks.reduce((n,t)=>n+t.focus_seconds,0)/60)} min</p><p><b>Spend log</b> {money(daySpend)}</p><p><b>Notes</b></p><pre>{note||"No notes for this day."}</pre></div></div>;
}

function DisplayApp({wallpaper,setWallpaper}:{wallpaper:Wallpaper;setWallpaper:(w:Wallpaper)=>void}){const options:[Wallpaper,string][]=[ ["pastel-cyber","Pastel Cyber"],["retro-grid","Retro Tech Grid"],["vintage-lavender","Vintage Lavender"],["pixel-clouds","Pixel Clouds"]];return <div className="display-properties"><div className={`monitor-preview wallpaper-${wallpaper}`}><span>daybreak</span></div><fieldset><legend>Wallpaper</legend>{options.map(([id,label])=><label key={id}><input type="radio" checked={wallpaper===id} onChange={()=>setWallpaper(id)}/><span className={`swatch wallpaper-${id}`}/>{label}</label>)}</fieldset></div>}

function AccountApp({session,displayName,setDisplayName,onSignOut}:{session:Session;displayName:string;setDisplayName:(s:string)=>void;onSignOut:()=>void}){return <div className="account-app"><div className="pixel-avatar">{displayName.slice(0,1).toUpperCase()}</div><div><span className="eyebrow">SIGNED IN AS</span><h2>{displayName}</h2><p>{session.user.email}</p><label>Display name<input value={displayName} maxLength={60} onChange={e=>setDisplayName(e.target.value)} onBlur={()=>supabase.from("profiles").update({display_name:displayName}).eq("user_id",session.user.id)}/></label><RetroButton onClick={onSignOut}><LogOut/> Sign out</RetroButton></div></div>}

function DaybreakOS({session}:{session:Session}) {
  const [open,setOpen]=useState<AppId[]>(["focus","timer"]);
  const [active,setActive]=useState<AppId>("focus");
  const [minimized,setMinimized]=useState<AppId[]>([]);
  const [maximized,setMaximized]=useState<AppId[]>([]);
  const [selected,setSelected]=useState<AppId|null>(null);
  const [start,setStart]=useState(false);
  const [search,setSearch]=useState("");
  const [wallpaper,setWallpaperState]=useState<Wallpaper>("pastel-cyber");
  const [muted,setMuted]=useState(false);
  const [displayName,setDisplayName]=useState(String(session.user.user_metadata?.["display_name"] ?? "Daybreaker"));
  const [tasks,setTasks]=useState<Task[]>([]);
  const [books,setBooks]=useState<Book[]>([]);
  const [notes,setNotes]=useState<Tables<"notes">[]>([]);
  const [stickies,setStickies]=useState<Tables<"stickies">[]>([]);
  const [expenses,setExpenses]=useState<Expense[]>([]);
  const [categories,setCategories]=useState<Category[]>([]);
  const [settings,setSettings]=useState<Tables<"budget_settings">|null>(null);
  const [balloon,setBalloon]=useState("Double-click an icon to begin.");

  // Icon positions (draggable)
  const [iconPositions, setIconPositions] = useState<Record<AppId, { x: number; y: number }>>(() => ({ ...ICON_DEFAULTS }));

  const refresh=useCallback(async()=>{const uid=session.user.id;const [t,b,n,s,e,c,bs,p]=await Promise.all([supabase.from("tasks").select("*").eq("user_id",uid),supabase.from("reading_queue").select("*").eq("user_id",uid),supabase.from("notes").select("*").eq("user_id",uid),supabase.from("stickies").select("*").eq("user_id",uid),supabase.from("expenses").select("*").eq("user_id",uid),supabase.from("budget_categories").select("*").eq("user_id",uid),supabase.from("budget_settings").select("*").eq("user_id",uid).eq("month",monthStart()).maybeSingle(),supabase.from("profiles").select("*").eq("user_id",uid).maybeSingle()]);setTasks(t.data??[]);setBooks(b.data??[]);setNotes(n.data??[]);setStickies(s.data??[]);setExpenses(e.data??[]);setCategories(c.data??[]);setSettings(bs.data??null);if(p.data){setWallpaperState(p.data.wallpaper as Wallpaper);setMuted(p.data.sound_muted);setDisplayName(p.data.display_name);}},[session.user.id]);

  useEffect(()=>{async function init(){await supabase.from("profiles").upsert({user_id:session.user.id,display_name:displayName},{onConflict:"user_id",ignoreDuplicates:true});const {data}=await supabase.from("budget_categories").select("id").eq("user_id",session.user.id).limit(1);if(!data?.length)await supabase.from("budget_categories").insert([{user_id:session.user.id,name:"Essentials",icon:"▣",monthly_limit:800},{user_id:session.user.id,name:"Food",icon:"◆",monthly_limit:350},{user_id:session.user.id,name:"Fun",icon:"★",monthly_limit:180}]);await refresh();}void init();},[session.user.id]);

  const sound=useCallback((kind="click")=>{if(muted)return;const AudioCtx=window.AudioContext||(window as typeof window & {webkitAudioContext:typeof AudioContext}).webkitAudioContext;const ctx=new AudioCtx(),osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=kind==="victory"?"square":"triangle";osc.frequency.value=kind==="victory"?880:kind==="trash"?90:260;gain.gain.setValueAtTime(.06,ctx.currentTime);gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.18);osc.connect(gain).connect(ctx.destination);osc.start();osc.stop(ctx.currentTime+.2);},[muted]);

  function launch(id:AppId){sound();setOpen(v=>v.includes(id)?v:[...v,id]);setMinimized(v=>v.filter(x=>x!==id));setActive(id);setStart(false);}

  async function setWallpaper(w:Wallpaper){setWallpaperState(w);await supabase.from("profiles").update({wallpaper:w}).eq("user_id",session.user.id);setBalloon(`Display: ${w.replaceAll("-"," ")} applied.`);}
  async function toggleMute(){const next=!muted;setMuted(next);await supabase.from("profiles").update({sound_muted:next}).eq("user_id",session.user.id);}
  async function signOut(){await supabase.auth.signOut();}

  function closeApp(id: AppId) {
    sound();
    setOpen(v => v.filter(x => x !== id));
    setMinimized(v => v.filter(x => x !== id));
    setMaximized(v => v.filter(x => x !== id));
  }

  const filtered=(Object.keys(APP_META) as AppId[]).filter(id=>APP_META[id].label.toLowerCase().includes(search.toLowerCase()));

  const content=(id:AppId)=>id==="focus"?<FocusApp tasks={tasks} userId={session.user.id} refresh={refresh} chime={()=>sound("victory")}/>:id==="timer"?<TimerApp/>:id==="notes"?<NotesApp userId={session.user.id} initial={notes.find(n=>n.note_date===today())?.content??""} refresh={refresh}/>:id==="reading"?<ReadingApp books={books} userId={session.user.id} refresh={refresh}/>:id==="budget"?<BudgetApp userId={session.user.id} settings={settings} categories={categories} expenses={expenses} refresh={refresh}/>:id==="archive"?<ArchiveApp tasks={tasks} expenses={expenses} notes={notes}/>:id==="display"?<DisplayApp wallpaper={wallpaper} setWallpaper={setWallpaper}/>:id==="account"?<AccountApp session={session} displayName={displayName} setDisplayName={setDisplayName} onSignOut={signOut}/>:<div className="trash-app"><Trash2/><h2>Recycle Bin</h2><p>{balloon.includes("deleted")?"1 crumpled item":"The bin is empty."}</p><RetroButton onClick={()=>setBalloon("Recycle Bin emptied with a satisfying crunch.")}>Empty Bin</RetroButton></div>;

  return (
    <main className={`desktop wallpaper-${wallpaper}`} onClick={()=>{setSelected(null);setStart(false);}}>
      {/* Desktop header */}
      <div className="desktop-brand"><CloudSun/><span>daybreak</span></div>
      <DigitalClock large/>

      {/* Draggable desktop icons */}
      {(Object.keys(APP_META) as AppId[]).map(id => (
        <DesktopIcon
          key={id}
          id={id}
          selected={selected === id}
          position={iconPositions[id]}
          onSelect={() => { setSelected(id); sound(); }}
          onOpen={() => launch(id)}
          onMove={(x, y) => setIconPositions(prev => ({ ...prev, [id]: { x, y } }))}
        />
      ))}

      {/* Stickies */}
      {stickies.map(s=><textarea key={s.id} className={`sticky sticky-${s.color}`} style={{left:s.position_x,top:s.position_y}} value={s.content} onChange={e=>setStickies(v=>v.map(x=>x.id===s.id?{...x,content:e.target.value}:x))} onBlur={e=>supabase.from("stickies").update({content:e.target.value}).eq("id",s.id)} />)}

      {/* Windows */}
      <div className="window-layer">
        {open.map((id) => (
          <OSWindow
            key={id}
            id={id}
            active={active===id}
            minimized={minimized.includes(id)}
            maximized={maximized.includes(id)}
            onFocus={()=>setActive(id)}
            onClose={()=>closeApp(id)}
            onMinimize={()=>setMinimized(v=>[...v,id])}
            onMaximize={()=>setMaximized(v=>v.includes(id)?v.filter(x=>x!==id):[...v,id])}
          >
            {content(id)}
          </OSWindow>
        ))}
      </div>

      {/* Balloon tooltip */}
      {balloon && <button className="balloon" onClick={()=>setBalloon("")}><b>Daybreak tip</b><span>{balloon}</span><X/></button>}

      {/* Start menu */}
      {start && <div className="start-menu" onClick={e=>e.stopPropagation()}>
        <div className="start-rail">DAYBREAK 2000</div>
        <div className="start-main">
          <label><Search/><input autoFocus placeholder="Find an app..." value={search} onChange={e=>setSearch(e.target.value)}/></label>
          {filtered.map(id=>{const I=APP_META[id].icon;return <button key={id} onClick={()=>launch(id)}><I/><span>{APP_META[id].label}</span><ChevronRight/></button>})}
        </div>
      </div>}

      {/* Taskbar */}
      <nav className="taskbar" onClick={e=>e.stopPropagation()}>
        <RetroButton className="start-button" onClick={()=>setStart(v=>!v)}><CloudSun/> Start</RetroButton>
        <div className="task-buttons">
          {open.map(id=><button key={id} className={active===id&&!minimized.includes(id)?"pressed":""} onClick={()=>{setActive(id);setMinimized(v=>v.filter(x=>x!==id));}}>{APP_META[id].label}</button>)}
        </div>
        <div className="tray">
          <button onClick={toggleMute} aria-label={muted?"Unmute sounds":"Mute sounds"}>{muted?<VolumeX/>:<Volume2/>}</button>
          <DigitalClock/>
        </div>
      </nav>

      {/* Mobile pocket tabs */}
      <nav className="pocket-tabs">
        {(["focus","timer","notes","budget"] as AppId[]).map(id=>{const I=APP_META[id].icon;return <button key={id} className={active===id?"active":""} onClick={()=>launch(id)}><I/><span>{APP_META[id].label.split(" ")[0]}</span></button>;})}
      </nav>
    </main>
  );
}

export function DaybreakDesktop(){
  const [session,setSession]=useState<Session|null>(null);
  const [ready,setReady]=useState(false);
  useEffect(()=>{supabase.auth.getSession().then(({data})=>{setSession(data.session);setReady(true)});const {data}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));return()=>data.subscription.unsubscribe();},[]);
  if(!ready)return <main className="boot-screen wallpaper-pastel-cyber"><div className="boot-word">daybreak<span>loading personal os...</span></div></main>;
  return session?<DaybreakOS session={session}/>:<LoginWindow/>;
}