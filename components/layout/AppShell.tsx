import Link from "next/link";
import {
  Activity,
  BarChart3,
  Blocks,
  CircleDollarSign,
  ClipboardCheck,
  Database,
  FileText,
  Gauge,
  GitBranch,
  HeartPulse,
  Home,
  Network,
  RadioReceiver,
  ShieldCheck
} from "lucide-react";
import { DatabaseModeBadge } from "@/components/ui/DatabaseModeBadge";

const groups = [
  {
    label: "Product",
    items: [
      { href: "/", label: "Home", icon: Home },
      { href: "/demo", label: "Judge Demo", icon: Gauge },
      { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { href: "/ingest", label: "Ingest API", icon: RadioReceiver }
    ]
  },
  {
    label: "Operations",
    items: [
      { href: "/events", label: "Events", icon: Activity },
      { href: "/cases", label: "Cases", icon: ClipboardCheck },
      { href: "/entities", label: "Entities", icon: Network },
      { href: "/ledger", label: "Ledger", icon: GitBranch },
      { href: "/reports", label: "Reports", icon: FileText }
    ]
  },
  {
    label: "Submission",
    items: [
      { href: "/architecture", label: "Architecture", icon: Database },
      { href: "/pricing", label: "Pricing", icon: CircleDollarSign },
      { href: "/system-health", label: "System Health", icon: HeartPulse },
      { href: "/submission", label: "Submission", icon: Blocks }
    ]
  }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link href="/" className="brand" aria-label="ProofPilot AI home">
          <span className="brand-mark">P</span>
          <span>
            <strong>ProofPilot AI</strong>
            <span>Fraud operations OS</span>
          </span>
        </Link>
        {groups.map((group) => (
          <nav className="nav-section" key={group.label} aria-label={group.label}>
            <p className="nav-label">{group.label}</p>
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link className="nav-link" href={item.href} key={item.href}>
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ))}
        <div className="sidebar-card">
          <ShieldCheck size={18} />
          <p>
            Built for H0 judges: Vercel frontend, DynamoDB raw events, Aurora DSQL workflow system
            of record, tamper-evident evidence ledger.
          </p>
        </div>
      </aside>
      <main className="main">
        <header className="topbar">
          <div className="topbar-title">
            <strong>Northstar Pay demo workspace</strong>
            <span>No login friction. Safe synthetic data. Server-side AWS adapters.</span>
          </div>
          <div className="topbar-actions">
            <DatabaseModeBadge />
            <Link className="button primary" href="/demo">Launch Judge Demo</Link>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
