import {
  Activity,
  Bell,
  Bot,
  Box,
  Building2,
  Check,
  ChevronDown,
  CircleHelp,
  ClipboardCheck,
  CloudSun,
  Command,
  FileBarChart,
  HardHat,
  LayoutDashboard,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Sun,
  Users,
  Wrench,
  X,
  Zap
} from "lucide-react";
import {
  type Dispatch,
  type FormEvent,
  type PropsWithChildren,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { sites } from "../data/demo";
import type { Alert, ChatMessage, Site, Task, ViewId } from "../types";
import { activeAlerts, cn } from "../lib/utils";
import { Panel, RiskBadge, StatusDot } from "./Primitives";

const navigation: Array<{
  id: ViewId;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "overview", label: "Command center", icon: LayoutDashboard },
  { id: "twin", label: "Live digital twin", icon: Box },
  { id: "safety", label: "Safety intelligence", icon: ShieldCheck },
  { id: "sustainability", label: "Carbon & circularity", icon: CloudSun },
  { id: "workforce", label: "Workforce", icon: Users },
  { id: "assets", label: "Tools & assets", icon: Wrench },
  { id: "reports", label: "Impact reports", icon: FileBarChart }
];

type ShellProps = PropsWithChildren<{
  view: ViewId;
  setView: Dispatch<SetStateAction<ViewId>>;
  selectedSite: Site;
  setSelectedSiteId: (id: string) => void;
  alerts: Alert[];
  acknowledgeAlert: (id: string) => void;
  tasks: Task[];
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
  lastUpdated: Date;
  online: boolean;
  onCreateTask: (task: Omit<Task, "id" | "completed">) => void;
}>;

export function Shell({
  children,
  view,
  setView,
  selectedSite,
  setSelectedSiteId,
  alerts,
  acknowledgeAlert,
  theme,
  setTheme,
  lastUpdated,
  online,
  onCreateTask
}: ShellProps) {
  const [mobileNav, setMobileNav] = useState(false);
  const [siteMenu, setSiteMenu] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [taskOpen, setTaskOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPaletteOpen(true);
      }
      if (event.key === "Escape") {
        setPaletteOpen(false);
        setNotificationsOpen(false);
        setTaskOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openAlerts = activeAlerts(alerts);
  const title = navigation.find((item) => item.id === view)?.label ?? "Civora";

  const navigate = (id: ViewId) => {
    setView(id);
    setMobileNav(false);
    setPaletteOpen(false);
  };

  return (
    <div className={cn("app-shell", mobileNav && "is-nav-open")}>
      <aside className="sidebar" aria-label="Primary navigation">
        <div className="brand">
          <span className="brand__mark">C</span>
          <div>
            <strong>CIVORA</strong>
            <small>SITE INTELLIGENCE</small>
          </div>
        </div>

        <button
          type="button"
          className="site-switcher"
          onClick={() => setSiteMenu((current) => !current)}
          aria-expanded={siteMenu}
        >
          <span className="site-switcher__icon">
            <Building2 size={17} />
          </span>
          <span>
            <small>ACTIVE PROJECT</small>
            <strong>{selectedSite.name}</strong>
          </span>
          <ChevronDown size={15} />
        </button>
        {siteMenu && (
          <div className="site-menu">
            {sites.map((site) => (
              <button
                type="button"
                key={site.id}
                className={cn(site.id === selectedSite.id && "is-active")}
                onClick={() => {
                  setSelectedSiteId(site.id);
                  setSiteMenu(false);
                  setToast(`Switched to ${site.name}`);
                }}
              >
                <span>{site.name}</span>
                <small>{site.phase}</small>
              </button>
            ))}
          </div>
        )}

        <nav className="nav-list">
          <p className="nav-label">OPERATIONS</p>
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <button
                type="button"
                key={item.id}
                className={cn("nav-item", view === item.id && "is-active")}
                onClick={() => navigate(item.id)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "safety" && openAlerts.length > 0 && (
                  <span className="nav-item__count">{openAlerts.length}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar__bottom">
          <Panel className="impact-mini">
            <span className="impact-mini__icon">
              <Sparkles size={16} />
            </span>
            <div>
              <small>MONTHLY IMPACT</small>
              <strong>42.8 tCO2e avoided</strong>
              <span>Top 12% of Civora sites</span>
            </div>
          </Panel>
          <button type="button" className="profile">
            <span className="profile__avatar">NR</span>
            <span>
              <strong>Nadia Rahman</strong>
              <small>Site Safety Lead</small>
            </span>
            <ChevronDown size={14} />
          </button>
        </div>
      </aside>

      <div className="app-body">
        <header className="topbar">
          <div className="topbar__left">
            <button
              type="button"
              className="icon-button mobile-menu"
              onClick={() => setMobileNav((current) => !current)}
              aria-label="Toggle navigation"
            >
              {mobileNav ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <div className="topbar__title-row">
                <h1>{title}</h1>
                <span className="demo-pill">DEMO DATA</span>
              </div>
              <p>
                {selectedSite.location} <span>•</span> {selectedSite.phase}
              </p>
            </div>
          </div>
          <div className="topbar__actions">
            <div className="sync-state" title={`Updated ${lastUpdated.toLocaleTimeString()}`}>
              <StatusDot tone={online ? "green" : "amber"} pulse={online} />
              <span>{online ? "Live" : "Offline"}</span>
            </div>
            <button
              type="button"
              className="search-trigger"
              onClick={() => setPaletteOpen(true)}
            >
              <Search size={16} />
              <span>Search anything</span>
              <kbd>Ctrl K</kbd>
            </button>
            <button
              type="button"
              className="icon-button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="icon-button has-badge"
              onClick={() => setNotificationsOpen(true)}
              aria-label={`${openAlerts.length} active alerts`}
            >
              <Bell size={18} />
              {openAlerts.length > 0 && <span>{openAlerts.length}</span>}
            </button>
            <button type="button" className="primary-button" onClick={() => setTaskOpen(true)}>
              <Zap size={16} />
              Quick action
            </button>
          </div>
        </header>

        <main className="main-content">{children}</main>
      </div>

      <button
        type="button"
        className={cn("copilot-fab", copilotOpen && "is-active")}
        onClick={() => setCopilotOpen((current) => !current)}
        aria-label="Open Civora Copilot"
      >
        {copilotOpen ? <X size={21} /> : <Bot size={21} />}
        {!copilotOpen && <span>Ask Civora</span>}
      </button>

      {copilotOpen && (
        <Copilot
          alerts={alerts}
          site={selectedSite}
          onClose={() => setCopilotOpen(false)}
          onNavigate={navigate}
        />
      )}
      {notificationsOpen && (
        <NotificationDrawer
          alerts={alerts}
          onClose={() => setNotificationsOpen(false)}
          onAcknowledge={(id) => {
            acknowledgeAlert(id);
            setToast("Alert acknowledged and audit log updated");
          }}
          onViewAll={() => {
            setNotificationsOpen(false);
            navigate("safety");
          }}
        />
      )}
      {paletteOpen && (
        <CommandPalette
          onClose={() => setPaletteOpen(false)}
          onNavigate={navigate}
          onCreateTask={() => {
            setPaletteOpen(false);
            setTaskOpen(true);
          }}
          onOpenCopilot={() => {
            setPaletteOpen(false);
            setCopilotOpen(true);
          }}
          onToast={setToast}
        />
      )}
      {taskOpen && (
        <QuickActionModal
          onClose={() => setTaskOpen(false)}
          onSubmit={(task) => {
            onCreateTask(task);
            setTaskOpen(false);
            setToast("Action assigned and synced to the site plan");
          }}
        />
      )}
      {toast && (
        <div className="toast" role="status">
          <Check size={16} />
          {toast}
        </div>
      )}
      {mobileNav && <button className="nav-scrim" onClick={() => setMobileNav(false)} />}
    </div>
  );
}

function NotificationDrawer({
  alerts,
  onClose,
  onAcknowledge,
  onViewAll
}: {
  alerts: Alert[];
  onClose: () => void;
  onAcknowledge: (id: string) => void;
  onViewAll: () => void;
}) {
  return (
    <>
      <button className="drawer-scrim" onClick={onClose} aria-label="Close alerts" />
      <aside className="drawer" aria-label="Active alerts">
        <div className="drawer__header">
          <div>
            <p className="eyebrow">LIVE TRIAGE</p>
            <h2>Site alerts</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="drawer__summary">
          <div>
            <strong>{activeAlerts(alerts).length}</strong>
            <span>Active</span>
          </div>
          <div>
            <strong>{alerts.filter((alert) => alert.status === "acknowledged").length}</strong>
            <span>Acknowledged</span>
          </div>
          <div>
            <strong>4m 12s</strong>
            <span>Avg response</span>
          </div>
        </div>
        <div className="drawer__list">
          {alerts.map((alert) => (
            <article className="notification-card" key={alert.id}>
              <div className="notification-card__head">
                <RiskBadge level={alert.level} />
                <span>{alert.time}</span>
              </div>
              <h3>{alert.title}</h3>
              <p>{alert.detail}</p>
              <small>{alert.zone} • {alert.category}</small>
              {alert.status === "active" ? (
                <button type="button" onClick={() => onAcknowledge(alert.id)}>
                  <Check size={15} /> Acknowledge
                </button>
              ) : (
                <span className="acknowledged"><Check size={14} /> Acknowledged</span>
              )}
            </article>
          ))}
        </div>
        <button type="button" className="secondary-button drawer__footer" onClick={onViewAll}>
          Open safety intelligence
        </button>
      </aside>
    </>
  );
}

function CommandPalette({
  onClose,
  onNavigate,
  onCreateTask,
  onOpenCopilot,
  onToast
}: {
  onClose: () => void;
  onNavigate: (id: ViewId) => void;
  onCreateTask: () => void;
  onOpenCopilot: () => void;
  onToast: (message: string) => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => inputRef.current?.focus(), []);

  const commands = useMemo(
    () => [
      ...navigation.map((item) => ({
        id: item.id,
        label: item.label,
        detail: "Navigate workspace",
        icon: item.icon,
        action: () => onNavigate(item.id)
      })),
      {
        id: "new-task",
        label: "Create site action",
        detail: "Assign an operational task",
        icon: ClipboardCheck,
        action: onCreateTask
      },
      {
        id: "ask-ai",
        label: "Ask Civora Copilot",
        detail: "Explain risk or recommend an action",
        icon: Bot,
        action: onOpenCopilot
      },
      {
        id: "briefing",
        label: "Generate shift briefing",
        detail: "Create a multilingual toolbox talk",
        icon: HardHat,
        action: () => {
          onClose();
          onToast("Briefing drafted in five worker languages");
        }
      }
    ],
    [onClose, onCreateTask, onNavigate, onOpenCopilot, onToast]
  );

  const filtered = commands.filter((command) =>
    `${command.label} ${command.detail}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Command palette">
      <button className="modal-scrim" onClick={onClose} aria-label="Close command palette" />
      <div className="command-palette">
        <div className="command-palette__input">
          <Search size={19} />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search workspaces and actions..."
          />
          <kbd>ESC</kbd>
        </div>
        <div className="command-palette__list">
          <p className="nav-label">{query ? "RESULTS" : "SUGGESTED"}</p>
          {filtered.map((command) => {
            const Icon = command.icon;
            return (
              <button type="button" key={command.id} onClick={command.action}>
                <span><Icon size={18} /></span>
                <div>
                  <strong>{command.label}</strong>
                  <small>{command.detail}</small>
                </div>
                <Command size={14} />
              </button>
            );
          })}
          {filtered.length === 0 && (
            <div className="command-palette__empty">No command matches “{query}”</div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickActionModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (task: Omit<Task, "id" | "completed">) => void;
}) {
  const [title, setTitle] = useState("");
  const [owner, setOwner] = useState("Nadia");
  const [priority, setPriority] = useState<Task["priority"]>("medium");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), owner, priority, due: "Today, 16:00" });
  };

  return (
    <div className="modal-layer" role="dialog" aria-modal="true" aria-label="Create action">
      <button className="modal-scrim" onClick={onClose} aria-label="Close" />
      <form className="action-modal" onSubmit={submit}>
        <div className="action-modal__head">
          <div>
            <p className="eyebrow">QUICK ACTION</p>
            <h2>Assign site task</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <label>
          Action
          <input
            autoFocus
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="e.g. Inspect Loading Bay access route"
          />
        </label>
        <div className="form-grid">
          <label>
            Owner
            <select value={owner} onChange={(event) => setOwner(event.target.value)}>
              <option>Nadia</option>
              <option>Faris</option>
              <option>Mei Lin</option>
              <option>Arun</option>
            </select>
          </label>
          <label>
            Priority
            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value as Task["priority"])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </label>
        </div>
        <div className="action-modal__ai">
          <Sparkles size={16} />
          Civora will attach the live site context and track response time automatically.
        </div>
        <div className="action-modal__buttons">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button" disabled={!title.trim()}>
            Assign action
          </button>
        </div>
      </form>
    </div>
  );
}

function Copilot({
  alerts,
  site,
  onClose,
  onNavigate
}: {
  alerts: Alert[];
  site: Site;
  onClose: () => void;
  onNavigate: (id: ViewId) => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "cm-1",
      role: "assistant",
      text: `I am monitoring ${site.name}. The highest-priority issue is heat exposure in the MEP Corridor. I can explain the risk, model an intervention, or draft a toolbox briefing.`,
      time: "Now"
    }
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const critical = alerts.find((alert) => alert.level === "critical" && alert.status === "active");

  const respond = (question: string) => {
    const lower = question.toLowerCase();
    if (lower.includes("carbon") || lower.includes("emission")) {
      return "Civora projects a 19.4% embodied-carbon reduction versus the original baseline. The strongest next lever is moving tomorrow's concrete pour to the verified low-carbon batch, saving an estimated 8.7 tCO2e.";
    }
    if (lower.includes("tool") || lower.includes("asset")) {
      return "AG 4S-22 is the only tool outside its healthy vibration envelope. I recommend a 12-minute inspection before reuse; the remaining fleet is at 93% mean health with no predicted downtime today.";
    }
    if (lower.includes("brief") || lower.includes("worker")) {
      return "I drafted a 90-second heat-stress briefing in English, Bahasa Melayu, Tamil, Bengali, and Mandarin. It emphasizes hydration, 20-minute rotation intervals, and the new cooling station route.";
    }
    return critical
      ? "The heat-stress warning combines temperature, humidity, exposure duration, worker fatigue, and zone ventilation. Confidence is 92%. Deploying a cooling station and rotating six workers reduces modeled risk from critical to medium within 12 minutes."
      : "The site has no unresolved critical conditions. I recommend focusing on the Loading Bay PPE anomaly and the AG 4S-22 inspection next.";
  };

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean || thinking) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text: clean, time: "Now" }
    ]);
    setInput("");
    setThinking(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: crypto.randomUUID(), role: "assistant", text: respond(clean), time: "Now" }
      ]);
      setThinking(false);
    }, 650);
  };

  return (
    <aside className="copilot-panel" aria-label="Civora Copilot">
      <div className="copilot-panel__head">
        <span className="copilot-panel__mark"><Bot size={20} /></span>
        <div>
          <strong>Civora Copilot</strong>
          <small><StatusDot tone="green" pulse /> Grounded in live site data</small>
        </div>
        <button type="button" className="icon-button" onClick={onClose}>
          <X size={17} />
        </button>
      </div>
      <div className="copilot-panel__context">
        <Activity size={14} />
        Analyzing {zonesCount(site.id)} sensors • updated seconds ago
      </div>
      <div className="copilot-panel__messages">
        {messages.map((message) => (
          <div className={cn("chat-message", `chat-message--${message.role}`)} key={message.id}>
            {message.role === "assistant" && <Sparkles size={14} />}
            <div>
              <p>{message.text}</p>
              <small>{message.time}</small>
            </div>
          </div>
        ))}
        {thinking && (
          <div className="chat-message chat-message--assistant">
            <Sparkles size={14} />
            <div className="typing"><span /><span /><span /></div>
          </div>
        )}
      </div>
      <div className="copilot-panel__prompts">
        {["Explain top risk", "Find carbon savings", "Draft briefing"].map((prompt) => (
          <button key={prompt} type="button" onClick={() => send(prompt)}>{prompt}</button>
        ))}
      </div>
      <form
        className="copilot-panel__input"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about this site..."
        />
        <button type="submit" aria-label="Send" disabled={!input.trim()}>
          <Sparkles size={17} />
        </button>
      </form>
      <button type="button" className="copilot-panel__link" onClick={() => onNavigate("reports")}>
        <CircleHelp size={14} /> View model evidence & assumptions
      </button>
    </aside>
  );
}

function zonesCount(siteId: string) {
  if (siteId === "penang") return 84;
  if (siteId === "johor") return 126;
  return 148;
}
