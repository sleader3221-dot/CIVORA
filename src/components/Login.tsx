import { ShieldCheck, Sparkles } from "lucide-react";
import { type FormEvent, useState } from "react";

export function Login({ onLogin }: { onLogin: (user: string, role: string) => void }) {
  const [name, setName] = useState("Nadia Rahman");
  const [role, setRole] = useState("Site Safety Lead");
  const [loading, setLoading] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setTimeout(() => {
      onLogin(name.trim(), role);
    }, 1600);
  };

  return (
    <div className="login-page">
      <div className="login-page__canvas" />
      <div className="login-page__grid" />
      <div className="login-page__particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="login-page__particle" />
        ))}
      </div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-card__brand">
          <span className="login-card__brand-mark">C</span>
          <div>
            <strong>CIVORA</strong>
            <small>SITE INTELLIGENCE</small>
          </div>
        </div>
        <h1>Welcome to Civora</h1>
        <p>AI-powered construction safety, sustainability, and operations command center.</p>
        <div className="login-field">
          <label>Your name</label>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
        </div>
        <div className="login-field">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Site Safety Lead</option>
            <option>Tool Coordinator</option>
            <option>Site Engineer</option>
            <option>Project Manager</option>
            <option>HSE Officer</option>
          </select>
        </div>
        <div className="login-card__actions">
          {loading ? (
            <div className="login-card__loading">
              <i /><i /><i /> Authenticating & syncing site data...
            </div>
          ) : (
            <button type="submit" className="primary-button" disabled={!name.trim()}>
              <ShieldCheck size={18} /> Access command center
            </button>
          )}
        </div>
        <div className="login-card__hint">
          <Sparkles size={12} /> <strong>Prototype access:</strong> Civora operates with deterministic demo data. Production deployments connect live telemetry from site sensors, wearables, and BIM systems.
        </div>
      </form>
    </div>
  );
}
