import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({ meta: [
    { title: "Reset Password | Daybreak" },
    { name: "description", content: "Choose a new password for your Daybreak personal OS." },
    { property: "og:title", content: "Reset Password | Daybreak" },
    { property: "og:description", content: "Choose a new password for your Daybreak personal OS." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
  ]}), component: ResetPassword,
});

function ResetPassword(){const [password,setPassword]=useState(""),[status,setStatus]=useState("Checking recovery link..."),[ready,setReady]=useState(false);useEffect(()=>{const recovery=window.location.hash.includes("type=recovery")||window.location.search.includes("type=recovery");supabase.auth.getSession().then(({data})=>{setReady(Boolean(data.session)&&recovery);setStatus(Boolean(data.session)&&recovery?"Enter your new password.":"This recovery link is invalid or has expired.")})},[]);async function submit(e:React.FormEvent){e.preventDefault();const {error}=await supabase.auth.updateUser({password});setStatus(error?error.message:"Password changed. You can return to Daybreak.");}return <main className="boot-screen wallpaper-vintage-lavender"><section className="os-window login-window"><div className="titlebar"><span>Daybreak Password Recovery</span></div><form className="reset-form" onSubmit={submit}><h1>Set new password</h1><p>{status}</p>{ready&&<label>New password<input type="password" minLength={6} required value={password} onChange={e=>setPassword(e.target.value)}/></label>}<div><Button className="retro-button" type="submit" disabled={!ready}>Update Password</Button><Button className="retro-button" asChild><Link to="/">Return Home</Link></Button></div></form></section></main>}