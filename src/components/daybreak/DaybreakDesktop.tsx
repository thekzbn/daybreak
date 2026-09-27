import { useCallback, useEffect, useRef, useState } from "react";
import {
  ExternalLink,
  FastForward,
  LogOut,
  Pause,
  Play,
  Plus,
  Repeat,
  Rewind,
  RotateCcw,
  Search,
  Shuffle,
  Square,
  Volume2,
  VolumeX,
  X,
  Check,
  Sparkles,
  Download,
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

/* ============================================================
   AUTHENTIC PIXEL ART SVGS (Colored & Styled for Daybreak OS)
   ============================================================ */
function AccountIcon() {
  return (
    <svg viewBox="0 0 32 32" id="boy_Light" data-name="boy/Light" xmlns="http://www.w3.org/2000/svg">
      <g>
        <path d="M0,0H12V2H8V4H6V6H4v4H2v4H0Z" fill="#ffffff00" />
        <path d="M12,0H26V2h4V4h2V8H30v2H28v2H26v4H24v2H20V16H18V14h6V12H18V10h4V8H16v2H14v2H12V22H10V20H8v6h4v6H10V28H6V26H4V24H2V20H0V14H2V10H4V6H6V4H8V2h4Z" fill="#1a1a1a" />
        <path d="M0,0H6V4H4V2H0Z" transform="translate(26)" fill="#ffffff00" />
        <path d="M8,0h6V2H10V4h6V6H10V8h2v2h4V8h2v2h2v2H18v2H16v2h2v4H12v2h2v2H4V18H0V12H2v2H4V4H6V2H8Z" transform="translate(8 8)" fill="#FFE2D2" />
        <path d="M6,0H8V24H0V22H2V20H4V12H6V10H4V8H2V4H4V2H6Z" transform="translate(24 8)" fill="#ffffff00" />
        <path d="M0,0H2V2H0Z" transform="translate(26 16)" fill="#1a1a1a" />
        <path d="M0,0H2V2H0Z" transform="translate(28 18)" fill="#1a1a1a" />
        <path d="M0,0H2V4H4V6H6V8h4v4H0Z" transform="translate(0 20)" fill="#ffffff00" />
        <path d="M2,0H4V8H2V4H0V2H2Z" transform="translate(24 20)" fill="#1a1a1a" />
        <path d="M0,0H6V2H4V4H2V2H0Z" transform="translate(20 28)" fill="#1a1a1a" />
      </g>
    </svg>
  );
}

function ReadingIcon() {
  return (
    <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
      <g fill="#8844b8">
        <rect x="0" y="0" width="2" height="16" fill="#582488" />
        <path d="M11,6 L11,9 L11.885,9 L12,6 L11,6 Z" fill="#ffffff" />
        <path d="M3,0 L3,16 L13.82,16 C14.47,16 15,15.55 15,14.99 L15,1.01 C15,0.45 14.47,0 13.82,0 L3,0 Z" fill="#9355cc" />
        <path d="M13.051,9.053 L12.08,9.053 L12.062,10.063 L7.906,10.063 L7.924,9.042 L6.957,9.042 L6.957,6.99 L7.915,6.99 L7.915,5.948 L10.957,5.938 L10.957,5.051 L7.026,5.051 L7.026,6.048 L6.029,6.048 L6.029,9.958 L7.041,9.958 L7.041,10.975 L11.047,10.975 L11.047,12.014 L6.961,12.014 L6.961,11.063 L5.958,11.063 L5.958,10.032 L4.953,10.032 L4.953,5.991 L5.973,5.991 L5.973,4.973 L6.938,4.973 L6.938,3.938 L11.032,3.938 L11.032,4.959 L12.011,4.959 L12.011,5.949 L13.052,5.949 Z" fill="#ffffff" />
        <rect x="8" y="7" width="2" height="2" fill="#ffffff" />
      </g>
    </svg>
  );
}

function BinIcon() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M 15 3 L 15 5 L 4 5 L 4 7 L 6 7 L 6 18 L 8 18 L 8 7 L 24 7 L 24 18 L 26 18 L 26 7 L 28 7 L 28 5 L 17 5 L 17 3 L 15 3 z" fill="#588844" />
      <path d="M 24 18 L 22 18 L 22 26 L 10 26 L 10 18 L 8 18 L 8 26 L 8 28 L 10 28 L 22 28 L 24 28 L 24 26 L 24 18 z" fill="#78b868" />
      <path d="M 13 9 L 13 23 L 15 23 L 15 9 L 13 9 z M 17 9 L 17 23 L 19 23 L 19 9 L 17 9 z" fill="#386828" />
      <rect x="10" y="8" width="12" height="15" fill="#a4dc94" opacity="0.4" />
    </svg>
  );
}

function NotesIcon() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M 6 4 L 6 28 L 26 28 L 26 10 L 24 10 L 24 8 L 22 8 L 22 10 L 20 10 L 20 8 L 22 8 L 22 6 L 20 6 L 20 4 L 6 4 z" fill="#1b8fa8" />
      <path d="M 8 6 L 18 6 L 18 12 L 19 12 L 24 12 L 24 26 L 8 26 L 8 6 z" fill="#ffffff" />
      <path d="M 10 13 L 10 15 L 16 15 L 16 13 L 10 13 z M 10 17 L 10 19 L 22 19 L 22 17 L 10 17 z M 10 21 L 10 23 L 20 23 L 20 21 L 10 21 z" fill="#5bbccf" />
      <rect x="6" y="2" width="4" height="4" fill="#f0be6a" />
      <rect x="12" y="2" width="4" height="4" fill="#f0be6a" />
      <rect x="18" y="2" width="4" height="4" fill="#f0be6a" />
    </svg>
  );
}

function LogbookIcon() {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 3h13l5 5v13H3z" fill="#3a72c4" stroke="#1a1a1a" />
      <path d="M7 3h8.7v8H7z" fill="#ded8cd" stroke="#1a1a1a" />
      <path fill="#fff" stroke="#1a1a1a" d="M6 13h12v8H6z" />
    </svg>  
  );
}
// push
function FocusIcon() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path d="M 2 8 L 2 28 L 30 28 L 30 8 L 16 8 L 14 5 L 2 5 Z" fill="#e8a838" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M 4 11 L 28 11 L 28 26 L 4 26 Z" fill="#ffd478" />
      <rect x="8" y="4" width="8" height="6" fill="#5bbccf" stroke="#1a1a1a" strokeWidth="0.5" />
      <rect x="18" y="3" width="8" height="7" fill="#f29ab8" stroke="#1a1a1a" strokeWidth="0.5" />
      <path d="M 12 18 L 15 21 L 22 14" stroke="#1a1a1a" strokeWidth="2" fill="none" strokeLinecap="square" />
    </svg>
  );
}

function TimerIcon() {
  return (
    <svg viewBox="0 0 32 32" data-name="clockfacethreeoclock/Light" xmlns="http://www.w3.org/2000/svg">
      <g strokeWidth="0" />
      <g strokeLinecap="round" strokeLinejoin="round" />
      <path d="M0 0h10v2H6v2H4v2H2v4H0Z" fill="#ffffff00" />
      <path data-name="Path" d="M10 0h12v2h-6v12h8v2H14V2h-4Z" fill="#1a1a1a" />
      <path data-name="Path" d="M22 0h10v10h-2V6h-2V4h-2V2h-4Z" fill="#ffffff00" />
      <path data-name="Path" d="M6 2h4v2H6Z" fill="#1a1a1a" />
      <path data-name="Path" d="M10 2h4v14h10v-2h-8V2h6v2h4v2h2v4h2v12h-2v4h-2v2h-4v2H10v-2H6v-2H4v-4H2V10h2V6h2V4h4Z" fill="#f0be6a" />
      <path data-name="Path" d="M22 2h4v2h-4ZM4 4h2v2H4Zm22 0h2v2h-2ZM2 6h2v4H2Zm26 0h2v4h-2ZM0 10h2v12H0Zm30 0h2v12h-2Z" fill="#1a1a1a" />
      <path data-name="Path" d="M0 22h2v4h2v2h2v2h4v2H0Z" fill="#ffffff00" />
      <path data-name="Path" d="M2 22h2v4H2Zm26 0h2v4h-2Z" fill="#1a1a1a" />
      <path data-name="Path" d="M30 22h2v10H22v-2h4v-2h2v-2h2Z" fill="#ffffff00" />
      <path data-name="Path" d="M4 26h2v2H4Zm22 0h2v2h-2ZM6 28h4v2H6Zm16 0h4v2h-4Zm-12 2h12v2H10Z" fill="#1a1a1a" />
    </svg>
  );
}

function BudgetIcon() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="5" width="26" height="22" rx="1" fill="#168ea8" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="6" y="8" width="20" height="6" fill="#0d2830" stroke="#1a1a1a" strokeWidth="0.5" />
      <rect x="7" y="9" width="4" height="4" fill="#38f088" />
      <rect x="6" y="17" width="5" height="4" fill="#f0be6a" stroke="#1a1a1a" strokeWidth="0.5" />
      <rect x="13" y="17" width="5" height="4" fill="#f0be6a" stroke="#1a1a1a" strokeWidth="0.5" />
      <rect x="20" y="17" width="6" height="8" fill="#f29ab8" stroke="#1a1a1a" strokeWidth="0.5" />
      <rect x="6" y="22" width="5" height="3" fill="#f0be6a" stroke="#1a1a1a" strokeWidth="0.5" />
      <rect x="13" y="22" width="5" height="3" fill="#f0be6a" stroke="#1a1a1a" strokeWidth="0.5" />
    </svg>
  );
}

function DisplayIcon() {
  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path stroke="#000" strokeWidth="1" fill="#ded8cd" d="M8 27h16v3H8zm5-4h6v4h-6zM3 3h26v20H3z" />
      <path stroke="#000" strokeWidth="1" fill="#5bbccf" d="M5.5 5.5h21v11h-21z" />
      <path stroke="#000" strokeWidth="1" fill="#b8b0a2" d="M5.5 16.5h21v4h-21z" />
    </svg>
  );
}

function StickyMenuIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2h8l4 4v8H2z" fill="#fef08a" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M10 2v4h4" fill="#fde047" stroke="#1a1a1a" strokeWidth="1" />
      <path d="M4 6h4M4 9h8M4 11h6" stroke="#1a1a1a" strokeWidth="1" />
    </svg>
  );
}

function AlignMenuIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="5" height="5" fill="#5bbccf" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="9" y="2" width="5" height="5" fill="#f29ab8" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="2" y="9" width="5" height="5" fill="#f0be6a" stroke="#1a1a1a" strokeWidth="1" />
      <rect x="9" y="9" width="5" height="5" fill="#38f088" stroke="#1a1a1a" strokeWidth="1" />
    </svg>
  );
}

function RefreshMenuIcon() {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 8A5 5 0 1 1 8 3h4" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
      <path d="M9 1l4 2-4 2z" fill="#5bbccf" stroke="#1a1a1a" strokeWidth="1" />
    </svg>
  );
}

/* App definitions with canonical names strictly from the Daybreak prompt */
const APP_META: Record<AppId, { label: string; renderIcon: () => React.ReactNode }> = {
  focus: { label: "Daily 3", renderIcon: () => <FocusIcon /> },
  timer: { label: "Focus Timer", renderIcon: () => <TimerIcon /> },
  notes: { label: "Scratch Note", renderIcon: () => <NotesIcon /> },
  reading: { label: "Reading Shelf", renderIcon: () => <ReadingIcon /> },
  budget: { label: "Budget Ledger", renderIcon: () => <BudgetIcon /> },
  archive: { label: "Logbook", renderIcon: () => <LogbookIcon /> },
  display: { label: "Display", renderIcon: () => <DisplayIcon /> },
  account: { label: "Account", renderIcon: () => <AccountIcon /> },
  trash: { label: "Recycle Bin", renderIcon: () => <BinIcon /> },
};

// Default layout of desktop icons (arranged on the left side)
const ICON_DEFAULTS: Record<AppId, { x: number; y: number }> = {
  focus: { x: 28, y: 60 },
  timer: { x: 28, y: 160 },
  notes: { x: 28, y: 260 },
  reading: { x: 28, y: 360 },
  budget: { x: 28, y: 460 },
  archive: { x: 120, y: 60 },
  display: { x: 120, y: 160 },
  account: { x: 120, y: 260 },
  trash: { x: 120, y: 360 },
};

const DOCK_PINNED_APPS: AppId[] = ["focus", "timer", "notes", "reading", "budget", "archive", "display", "account"];

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
  const [authMethod, setAuthMethod] = useState<"choice" | "email">("choice");
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

  if (authMethod === "choice") {
    return (
      <main className="boot-screen wallpaper-pastel-cyber login-boot">
        <section className="app-window login-choice-window" aria-label="Daybreak sign in">
          <div className="titlebar">
            <span className="titlebar-title">Welcome to Daybreak</span>
            <div className="window-controls" aria-hidden="true">
              <button tabIndex={-1}>?</button>
              <button className="close-btn" tabIndex={-1}>×</button>
            </div>
          </div>
          <div className="window-body login-choice-body">
            <div className="login-choice-heading">
              <div className="login-account-icon"><AccountIcon /></div>
              <div>
                <h1>Sign in to Daybreak</h1>
                <p>Choose how you want to continue.</p>
              </div>
            </div>
            <div className="login-choice-actions">
              <RetroButton className="login-provider-button" disabled={busy} type="button" onClick={google}>
                <svg className="login-provider-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path fill="#4285f4" d="M15 8.2c0-.5 0-.9-.1-1.3H8v2.6h4c-.2.8-.7 1.5-1.4 2v1.7h2.3c1.3-1.2 2.1-3 2.1-5z" />
                  <path fill="#34a853" d="M8 15c2 0 3.6-.7 4.9-1.8l-2.3-1.7c-.6.4-1.5.7-2.6.7-1.9 0-3.5-1.3-4.1-3H1.5V11C2.7 13.4 5.1 15 8 15z" />
                  <path fill="#fbbc05" d="M3.9 9.2a4.2 4.2 0 0 1 0-2.4V5H1.5A7 7 0 0 0 1 8c0 1.1.2 2.1.5 3l2.4-1.8z" />
                  <path fill="#ea4335" d="M8 3.8c1.1 0 2 .4 2.8 1.1l2.1-2A6.7 6.7 0 0 0 8 1 7 7 0 0 0 1.5 5l2.4 1.8c.6-1.7 2.2-3 4.1-3z" />
                </svg>
                Continue with Google
              </RetroButton>
              <RetroButton className="login-provider-button retro-button-accent" type="button" onClick={() => setAuthMethod("email")}>
                <svg className="login-provider-icon pixel-email-icon" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M1 3h14v10H1V3zm2 2v1h1v1h1v1h1v1h4V8h1V7h1V6h1V5h-2v1h-1v1H6V6H5V5H3zm0 3v3h10V8h-1v1h-1v1H5V9H4V8H3z" />
                </svg>
                Continue with Email
              </RetroButton>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="boot-screen wallpaper-pastel-cyber login-boot">
      <section className="app-window login-email-window" aria-label="Daybreak account">
        <div className="titlebar">
          <span className="titlebar-title">Daybreak Account</span>
          <div className="window-controls">
            <button>?</button>
            <button className="close-btn">×</button>
          </div>
        </div>
        <div className="window-body" style={{ padding: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px", borderBottom: "1px solid #1a1a1a", paddingBottom: "12px" }}>
            <div style={{ width: "40px", height: "40px" }}><AccountIcon /></div>
            <div>
              <h2 style={{ margin: 0, fontSize: "16px" }}>{mode === "signin" ? "Sign in to Daybreak" : mode === "signup" ? "Create your account" : "Reset password"}</h2>
              <span style={{ fontSize: "12px", color: "var(--muted-ink)" }}>{status}</span>
            </div>
          </div>
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {mode === "signup" && (
              <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                Display name
                <input style={{ border: "1px solid #1a1a1a", padding: "5px 8px" }} value={displayName} onChange={(e) => setDisplayName(e.target.value)} maxLength={60} />
              </label>
            )}
            <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              Email address
              <input style={{ border: "1px solid #1a1a1a", padding: "5px 8px" }} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </label>
            {mode !== "forgot" && (
              <label style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                Password
                <input style={{ border: "1px solid #1a1a1a", padding: "5px 8px" }} type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
              </label>
            )}
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <RetroButton className="retro-button-accent" disabled={busy} type="submit">{busy ? "Please wait..." : mode === "signin" ? "Sign In" : mode === "signup" ? "Create Account" : "Send Reset Link"}</RetroButton>
              {mode !== "forgot" && <RetroButton type="button" onClick={google}>G Continue with Google</RetroButton>}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px", fontSize: "12px", gap: "12px", flexWrap: "wrap" }}>
              <button style={{ border: 0, background: "none", textDecoration: "underline", padding: 0 }} type="button" onClick={() => { setAuthMethod("choice"); setMode("signin"); }}>Back</button>
              <button style={{ border: 0, background: "none", textDecoration: "underline", padding: 0 }} type="button" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Already have an account? Sign in" : "Create new account"}</button>
              <button style={{ border: 0, background: "none", textDecoration: "underline", padding: 0 }} type="button" onClick={() => setMode(mode === "forgot" ? "signin" : "forgot")}>{mode === "forgot" ? "Back to sign in" : "Forgot password?"}</button>
            </div>
          </form>
        </div>
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
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
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
      <div className="pixel-icon-box">
        {meta.renderIcon()}
      </div>
      <div className="icon-label-pill">
        {meta.label}
      </div>
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
      focus: { x: 230, y: 55 },
      timer: { x: 670, y: 55 },
      notes: { x: 280, y: 80 },
      reading: { x: 250, y: 70 },
      budget: { x: 270, y: 65 },
      archive: { x: 290, y: 75 },
      display: { x: 310, y: 90 },
      account: { x: 330, y: 85 },
      trash: { x: 350, y: 100 },
    };
    return offsets[id] ?? { x: 240, y: 70 };
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
  const todays = tasks.filter((t) => t.task_date === today()).sort((a, b) => a.priority - b.priority);
  const recommended = todays.filter((t) => t.is_recommended).slice(0, 3);
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
      <div className="focus-hero-card">
        <div className="focus-header">
          <span className="eyebrow">DAILY PRIORITY LOCK</span>
          <h2>Daily 3 Focus</h2>
        </div>
        <div className="three-meter-badge">
          <div className="three-meter">
            {recommended.filter((t) => t.completed_at).length}<span>/3</span>
          </div>
          <span style={{ fontSize: "11px", color: "var(--muted-ink)" }}>Completed</span>
        </div>
      </div>

      <div>
        <div className="section-label">
          <span>PRIMARY GOALS FOR TODAY</span>
          <span>{recommended.length}/3 locked</span>
        </div>
        <div className="task-list-well">
          {todays.map((task, i) => (
            <div className={`task-row ${task.is_active ? "active-task" : ""}`} key={task.id}>
              <button className="pixel-check" onClick={() => toggle(task)} aria-label={`Complete ${task.title}`}>
                {task.completed_at && <Check size={14} />}
              </button>
              <span className={task.completed_at ? "done" : ""}>
                {task.is_recommended && <b className="task-priority-tag">0{i + 1}</b>}
                {task.title}
              </span>
              {!task.completed_at && (
                <RetroButton size="sm" className={task.is_active ? "retro-button-accent" : ""} onClick={() => activate(task)} disabled={task.is_active}>
                  {task.is_active ? "ACTIVE" : "FOCUS"}
                </RetroButton>
              )}
              <button className="bare-icon" onClick={() => remove(task)} aria-label={`Delete ${task.title}`}>
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <form className="inline-add" onSubmit={(e) => { e.preventDefault(); void addTask(); }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={recommended.length < 3 ? "Add priority (up to 3)..." : "Add bonus task..."}
          maxLength={240}
        />
        <RetroButton className="retro-button-accent" type="submit" size="icon"><Plus size={14} /></RetroButton>
      </form>

      {allDone && !victoryDismissed && (
        <div className="victory-dialog">
          <div className="confetti">✦ ▪ ✧ ▪ ✦</div>
          <strong>MISSION COMPLETE!</strong>
          <span style={{ fontSize: "13px" }}>All 3 primary priorities are finished.</span>
          <RetroButton className="retro-button-accent" onClick={() => setVictoryDismissed(true)}>OK</RetroButton>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   WINAMP TIMER APP (Exact Match to Reference Winamp)
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
            {mode === "up" ? "1. STOPWATCH (COUNT UP)" : mode === "25" ? "1. POMODORO BLOCK (25:00)" : "1. DEEP WORK BLOCK (50:00)"}
          </div>
          <div className="winamp-badges">
            <span className="winamp-badge active">192 kbps</span>
            <span className="winamp-badge active">44 kHz</span>
            <span className="winamp-badge">mono</span>
            <span className="winamp-badge active winamp-badge-pink">stereo</span>
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
          <button className="winamp-btn" onClick={() => reset()} title="Rewind / Restart"><Rewind size={14} /></button>
          <button className="winamp-btn" onClick={() => setRunning(true)} title="Play"><Play size={14} /></button>
          <button className="winamp-btn" onClick={() => setRunning(false)} title="Pause"><Pause size={14} /></button>
          <button className="winamp-btn" onClick={() => { setRunning(false); reset(); }} title="Stop"><Square size={12} /></button>
          <button className="winamp-btn" onClick={() => reset()} title="Fast Forward"><FastForward size={14} /></button>
        </div>
        <button className="winamp-toggle-btn" onClick={() => reset()} title="Reset">
          <RotateCcw size={12} /> RESET
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
      <textarea
        className="notepad-textarea"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={save}
        placeholder="Type scratch notes before they float away..."
      />
      <div className="notepad-statusbar">
        <span>{text.length} characters</span>
        <span>{saved}</span>
        <RetroButton size="sm" className="retro-button-accent" onClick={sticky}>Tear off sticky note</RetroButton>
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
            <span style={{ fontSize: "12px" }}>Reading progress: {selected.progress}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={selected.progress}
            onChange={(e) => progress(selected, Number(e.target.value))}
          />
          <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
            <RetroButton className="retro-button-accent" onClick={() => window.open(selected.url, "_blank", "noopener,noreferrer")}>
              <ExternalLink size={12} /> Open Link
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
          <span style={{ fontSize: "11px", letterSpacing: "0.5px" }}>DAILY BURN ALLOWANCE</span>
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
        <input aria-label="Amount" type="number" step="0.01" placeholder="0.00" style={{ width: "90px" }} value={amount} onChange={(e) => setAmount(e.target.value)} />
        <RetroButton className="retro-button-accent" type="submit">Log Spend</RetroButton>
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
        <input style={{ border: "1px solid #1a1a1a", padding: "4px 8px" }} type="date" max={today()} value={date} onChange={(e) => setDate(e.target.value)} />
        <RetroButton className="retro-button-accent" onClick={download}><Download size={14} /> Export Floppy (.txt)</RetroButton>
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
      <div className="account-avatar"><AccountIcon /></div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <span className="eyebrow">SIGNED IN AS</span>
        <h2 style={{ margin: 0, fontSize: "20px" }}>{displayName}</h2>
        <p style={{ margin: 0, color: "var(--muted-ink)", fontSize: "13px" }}>{session.user.email}</p>
        <label style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "13px" }}>
          Display Name
          <input
            style={{ border: "1px solid #1a1a1a", padding: "4px 8px" }}
            value={displayName}
            maxLength={60}
            onChange={(e) => setDisplayName(e.target.value)}
            onBlur={() => supabase.from("profiles").update({ display_name: displayName }).eq("user_id", session.user.id)}
          />
        </label>
        <RetroButton className="retro-button-accent" onClick={onSignOut}><LogOut size={14} /> Sign Out</RetroButton>
      </div>
    </div>
  );
}

/* ============================================================
   DRAGGABLE STICKY NOTE COMPONENT
   ============================================================ */
function DraggableSticky({
  sticky,
  onUpdateContent,
  onDelete,
  onMoveEnd,
}: {
  sticky: Tables<"stickies">;
  onUpdateContent: (content: string) => void;
  onDelete: () => void;
  onMoveEnd: (x: number, y: number) => void;
}) {
  const [pos, setPos] = useState({ x: sticky.position_x, y: sticky.position_y });
  const dragRef = useRef<{ startX: number; startY: number; startPX: number; startPY: number; moved: boolean } | null>(null);

  useEffect(() => {
    setPos({ x: sticky.position_x, y: sticky.position_y });
  }, [sticky.position_x, sticky.position_y]);

  function handlePointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).tagName === "BUTTON") return;
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPX: pos.x, startPY: pos.y, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      setPos({
        x: Math.max(10, dragRef.current.startPX + dx),
        y: Math.max(34, dragRef.current.startPY + dy),
      });
    }
  }

  function handlePointerUp() {
    if (dragRef.current?.moved) {
      onMoveEnd(pos.x, pos.y);
    }
    dragRef.current = null;
  }

  return (
    <div
      className={`sticky sticky-${sticky.color}`}
      style={{ left: pos.x, top: pos.y, position: "absolute" }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className="sticky-drag-handle"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <span className="sticky-pin">▪ STICKY</span>
        <button
          className="sticky-close-btn"
          onClick={onDelete}
          aria-label="Delete note"
        >
          ×
        </button>
      </div>
      <textarea
        value={sticky.content}
        onChange={(e) => onUpdateContent(e.target.value)}
        placeholder="Type note..."
      />
    </div>
  );
}

/* ============================================================
   DRAGGABLE HOMESCREEN CLOCK WIDGET
   ============================================================ */
function DraggableHomescreenClock({ time }: { time: Date }) {
  const [pos, setPos] = useState(() => ({
    x: typeof window !== "undefined" ? Math.max(20, window.innerWidth - 270) : 800,
    y: 55,
  }));
  const dragRef = useRef<{ startX: number; startY: number; startPX: number; startPY: number; moved: boolean } | null>(null);

  function handlePointerDown(e: React.PointerEvent) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = { startX: e.clientX, startY: e.clientY, startPX: pos.x, startPY: pos.y, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      dragRef.current.moved = true;
    }
    if (dragRef.current.moved) {
      setPos({
        x: Math.max(10, Math.min(window.innerWidth - 220, dragRef.current.startPX + dx)),
        y: Math.max(34, Math.min(window.innerHeight - 120, dragRef.current.startPY + dy)),
      });
    }
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <div
      className="homescreen-clock-widget"
      style={{ left: pos.x, top: pos.y, right: "auto" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="homescreen-clock-time">
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true })}
      </div>
      <div className="homescreen-clock-date">
        {time.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN DAYBREAK OS COMPONENT
   ============================================================ */
function DaybreakOS({ session }: { session: Session }) {
  const [open, setOpen] = useState<AppId[]>([]);
  const [active, setActive] = useState<AppId | null>(null);
  const [minimized, setMinimized] = useState<AppId[]>([]);
  const [maximized, setMaximized] = useState<AppId[]>([]);
  const [selected, setSelected] = useState<AppId | null>(null);
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
  const [balloon, setBalloon] = useState("Right-click anywhere for context menu, or use the bottom dock.");

  // Draggable icons position state
  const [iconPositions, setIconPositions] = useState<Record<AppId, { x: number; y: number }>>(() => ({ ...ICON_DEFAULTS }));

  // Right-click context menu state
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; visible: boolean }>({ x: 0, y: 0, visible: false });

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
    setContextMenu({ x: 0, y: 0, visible: false });
  }

  function handleDockClick(id: AppId) {
    sound();
    if (!open.includes(id)) {
      launch(id);
    } else if (minimized.includes(id)) {
      setMinimized((v) => v.filter((x) => x !== id));
      setActive(id);
    } else if (active === id) {
      setMinimized((v) => [...v, id]);
    } else {
      setActive(id);
    }
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
    if (active === id) {
      setActive(null);
    }
  }

  async function createStickyAt(x: number, y: number) {
    sound();
    await supabase.from("stickies").insert({
      user_id: session.user.id,
      content: "New note...",
      color: "yellow",
      position_x: Math.max(20, Math.min(x, window.innerWidth - 200)),
      position_y: Math.max(50, Math.min(y, window.innerHeight - 200)),
    });
    setContextMenu({ x: 0, y: 0, visible: false });
    refresh();
  }

  async function updateStickyContent(id: string, content: string) {
    setStickies((v) => v.map((x) => (x.id === id ? { ...x, content } : x)));
    await supabase.from("stickies").update({ content }).eq("id", id);
  }

  async function deleteSticky(id: string) {
    sound("trash");
    setStickies((v) => v.filter((x) => x.id !== id));
    await supabase.from("stickies").delete().eq("id", id);
  }

  async function moveSticky(id: string, x: number, y: number) {
    await supabase.from("stickies").update({ position_x: x, position_y: y }).eq("id", id);
  }

  function handleContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setContextMenu({
      x: Math.min(e.clientX, window.innerWidth - 220),
      y: Math.min(e.clientY, window.innerHeight - 300),
      visible: true,
    });
  }

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
      <div style={{ textAlign: "center", padding: "20px" }}>
        <div style={{ width: "60px", height: "60px", margin: "0 auto 8px" }}><BinIcon /></div>
        <h3 style={{ fontSize: "16px", margin: "0 0 6px" }}>Recycle Bin</h3>
        <p style={{ fontSize: "13px" }}>{balloon.includes("deleted") ? "1 crumpled item in bin" : "The bin is empty."}</p>
        <RetroButton className="retro-button-accent" onClick={() => { sound("trash"); setBalloon("Recycle Bin emptied with a crunch."); }}>Empty Bin</RetroButton>
      </div>
    );
  };

  const [clockTime, setClockTime] = useState(new Date());
  useEffect(() => {
    const id = window.setInterval(() => setClockTime(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const dockApps = Array.from(new Set([...DOCK_PINNED_APPS, ...open.filter((id) => id !== "trash")]));

  return (
    <main
      className={`desktop wallpaper-${wallpaper}`}
      onClick={() => { setSelected(null); setContextMenu({ x: 0, y: 0, visible: false }); }}
      onContextMenu={handleContextMenu}
    >
      {/* Top Menu Bar (Clean System Status Header) */}
      <header className="top-navbar" onClick={(e) => e.stopPropagation()}>
        <div className="top-navbar-left">
          <div className="top-brand">
            <span>daybreak</span>
          </div>
        </div>
        <div className="top-navbar-right">
          <button className="top-sound-btn" onClick={toggleMute} aria-label={muted ? "Unmute sound" : "Mute sound"}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <time className="top-clock-pill">
            {clockTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })} - {clockTime.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
          </time>
        </div>
      </header>

      {/* Draggable Homescreen Digital Clock Widget */}
      <DraggableHomescreenClock time={clockTime} />

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

      {/* Draggable Desktop Stickies */}
      {stickies.map((s) => (
        <DraggableSticky
          key={s.id}
          sticky={s}
          onUpdateContent={(content) => updateStickyContent(s.id, content)}
          onDelete={() => deleteSticky(s.id)}
          onMoveEnd={(x, y) => moveSticky(s.id, x, y)}
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
          <button className="balloon-tip-close" onClick={() => setBalloon("")}><X size={14} /></button>
          <b>Daybreak Tip</b>
          <p style={{ margin: "2px 0 0" }}>{balloon}</p>
        </div>
      )}

      {/* Desktop Right-Click Context Menu (Desktop Actions Only) */}
      {contextMenu.visible && (
        <div
          className="desktop-context-menu"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="context-menu-item" onClick={() => createStickyAt(contextMenu.x, contextMenu.y)}>
            <span className="menu-icon"><StickyMenuIcon /></span>
            <span>New Sticky Note</span>
          </button>
          <button className="context-menu-item" onClick={() => launch("display")}>
            <span className="menu-icon"><DisplayIcon /></span>
            <span>Display Properties...</span>
          </button>
          <div className="context-menu-divider" />
          <button className="context-menu-item" onClick={() => { setIconPositions({ ...ICON_DEFAULTS }); setContextMenu({ x: 0, y: 0, visible: false }); sound(); }}>
            <span className="menu-icon"><AlignMenuIcon /></span>
            <span>Align Icons</span>
          </button>
          <button className="context-menu-item" onClick={() => { refresh(); setContextMenu({ x: 0, y: 0, visible: false }); sound(); }}>
            <span className="menu-icon"><RefreshMenuIcon /></span>
            <span>Refresh Desktop</span>
          </button>
        </div>
      )}

      {/* macOS-style Floating Retro Bottom Dock */}
      <nav className="macos-dock" onClick={(e) => e.stopPropagation()}>
        {dockApps.map((id) => {
          const meta = APP_META[id];
          const isOpen = open.includes(id);
          const isCurrentActive = active === id && isOpen && !minimized.includes(id);
          return (
            <button
              key={id}
              className="dock-item"
              onClick={() => handleDockClick(id)}
              aria-label={meta.label}
            >
              <div className="dock-icon-wrapper">
                {meta.renderIcon()}
              </div>
              {isOpen && (
                <span className={`dock-active-dot ${isCurrentActive ? "focused" : ""}`} />
              )}
              <span className="dock-tooltip">{meta.label}</span>
            </button>
          );
        })}

        <div className="dock-divider" />

        {/* Recycle Bin at the end of Dock (like macOS Trash) */}
        <button
          className="dock-item"
          onClick={() => handleDockClick("trash")}
          aria-label="Recycle Bin"
        >
          <div className="dock-icon-wrapper">
            <BinIcon />
          </div>
          {open.includes("trash") && (
            <span className={`dock-active-dot ${active === "trash" && !minimized.includes("trash") ? "focused" : ""}`} />
          )}
          <span className="dock-tooltip">Recycle Bin</span>
        </button>
      </nav>

      {/* Pocket OS Mobile Tabs */}
      <nav className="pocket-tabs">
        {(["focus", "timer", "notes", "budget"] as AppId[]).map((id) => {
          const meta = APP_META[id];
          return (
            <button key={id} className={`pocket-tab-btn ${active === id ? "active" : ""}`} onClick={() => launch(id)}>
              <div style={{ width: "22px", height: "22px" }}>{meta.renderIcon()}</div>
              <span>{meta.label}</span>
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
      <main className="boot-screen wallpaper-pastel-cyber" style={{ display: "grid", placeItems: "center", minHeight: "100vh" }}>
        <div style={{ textAlign: "center", color: "#ffffff", textShadow: "2px 2px 0 #1a1a1a" }}>
          <h1 style={{ fontSize: "36px", margin: 0 }}>daybreak</h1>
          <span style={{ fontSize: "14px" }}>loading personal os...</span>
        </div>
      </main>
    );
  }

  return session ? <DaybreakOS session={session} /> : <LoginWindow />;
}