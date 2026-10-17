import { startLogin } from "@/const";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2, KeyRound, Mail, ShieldCheck, UserPlus } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function Login() {
  const [, setLocation] = useLocation();
  const begin = (message: string) => {
    try { startLogin(); } catch { toast.error("Account login is not configured in this preview"); }
    if (message) toast.info(message);
  };
  return <div className="login-page"><header className="login-header"><button className="brand-lockup" onClick={() => setLocation("/")}><span className="brand-mark"><span /><span /></span><span className="brand-name">SceneSet</span><span className="beta-badge">BETA</span></button><button className="text-button" onClick={() => setLocation("/")}><ArrowLeft size={14} />Back to home</button></header><main className="login-main"><div className="login-card"><div className="login-mark"><span className="brand-mark"><span /><span /></span></div><span className="eyebrow">YOUR EVENT OPERATIONS DESK</span><h1>Pick up where the plan left off.</h1><p>Use your Manus account to sign in, create a new SceneSet workspace or recover access.</p><Button size="lg" className="full-button" onClick={() => begin("")}>Continue with Manus <ArrowRight size={16} /></Button><div className="login-divider"><span>Account actions</span></div><div className="login-actions"><button onClick={() => begin("New accounts are created through the Manus sign-up flow.")}><UserPlus size={16} /><span><strong>Create an account</strong><small>Start a new workspace</small></span><ArrowRight size={14} /></button><button onClick={() => begin("Password recovery is handled securely by Manus.")}><KeyRound size={16} /><span><strong>Reset your password</strong><small>Recover your Manus account</small></span><ArrowRight size={14} /></button></div><div className="login-note"><ShieldCheck size={15} /><span>SceneSet never stores your password. Account security stays with Manus OAuth.</span></div></div><div className="login-side"><div className="login-side-kicker"><span className="live-dot" />A CALMER WAY TO PRODUCE</div><h2>Plan the details.<br /><em>Protect the feeling.</em></h2><div className="login-side-list"><span><CheckCircle2 size={15} />One shared event workspace</span><span><CheckCircle2 size={15} />Readiness before the rush</span><span><CheckCircle2 size={15} />A clear handoff for the day-of</span></div></div></main></div>;
}
