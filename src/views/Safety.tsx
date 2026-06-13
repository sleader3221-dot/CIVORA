import {
  AlertTriangle,
  BrainCircuit,
  Camera,
  Check,
  ChevronRight,
  CircleCheckBig,
  ClipboardPlus,
  Eye,
  FileCheck2,
  Flame,
  HardHat,
  Languages,
  MapPin,
  Radio,
  ShieldCheck,
  Siren,
  Sparkles,
  ThermometerSun,
  TimerReset,
  TriangleAlert,
  Users,
  X
} from "lucide-react";
import { type FormEvent, useMemo, useState } from "react";
import { safetyMatrix } from "../data/demo";
import type { Alert, RiskLevel, Zone } from "../types";
import { activeAlerts, cn, riskRank } from "../lib/utils";
import { Panel, ProgressBar, RiskBadge, SectionHeader, StatusDot } from "../components/Primitives";

export function Safety({
  alerts,
  zones,
  acknowledgeAlert,
  addIncident
}: {
  alerts: Alert[];
  zones: Zone[];
  acknowledgeAlert: (id: string) => void;
  addIncident: (alert: Alert) => void;
}) {
  const [filter, setFilter] = useState<"all" | RiskLevel>("all");
  const [incidentOpen, setIncidentOpen] = useState(false);
  const [drillActive, setDrillActive] = useState(false);
  const [briefingGenerated, setBriefingGenerated] = useState(false);
  const [ppeScan, setPpeScan] = useState(false);
  const [modelCardOpen, setModelCardOpen] = useState(false);

  const filtered = useMemo(
    () =>
      [...alerts]
        .filter((alert) => filter === "all" || alert.level === filter)
        .sort((a, b) => riskRank[b.level] - riskRank[a.level]),
    [alerts, filter]
  );

  return (
    <div className="workspace safety-workspace">
      <div className="workspace-intro">
        <div>
          <p className="eyebrow">PREDICT • PREVENT • PROTECT</p>
          <h2>Safety that acts before the incident.</h2>
          <p>
            Explainable risk scoring combines environment, equipment, location, and human factors
            without replacing the safety professional.
          </p>
        </div>
        <div className="intro-actions">
          <button type="button" className="secondary-button" onClick={() => setDrillActive(true)}>
            <Siren size={16} /> Run emergency drill
          </button>
          <button type="button" className="primary-button" onClick={() => setIncidentOpen(true)}>
            <ClipboardPlus size={16} /> Report observation
          </button>
        </div>
      </div>

      <div className="safety-score-grid">
        <Panel className="safety-score-card">
          <div className="safety-score-card__ring">
            <svg viewBox="0 0 120 120" aria-hidden="true">
              <circle cx="60" cy="60" r="50" />
              <circle cx="60" cy="60" r="50" pathLength="100" strokeDasharray="87 100" />
            </svg>
            <div><strong>87</strong><span>Safety score</span></div>
          </div>
          <div>
            <span className="positive"><CircleCheckBig size={15} /> +3.2 this week</span>
            <p>Strong controls overall. Heat exposure is the primary residual risk.</p>
          </div>
        </Panel>
        <Panel className="safety-stat">
          <span><TimerReset size={19} /></span>
          <div><small>SAFE WORK HOURS</small><strong>18,420</strong><p>34 days without LTI</p></div>
        </Panel>
        <Panel className="safety-stat">
          <span><Eye size={19} /></span>
          <div><small>PROACTIVE CATCHES</small><strong>126</strong><p>91% closed in one shift</p></div>
        </Panel>
        <Panel className="safety-stat">
          <span><BrainCircuit size={19} /></span>
          <div><small>MODEL PRECISION</small><strong>92.6%</strong><p>Last 30-day validation</p></div>
        </Panel>
      </div>

      <div className="safety-main-grid">
        <Panel className="risk-register">
          <SectionHeader
            eyebrow="LIVE RISK REGISTER"
            title={`${activeAlerts(alerts).length} conditions need attention`}
            action={
              <div className="risk-filter">
                {(["all", "critical", "high", "medium"] as const).map((level) => (
                  <button
                    type="button"
                    key={level}
                    className={cn(filter === level && "is-active")}
                    onClick={() => setFilter(level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
            }
          />
          <div className="risk-register__list">
            {filtered.map((alert) => (
              <article className={cn("risk-item", alert.status !== "active" && "is-acknowledged")} key={alert.id}>
                <div className={cn("risk-item__icon", `risk-item__icon--${alert.level}`)}>
                  {alert.category === "PPE" ? <HardHat size={19} /> :
                    alert.category === "Environment" ? <ThermometerSun size={19} /> :
                      <AlertTriangle size={19} />}
                </div>
                <div className="risk-item__content">
                  <div>
                    <RiskBadge level={alert.level} />
                    <span>{alert.time}</span>
                  </div>
                  <h3>{alert.title}</h3>
                  <p>{alert.detail}</p>
                  <span><MapPin size={13} /> {alert.zone} • {alert.category}</span>
                </div>
                {alert.status === "active" ? (
                  <button type="button" className="risk-item__action" onClick={() => acknowledgeAlert(alert.id)}>
                    Respond <ChevronRight size={15} />
                  </button>
                ) : (
                  <span className="risk-item__done"><Check size={15} /> Logged</span>
                )}
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="risk-explain">
          <SectionHeader eyebrow="EXPLAINABLE AI" title="Why heat risk is critical" />
          <div className="explain-confidence">
            <span><Sparkles size={16} /> Model confidence</span>
            <strong>92%</strong>
          </div>
          <div className="factor-list">
            <div>
              <span>WBGT heat index</span><strong>35%</strong>
              <ProgressBar value={92} tone="red" />
            </div>
            <div>
              <span>Exposure duration</span><strong>26%</strong>
              <ProgressBar value={74} tone="amber" />
            </div>
            <div>
              <span>Ventilation rate</span><strong>18%</strong>
              <ProgressBar value={58} tone="amber" />
            </div>
            <div>
              <span>Worker fatigue</span><strong>13%</strong>
              <ProgressBar value={46} tone="cyan" />
            </div>
            <div>
              <span>Task intensity</span><strong>8%</strong>
              <ProgressBar value={31} tone="lime" />
            </div>
          </div>
          <div className="explain-note">
            <ShieldCheck size={17} />
            <p><strong>Human-in-the-loop:</strong> Recommendations require supervisor approval and remain auditable.</p>
          </div>
          <button type="button" className="secondary-button full-button" onClick={() => setModelCardOpen(true)}>Open model card</button>
        </Panel>
      </div>

      <div className="safety-secondary-grid">
        <Panel className="risk-matrix-card">
          <SectionHeader eyebrow="RISK LANDSCAPE" title="Likelihood × impact" />
          <div className="risk-matrix-layout">
            <div className="matrix">
              {[5, 4, 3, 2, 1].map((impact) =>
                [1, 2, 3, 4, 5].map((likelihood) => {
                  const score = impact * likelihood;
                  return (
                    <div
                      key={`${impact}-${likelihood}`}
                      className={cn(
                        score >= 16 ? "is-critical" :
                          score >= 10 ? "is-high" :
                            score >= 5 ? "is-medium" : "is-low"
                      )}
                    >
                      {safetyMatrix
                        .filter((risk) => risk.impact === impact && risk.likelihood === likelihood)
                        .map((risk) => <span key={risk.label} title={risk.label}>{risk.label.slice(0, 1)}</span>)}
                    </div>
                  );
                })
              )}
            </div>
            <div className="matrix-list">
              {safetyMatrix.map((risk) => (
                <div key={risk.label}>
                  <span>{risk.label}</span>
                  <strong className={risk.trend > 0 ? "negative" : "positive"}>
                    {risk.trend > 0 ? "+" : ""}{risk.trend}%
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="prevention-card">
          <SectionHeader eyebrow="PREVENTION AUTOMATION" title="Smart controls" />
          <button type="button" className="automation-item" onClick={() => setPpeScan(true)}>
            <span><Camera size={18} /></span>
            <div><strong>PPE vision check</strong><small>Scan an active work zone</small></div>
            <ChevronRight size={16} />
          </button>
          <button type="button" className="automation-item" onClick={() => setBriefingGenerated(true)}>
            <span><Languages size={18} /></span>
            <div><strong>Multilingual briefing</strong><small>Generate from current risks</small></div>
            <ChevronRight size={16} />
          </button>
          <button type="button" className="automation-item">
            <span><Radio size={18} /></span>
            <div><strong>Geofence controls</strong><small>2 restricted zones active</small></div>
            <ChevronRight size={16} />
          </button>
          <button type="button" className="automation-item">
            <span><FileCheck2 size={18} /></span>
            <div><strong>Permit-to-work</strong><small>11 of 12 permits verified</small></div>
            <ChevronRight size={16} />
          </button>
        </Panel>

        <Panel className="zone-watch-card">
          <SectionHeader eyebrow="ZONE WATCH" title="Environmental exposure" />
          {zones.slice().sort((a, b) => b.temperature - a.temperature).map((zone) => (
            <div className="zone-watch-row" key={zone.id}>
              <div>
                <strong>{zone.name}</strong>
                <span>{zone.workers} workers</span>
              </div>
              <div>
                <span>{zone.temperature}°C</span>
                <RiskBadge level={zone.risk} />
              </div>
            </div>
          ))}
        </Panel>
      </div>

      {modelCardOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-scrim" onClick={() => setModelCardOpen(false)} aria-label="Close" />
          <div className="action-modal" style={{ padding: 20, maxWidth: 500 }}>
            <div className="action-modal__head">
              <div><p className="eyebrow">EXPLAINABLE AI</p><h2>Safety model card</h2></div>
              <button type="button" className="icon-button" onClick={() => setModelCardOpen(false)}><X size={18} /></button>
            </div>
            <div style={{ marginTop: 12, fontSize: 8, lineHeight: 1.7, color: "var(--text-2)" }}>
              <p><strong style={{ color: "var(--text)" }}>Model:</strong> Civora Risk Ensemble v2.4</p>
              <p><strong style={{ color: "var(--text)" }}>Inputs:</strong> WBGT sensors, wearable vitals, zone occupancy, task registry, ventilation data</p>
              <p><strong style={{ color: "var(--text)" }}>Architecture:</strong> Gradient-boosted decision forest with SHAP explanations</p>
              <p><strong style={{ color: "var(--text)" }}>Validation:</strong> 92.6% precision over 30 days • 1.2% false positive rate</p>
              <p><strong style={{ color: "var(--text)" }}>Bias tested:</strong> Equalized odds across language groups and shift roles</p>
              <p><strong style={{ color: "var(--text)" }}>Human oversight:</strong> All critical recommendations require supervisor confirmation before dispatch</p>
            </div>
            <div className="action-modal__buttons">
              <button type="button" className="primary-button" onClick={() => setModelCardOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
      {incidentOpen && (
        <IncidentModal
          onClose={() => setIncidentOpen(false)}
          onSubmit={(alert) => {
            addIncident(alert);
            setIncidentOpen(false);
          }}
        />
      )}

      {drillActive && (
        <SafetyOverlay
          icon={<Siren size={28} />}
          eyebrow="EMERGENCY READINESS"
          title="Evacuation drill initiated"
          detail="Zone wardens have been notified. Muster progress is being tracked in real time."
          metrics={["112 / 113 accounted", "2m 18s elapsed", "1 assist requested"]}
          action="End drill"
          onClose={() => setDrillActive(false)}
        />
      )}

      {briefingGenerated && (
        <SafetyOverlay
          icon={<Languages size={28} />}
          eyebrow="AI TOOLBOX TALK"
          title="Briefing ready in 5 languages"
          detail="A 90-second briefing was generated from today's heat, PPE, and equipment risks."
          metrics={["English", "Bahasa Melayu", "Tamil", "Bengali", "Mandarin"]}
          action="Mark as delivered"
          onClose={() => setBriefingGenerated(false)}
        />
      )}

      {ppeScan && (
        <SafetyOverlay
          icon={<Camera size={28} />}
          eyebrow="EDGE VISION CHECK"
          title="PPE scan complete"
          detail="23 people detected. One eye-protection exception requires supervisor confirmation."
          metrics={["98% hard hats", "96% eye protection", "100% high-vis"]}
          action="Review exception"
          onClose={() => setPpeScan(false)}
          warning
        />
      )}
    </div>
  );
}

function IncidentModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (alert: Alert) => void;
}) {
  const [title, setTitle] = useState("");
  const [zone, setZone] = useState("Tower A");
  const [level, setLevel] = useState<RiskLevel>("medium");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      id: crypto.randomUUID(),
      title: title.trim(),
      detail: "Field observation submitted by Nadia Rahman. Awaiting supervisor review.",
      zone,
      level,
      status: "active",
      time: "Now",
      category: "Access"
    });
  };
  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <button className="modal-scrim" onClick={onClose} aria-label="Close" />
      <form className="action-modal" onSubmit={submit}>
        <div className="action-modal__head">
          <div><p className="eyebrow">FIELD OBSERVATION</p><h2>Report a safety condition</h2></div>
          <button type="button" className="icon-button" onClick={onClose}><X size={18} /></button>
        </div>
        <label>What did you observe?
          <textarea autoFocus value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Describe the unsafe condition or near miss..." />
        </label>
        <div className="form-grid">
          <label>Zone
            <select value={zone} onChange={(event) => setZone(event.target.value)}>
              <option>Tower A</option><option>Tower B</option><option>Loading Bay</option>
              <option>Material Yard</option><option>MEP Corridor</option>
            </select>
          </label>
          <label>Severity
            <select value={level} onChange={(event) => setLevel(event.target.value as RiskLevel)}>
              <option value="low">Low</option><option value="medium">Medium</option>
              <option value="high">High</option><option value="critical">Critical</option>
            </select>
          </label>
        </div>
        <div className="action-modal__buttons">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="submit" className="primary-button" disabled={!title.trim()}>Submit observation</button>
        </div>
      </form>
    </div>
  );
}

function SafetyOverlay({
  icon,
  eyebrow,
  title,
  detail,
  metrics,
  action,
  onClose,
  warning = false
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  detail: string;
  metrics: string[];
  action: string;
  onClose: () => void;
  warning?: boolean;
}) {
  return (
    <div className="modal-layer" role="dialog" aria-modal="true">
      <button className="modal-scrim" onClick={onClose} aria-label="Close" />
      <div className={cn("safety-overlay", warning && "is-warning")}>
        <span className="safety-overlay__icon">{icon}</span>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{detail}</p>
        <div className="safety-overlay__metrics">
          {metrics.map((metric) => <span key={metric}>{metric}</span>)}
        </div>
        <button type="button" className="primary-button" onClick={onClose}>{action}</button>
      </div>
    </div>
  );
}
