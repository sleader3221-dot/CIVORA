import {
  Activity,
  BatteryCharging,
  Bluetooth,
  Box,
  Check,
  ChevronRight,
  CircleGauge,
  MapPin,
  PackageCheck,
  Radio,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Wrench,
  Zap
} from "lucide-react";
import { useMemo, useState } from "react";
import { tools } from "../data/demo";
import { cn } from "../lib/utils";
import { Panel, ProgressBar, SectionHeader, StatusDot } from "../components/Primitives";

export function Assets() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "in-use" | "available" | "maintenance">("all");
  const [selected, setSelected] = useState(tools[1]);
  const [maintenanceScheduled, setMaintenanceScheduled] = useState(false);
  const [locating, setLocating] = useState(false);
  const [batteriesQueued, setBatteriesQueued] = useState(false);

  const filtered = useMemo(
    () =>
      tools.filter(
        (tool) =>
          (status === "all" || tool.status === status) &&
          `${tool.name} ${tool.type} ${tool.zone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query, status]
  );

  return (
    <div className="workspace assets-workspace">
      <div className="workspace-intro">
        <div>
          <p className="eyebrow">CONNECTED TOOL PARK</p>
          <h2>The right tool, healthy and ready.</h2>
          <p>
            Track utilization, battery, location, vibration, and service life to prevent downtime
            and extend every asset's useful life.
          </p>
        </div>
        <div className="intro-actions">
          <span className="data-quality"><StatusDot tone="green" pulse /> 84 assets connected</span>
          <button type="button" className="primary-button" onClick={() => setLocating(true)}>
            <Radio size={16} /> Locate asset
          </button>
        </div>
      </div>

      <div className="asset-metrics">
        <Panel><span><CircleGauge size={20} /></span><div><small>FLEET UTILIZATION</small><strong>78.4%</strong><p>+9.2% this month</p></div></Panel>
        <Panel><span><ShieldCheck size={20} /></span><div><small>MEAN HEALTH</small><strong>93%</strong><p>1 asset needs action</p></div></Panel>
        <Panel><span><TimerReset size={20} /></span><div><small>DOWNTIME AVOIDED</small><strong>42.6 h</strong><p>RM 37,180 protected</p></div></Panel>
        <Panel><span><BatteryCharging size={20} /></span><div><small>BATTERY READY</small><strong>91%</strong><p>7 charging, 2 low</p></div></Panel>
      </div>

      <div className="assets-main-grid">
        <Panel className="asset-fleet">
          <SectionHeader
            eyebrow="LIVE FLEET"
            title={`${filtered.length} connected assets`}
            action={
              <label className="table-search">
                <Search size={14} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find tool..." />
              </label>
            }
          />
          <div className="asset-status-tabs">
            {(["all", "in-use", "available", "maintenance"] as const).map((item) => (
              <button type="button" key={item} className={cn(status === item && "is-active")} onClick={() => setStatus(item)}>{item}</button>
            ))}
          </div>
          <div className="asset-table">
            <div className="asset-table__head"><span>Asset</span><span>Location</span><span>Battery</span><span>Health</span><span>Status</span></div>
            {filtered.map((tool) => (
              <button type="button" key={tool.id} className={cn(selected.id === tool.id && "is-selected")} onClick={() => setSelected(tool)}>
                <div className="asset-name"><span><Wrench size={17} /></span><div><strong>{tool.name}</strong><small>{tool.type}</small></div></div>
                <span><MapPin size={13} /> {tool.zone}</span>
                <div className="asset-battery"><BatteryCharging size={14} /><strong>{tool.battery}%</strong></div>
                <div className="asset-health"><ProgressBar value={tool.health} tone={tool.health < 80 ? "amber" : "lime"} /><strong>{tool.health}%</strong></div>
                <span className={cn("asset-status", `asset-status--${tool.status}`)}><StatusDot tone={tool.status === "maintenance" ? "amber" : tool.status === "in-use" ? "green" : "blue"} /> {tool.status}</span>
              </button>
            ))}
          </div>
        </Panel>

        <Panel className="asset-inspector">
          <div className="asset-inspector__hero">
            <span><Wrench size={28} /></span>
            <div><small>SELECTED ASSET</small><h2>{selected.name}</h2><p>{selected.type}</p></div>
            <StatusDot tone={selected.status === "maintenance" ? "amber" : "green"} pulse />
          </div>
          <div className="asset-inspector__identity">
            <span><Bluetooth size={14} /> CVR-{selected.id.toUpperCase()}</span>
            <span><MapPin size={14} /> {selected.zone}</span>
          </div>
          <div className="asset-gauges">
            <div>
              <span>Asset health</span>
              <strong>{selected.health}%</strong>
              <ProgressBar value={selected.health} tone={selected.health < 80 ? "amber" : "lime"} />
            </div>
            <div>
              <span>Battery charge</span>
              <strong>{selected.battery}%</strong>
              <ProgressBar value={selected.battery} tone={selected.battery < 30 ? "red" : "cyan"} />
            </div>
          </div>
          <div className="vibration-chart">
            <div><span><Activity size={15} /> Vibration signature</span><strong className={selected.health < 80 ? "negative" : "positive"}>{selected.health < 80 ? "+17% drift" : "Nominal"}</strong></div>
            <svg viewBox="0 0 300 80" preserveAspectRatio="none" aria-label="Vibration waveform">
              <path d="M0 45 L12 42 L22 47 L31 22 L42 59 L50 42 L64 45 L73 38 L84 50 L92 14 L102 66 L112 42 L126 45 L139 36 L148 51 L159 19 L169 61 L180 43 L194 45 L205 33 L216 54 L225 24 L235 58 L246 42 L259 46 L270 37 L280 49 L290 39 L300 44" />
            </svg>
          </div>
          <div className="maintenance-prediction">
            <Sparkles size={17} />
            <div><strong>Service recommended in {selected.serviceDue} hours</strong><p>Predicted bearing wear based on vibration drift and load history.</p></div>
          </div>
          {maintenanceScheduled ? (
            <div className="maintenance-confirmed"><PackageCheck size={16} /> Service slot reserved: Today, 15:30</div>
          ) : (
            <button type="button" className="primary-button full-button" onClick={() => setMaintenanceScheduled(true)}>
              <Settings2 size={16} /> Schedule preventive service
            </button>
          )}
        </Panel>
      </div>

      <div className="asset-secondary-grid">
        <Panel className="tool-flow-card">
          <SectionHeader eyebrow="UTILIZATION MAP" title="Tool flow today" />
          <div className="tool-flow">
            {[
              { zone: "Tower A", tools: 24, value: 86 },
              { zone: "Tower B", tools: 18, value: 72 },
              { zone: "Loading Bay", tools: 11, value: 61 },
              { zone: "MEP Corridor", tools: 19, value: 93 },
              { zone: "Smart locker", tools: 12, value: 22 }
            ].map((row) => (
              <div key={row.zone}>
                <span>{row.zone}<small>{row.tools} tools</small></span>
                <ProgressBar value={row.value} tone={row.value > 90 ? "amber" : "cyan"} />
                <strong>{row.value}%</strong>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="battery-orchestrator">
          <SectionHeader eyebrow="ENERGY ORCHESTRATOR" title="Charge when carbon is lowest" />
          <div className="charge-window">
            <Zap size={21} />
            <div><small>BEST CHARGE WINDOW</small><strong>12:40–14:10</strong><p>Solar generation peak • 18% lower grid carbon</p></div>
          </div>
          <div className="charge-slots">
            {[32, 46, 61, 84, 96, 88, 67, 48].map((value, index) => <span key={index} style={{ height: `${value}%` }} className={value > 80 ? "is-best" : ""} />)}
          </div>
          <button type="button" className="secondary-button full-button" onClick={() => setBatteriesQueued(true)}>
            {batteriesQueued ? <Check size={15} /> : null} {batteriesQueued ? "Charging optimized" : "Optimize 7 queued batteries"}
          </button>
        </Panel>
        <Panel className="circular-tool-card">
          <SectionHeader eyebrow="ASSET CIRCULARITY" title="Extend useful life" />
          <div className="circular-score"><strong>8.4</strong><span>/ 10 circularity score</span></div>
          <p>Repair-first maintenance and pooled utilization avoided 12 replacement purchases this quarter.</p>
          <div className="circular-stats">
            <span><strong>94%</strong> repair rate</span>
            <span><strong>3.2 yrs</strong> life extended</span>
            <span><strong>1.8 t</strong> material saved</span>
          </div>
        </Panel>
      </div>

      {locating && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-scrim" onClick={() => setLocating(false)} aria-label="Close" />
          <div className="locate-modal">
            <div className="locate-radar"><span /><i /><b><Wrench size={20} /></b></div>
            <p className="eyebrow">UWB PRECISION LOCATION</p>
            <h2>{selected.name} located</h2>
            <p>Tower A • Level 12 • Grid C4 • ±0.8 m accuracy</p>
            <button type="button" className="primary-button" onClick={() => setLocating(false)}><Check size={15} /> Got it</button>
          </div>
        </div>
      )}
    </div>
  );
}
