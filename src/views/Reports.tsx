import {
  BadgeCheck,
  BarChart3,
  BookOpenCheck,
  Check,
  ChevronRight,
  Clock3,
  CloudSun,
  Download,
  FileCheck2,
  FileText,
  Leaf,
  LockKeyhole,
  Share2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wrench
} from "lucide-react";
import { useState } from "react";
import { Panel, ProgressBar, SectionHeader, StatusDot } from "../components/Primitives";
import { downloadTextFile } from "../lib/utils";
import type { Alert, Site, Task } from "../types";

export function Reports({
  site,
  alerts,
  tasks
}: {
  site: Site;
  alerts: Alert[];
  tasks: Task[];
}) {
  const [period, setPeriod] = useState("This month");
  const [generated, setGenerated] = useState(false);

  const generateReport = () => {
    const content = [
      "CIVORA SITE IMPACT REPORT",
      "=========================",
      `Project: ${site.name}`,
      `Location: ${site.location}`,
      `Period: ${period}`,
      "",
      "EXECUTIVE SUMMARY",
      "Safety score: 87/100 (+3.2 this week)",
      "Carbon avoided: 42.8 tCO2e (19.4% vs baseline)",
      "Waste diversion: 87.4%",
      "Productivity: 91.2% (+6.8% vs plan)",
      "Modeled value created: RM 186,420",
      "",
      "OPERATING STATUS",
      `Active alerts: ${alerts.filter((alert) => alert.status === "active").length}`,
      `Open actions: ${tasks.filter((task) => !task.completed).length}`,
      "Sensor data quality: 97.4%",
      "",
      "METHODOLOGY",
      "This prototype report uses deterministic demo telemetry. Production deployments must connect",
      "verified sensor, BIM, workforce, procurement, and asset records before external assurance.",
      "",
      `Generated: ${new Date().toISOString()}`
    ].join("\n");
    downloadTextFile("civora-impact-report.txt", content);
    setGenerated(true);
  };

  return (
    <div className="workspace reports-workspace">
      <div className="workspace-intro">
        <div>
          <p className="eyebrow">EVIDENCE TO ACTION</p>
          <h2>Impact stakeholders can trust.</h2>
          <p>
            Convert operational telemetry into audit-ready safety, sustainability, productivity,
            and financial narratives.
          </p>
        </div>
        <div className="intro-actions">
          <select value={period} onChange={(event) => setPeriod(event.target.value)} className="period-select">
            <option>Today</option><option>This week</option><option>This month</option><option>Project to date</option>
          </select>
          <button type="button" className="primary-button" onClick={generateReport}>
            <Download size={16} /> Export impact report
          </button>
        </div>
      </div>

      {generated && (
        <div className="report-success"><Check size={16} /> Report exported with methodology and demo-data disclosure.</div>
      )}

      <Panel className="executive-summary">
        <div className="executive-summary__head">
          <div>
            <p className="eyebrow">EXECUTIVE IMPACT • {period.toUpperCase()}</p>
            <h2>{site.name}</h2>
            <p>{site.location} • {site.phase}</p>
          </div>
          <div className="assurance-stamp"><BadgeCheck size={23} /><span>97.4%<small>data confidence</small></span></div>
        </div>
        <div className="executive-impact-grid">
          <div><span><ShieldCheck size={18} /></span><small>SAFETY</small><strong>87 / 100</strong><p>+3.2 points</p></div>
          <div><span><Leaf size={18} /></span><small>CARBON</small><strong>42.8 t</strong><p>avoided</p></div>
          <div><span><TrendingUp size={18} /></span><small>PRODUCTIVITY</small><strong>91.2%</strong><p>+6.8% vs plan</p></div>
          <div><span><Wrench size={18} /></span><small>UPTIME</small><strong>98.6%</strong><p>42.6h protected</p></div>
          <div className="executive-value"><small>MODELED VALUE CREATED</small><strong>RM 186,420</strong><p>Validated operational savings</p></div>
        </div>
      </Panel>

      <div className="reports-grid">
        <Panel className="report-builder">
          <SectionHeader eyebrow="REPORT BUILDER" title="One source, every stakeholder" />
          {[
            { icon: ShieldCheck, title: "Safety performance", detail: "Leading indicators, events, interventions", ready: true },
            { icon: CloudSun, title: "Carbon & circularity", detail: "GHG trajectory, materials, waste streams", ready: true },
            { icon: BarChart3, title: "Project productivity", detail: "Output, downtime, schedule variance", ready: true },
            { icon: Users, title: "Workforce wellbeing", detail: "Skills, briefings, fatigue controls", ready: true }
          ].map((section) => {
            const Icon = section.icon;
            return (
              <button type="button" className="report-section-row" key={section.title}>
                <span><Icon size={18} /></span>
                <div><strong>{section.title}</strong><small>{section.detail}</small></div>
                <span className="ready-state"><Check size={14} /> Ready</span>
                <ChevronRight size={15} />
              </button>
            );
          })}
          <div className="report-ai">
            <Sparkles size={17} />
            <p><strong>AI narrative:</strong> Civora explains changes and cites the underlying records. Every claim remains editable before export.</p>
          </div>
        </Panel>

        <Panel className="esg-alignment">
          <SectionHeader eyebrow="FRAMEWORK MAPPING" title="Report once, align broadly" />
          {[
            { framework: "GHG Protocol", coverage: 94, label: "Scope 1–3 construction" },
            { framework: "GRI", coverage: 88, label: "Safety, waste, energy" },
            { framework: "CIDB NCP 2030", coverage: 96, label: "Digital & sustainable build" },
            { framework: "ISO 45001", coverage: 91, label: "Occupational safety" }
          ].map((item) => (
            <div className="framework-row" key={item.framework}>
              <div><strong>{item.framework}</strong><small>{item.label}</small></div>
              <ProgressBar value={item.coverage} tone="lime" />
              <strong>{item.coverage}%</strong>
            </div>
          ))}
          <button type="button" className="secondary-button full-button"><BookOpenCheck size={15} /> Open disclosure index</button>
        </Panel>
      </div>

      <div className="reports-secondary-grid">
        <Panel className="audit-trail-card">
          <SectionHeader eyebrow="TRUST LAYER" title="Immutable evidence trail" />
          <div className="audit-chain">
            {[
              { time: "10:22:14", title: "Heat intervention approved", owner: "Nadia Rahman", hash: "8f3a...c912" },
              { time: "10:14:08", title: "Material passport verified", owner: "Civora Edge", hash: "12dc...88ae" },
              { time: "09:57:31", title: "AG-4 vibration anomaly", owner: "Sensor T-44", hash: "a901...04fd" },
              { time: "09:42:16", title: "Briefing acknowledgements", owner: "113 workers", hash: "77e4...b210" }
            ].map((item) => (
              <div key={item.hash}>
                <span><LockKeyhole size={14} /></span>
                <time>{item.time}</time>
                <div><strong>{item.title}</strong><small>{item.owner}</small></div>
                <code>{item.hash}</code>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="data-lineage-card">
          <SectionHeader eyebrow="DATA LINEAGE" title="Know where every number came from" />
          <div className="lineage-flow">
            <div><span><StatusDot tone="green" /></span><strong>148 sensors</strong><small>4s refresh</small></div>
            <i />
            <div><span><FileCheck2 size={18} /></span><strong>Edge validation</strong><small>PII removed</small></div>
            <i />
            <div><span><BarChart3 size={18} /></span><strong>Impact engine</strong><small>v1.4 model</small></div>
            <i />
            <div><span><BadgeCheck size={18} /></span><strong>Assured output</strong><small>97.4% confidence</small></div>
          </div>
          <div className="lineage-note"><StatusDot tone="amber" /> Demo telemetry is clearly labeled and cannot be mistaken for a live certified deployment.</div>
        </Panel>

        <Panel className="scheduled-reports">
          <SectionHeader eyebrow="AUTOMATION" title="Scheduled delivery" />
          {[
            { name: "Daily site pulse", audience: "Project leadership", when: "Daily • 18:00" },
            { name: "Weekly safety pack", audience: "HSE committee", when: "Friday • 16:00" },
            { name: "Monthly ESG report", audience: "Client & investor", when: "1st • 09:00" }
          ].map((report) => (
            <div className="scheduled-row" key={report.name}>
              <span><FileText size={16} /></span>
              <div><strong>{report.name}</strong><small>{report.audience}</small></div>
              <span><Clock3 size={13} /> {report.when}</span>
            </div>
          ))}
          <button type="button" className="secondary-button full-button"><Share2 size={15} /> Configure distribution</button>
        </Panel>
      </div>
    </div>
  );
}
