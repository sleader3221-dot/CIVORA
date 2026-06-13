import {
  ArrowRight,
  BadgeCheck,
  Box,
  Check,
  ChevronRight,
  CloudSun,
  Droplets,
  Factory,
  Leaf,
  PackageCheck,
  QrCode,
  Recycle,
  Route,
  Scale,
  Sparkles,
  Truck,
  X,
  Zap
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { carbonData, materials } from "../data/demo";
import { cn } from "../lib/utils";
import { Panel, ProgressBar, SectionHeader, StatusDot } from "../components/Primitives";

export function Sustainability() {
  const [scenario, setScenario] = useState<"current" | "optimized">("current");
  const [passportOpen, setPassportOpen] = useState(false);
  const [matched, setMatched] = useState(false);
  const [carbonScope, setCarbonScope] = useState<"embodied" | "operational">("embodied");

  const optimized = scenario === "optimized";
  const reduction = optimized ? 27.8 : 19.4;

  return (
    <div className="workspace sustainability-workspace">
      <div className="workspace-intro sustainability-intro">
        <div>
          <p className="eyebrow">BUILD MORE • WASTE LESS</p>
          <h2>Turn sustainability into site economics.</h2>
          <p>
            Measure embodied carbon, close material loops, and translate every intervention into
            cost, compliance, and climate value.
          </p>
        </div>
        <div className="scenario-switch">
          <span>SCENARIO</span>
          <button type="button" className={cn(scenario === "current" && "is-active")} onClick={() => setScenario("current")}>Current plan</button>
          <button type="button" className={cn(scenario === "optimized" && "is-active")} onClick={() => setScenario("optimized")}>
            <Sparkles size={14} /> AI optimized
          </button>
        </div>
      </div>

      <div className="sustainability-hero">
        <Panel className="carbon-budget-card">
          <div className="carbon-budget-card__head">
            <div>
              <p className="eyebrow">PROJECT CARBON BUDGET</p>
              <h3>{optimized ? "2,914" : "3,228"} <span>tCO2e forecast</span></h3>
            </div>
            <span className="positive"><Leaf size={15} /> {reduction}% below baseline</span>
          </div>
          <div className="carbon-budget-track">
            <span className="carbon-budget-track__used" style={{ width: optimized ? "58%" : "66%" }} />
            <span className="carbon-budget-track__forecast" style={{ left: optimized ? "58%" : "66%", width: optimized ? "14%" : "17%" }} />
            <i style={{ left: "86%" }} />
          </div>
          <div className="carbon-budget-legend">
            <span><i className="used" /> Actual to date <strong>2,108 t</strong></span>
            <span><i className="forecast" /> Forecast remaining <strong>{optimized ? "806" : "1,120"} t</strong></span>
            <span><i className="budget" /> Budget <strong>3,940 t</strong></span>
          </div>
          {optimized && (
            <div className="scenario-saving">
              <Sparkles size={18} />
              <p><strong>Additional 314 tCO2e avoidable</strong> by switching two concrete batches, consolidating deliveries, and reusing Tower A formwork.</p>
              <button type="button" onClick={() => setScenario("optimized")}>Apply plan <ArrowRight size={14} /></button>
            </div>
          )}
        </Panel>

        <div className="eco-metrics">
          <Panel><span><Recycle size={19} /></span><div><small>WASTE DIVERSION</small><strong>87.4%</strong><p>+12.1% vs target</p></div></Panel>
          <Panel><span><Droplets size={19} /></span><div><small>WATER SAVED</small><strong>1.28 ML</strong><p>Equivalent to 512 homes/day</p></div></Panel>
          <Panel><span><Zap size={19} /></span><div><small>CLEAN ENERGY</small><strong>64%</strong><p>Site demand from renewables</p></div></Panel>
          <Panel><span><Scale size={19} /></span><div><small>MATERIAL REUSED</small><strong>48.6 t</strong><p>RM 58,240 recovered value</p></div></Panel>
        </div>
      </div>

      <div className="sustainability-charts">
        <Panel className="carbon-chart-card">
          <SectionHeader
            eyebrow="FORECAST TO COMPLETION"
            title="Carbon trajectory"
            action={
              <div className="segmented-control">
                <button type="button" className={cn(carbonScope === "embodied" && "is-active")} onClick={() => setCarbonScope("embodied")}>Embodied</button>
                <button type="button" className={cn(carbonScope === "operational" && "is-active")} onClick={() => setCarbonScope("operational")}>Operational</button>
              </div>
            }
          />
          <div className="chart-wrap chart-wrap--large">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
              <AreaChart data={carbonData.map((point) => ({
                ...point,
                civora: optimized ? Math.round(point.civora * 0.88) : point.civora
              }))}>
                <defs>
                  <linearGradient id="carbonGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9ff5c" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#c9ff5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="var(--chart-grid)" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "var(--text-3)", fontSize: 11 }} />
                <YAxis hide />
                <Tooltip />
                <Area type="monotone" dataKey="baseline" name="Baseline" stroke="var(--text-3)" strokeDasharray="6 5" fill="none" />
                <Area type="monotone" dataKey="civora" name="Civora forecast" stroke="#c9ff5c" strokeWidth={2.5} fill="url(#carbonGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="waste-chart-card">
          <SectionHeader eyebrow="MATERIAL FLOWS" title="Waste by destination" />
          <div className="chart-wrap chart-wrap--large">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
              <BarChart data={[
                { name: "Concrete", reuse: 68, recycle: 24, landfill: 8 },
                { name: "Metal", reuse: 34, recycle: 64, landfill: 2 },
                { name: "Timber", reuse: 72, recycle: 18, landfill: 10 },
                { name: "Mixed", reuse: 21, recycle: 44, landfill: 35 }
              ]}>
                <CartesianGrid vertical={false} strokeDasharray="3 6" stroke="var(--chart-grid)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "var(--text-3)", fontSize: 10 }} />
                <YAxis hide />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="reuse" name="Reused" stackId="a" fill="#c9ff5c" radius={[0, 0, 0, 0]} />
                <Bar dataKey="recycle" name="Recycled" stackId="a" fill="#50d8e8" />
                <Bar dataKey="landfill" name="Landfill" stackId="a" fill="#58606b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <div className="circularity-grid">
        <Panel className="material-passports">
          <SectionHeader
            eyebrow="DIGITAL MATERIAL PASSPORTS"
            title="Verified material inventory"
            action={<span className="verified-label"><BadgeCheck size={15} /> 94% traceable</span>}
          />
          <div className="material-list">
            {materials.map((material) => (
              <article key={material.id}>
                <span className="material-list__icon"><Box size={19} /></span>
                <div>
                  <strong>{material.name}</strong>
                  <small>{material.quantity} • {material.origin}</small>
                  <div>
                    <span>Carbon index {material.embodiedCarbon}</span>
                    <span>Circularity {material.circularity}%</span>
                  </div>
                </div>
                <span className={cn("material-status", `material-status--${material.status}`)}>{material.status}</span>
                <button type="button" className="icon-button" onClick={() => setPassportOpen(true)} aria-label="Open material passport">
                  <QrCode size={17} />
                </button>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="circular-marketplace">
          <SectionHeader eyebrow="CIRCULAR MATCHMAKER" title="Keep materials in use" />
          {!matched ? (
            <>
              <div className="marketplace-match">
                <span><Route size={20} /></span>
                <div>
                  <small>HIGH-CONFIDENCE MATCH • 4.8 KM</small>
                  <h3>26 sheets surplus plywood</h3>
                  <p>Needed by Sentral Labs refurbishment tomorrow morning.</p>
                </div>
                <strong>96%</strong>
              </div>
              <div className="match-impact">
                <div><Leaf size={15} /><span>0.84 tCO2e avoided</span></div>
                <div><Truck size={15} /><span>RM 2,180 value recovered</span></div>
              </div>
              <button type="button" className="primary-button full-button" onClick={() => setMatched(true)}>
                <Check size={16} /> Reserve material transfer
              </button>
            </>
          ) : (
            <div className="match-success">
              <span><PackageCheck size={27} /></span>
              <h3>Transfer reserved</h3>
              <p>Pickup window 07:30–08:15. Both site managers have been notified.</p>
              <button type="button" className="secondary-button" onClick={() => setMatched(false)}>Undo reservation</button>
            </div>
          )}
        </Panel>

        <Panel className="supply-chain-card">
          <SectionHeader eyebrow="SUPPLY CHAIN" title="Low-carbon procurement" />
          <div className="supplier-score">
            <span><Factory size={19} /></span>
            <div><strong>Shah Alam Concrete</strong><small>Verified EPD • 34 km</small></div>
            <strong>A</strong>
          </div>
          <div className="supplier-metrics">
            <div><span>Carbon vs market</span><strong className="positive">−31%</strong></div>
            <div><span>On-time delivery</span><strong>96%</strong></div>
            <div><span>Data confidence</span><strong>High</strong></div>
          </div>
          <ProgressBar label="Responsible sourcing score" value={91} tone="lime" />
          <button type="button" className="text-button">Compare suppliers <ChevronRight size={14} /></button>
        </Panel>
      </div>

      {passportOpen && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-scrim" onClick={() => setPassportOpen(false)} aria-label="Close" />
          <div className="passport-modal">
            <div className="passport-visual"><QrCode size={92} /><span>CVR-RS-2026-0088</span></div>
            <div>
              <p className="eyebrow">VERIFIED MATERIAL PASSPORT</p>
              <h2>Reclaimed structural steel</h2>
              <p>Chain-of-custody record from recovery through installation.</p>
              <dl>
                <div><dt>Origin</dt><dd>Petaling Jaya recovery project</dd></div>
                <div><dt>Grade</dt><dd>S355 • lab verified</dd></div>
                <div><dt>Embodied carbon</dt><dd>0.42 tCO2e / tonne</dd></div>
                <div><dt>Reuse cycles</dt><dd>1 of estimated 4</dd></div>
              </dl>
              <div className="passport-verified"><BadgeCheck size={17} /> Integrity hash verified</div>
              <button type="button" className="primary-button" onClick={() => setPassportOpen(false)}>Close passport</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
