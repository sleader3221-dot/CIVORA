import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  Camera,
  Check,
  CircleDollarSign,
  Clock3,
  CloudSun,
  Droplets,
  Eye,
  HardHat,
  Leaf,
  Radio,
  ShieldCheck,
  Sparkles,
  Sun,
  ThermometerSun,
  Users,
  Wind,
  Wrench
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { activities, costData, photoDocuments, productivityData } from "../data/demo";
import type { Alert, EquipmentTelemetry, Site, Task, ViewId, WeatherData, Zone } from "../types";
import { activeAlerts, calculateSafetyScore, cn } from "../lib/utils";
import {
  MetricCard,
  Panel,
  ProgressBar,
  RiskBadge,
  SectionHeader,
  StatusDot
} from "../components/Primitives";

export function Overview({
  site,
  zones,
  alerts,
  tasks,
  weather,
  equipment,
  setView,
  acknowledgeAlert,
  toggleTask
}: {
  site: Site;
  zones: Zone[];
  alerts: Alert[];
  tasks: Task[];
  weather: WeatherData;
  equipment: EquipmentTelemetry[];
  setView: (view: ViewId) => void;
  acknowledgeAlert: (id: string) => void;
  toggleTask: (id: string) => void;
}) {
  const [chartMode, setChartMode] = useState<"productivity" | "safety">("productivity");
  const [liveClock, setLiveClock] = useState(new Date());
  const safetyScore = calculateSafetyScore(alerts);
  const topAlert = activeAlerts(alerts)[0];
  const activeWorkers = zones.reduce((total, zone) => total + zone.workers, 0);

  useEffect(() => {
    const timer = window.setInterval(() => setLiveClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hour = liveClock.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const dayName = liveClock.toLocaleDateString("en-US", { weekday: "long" });
  const dateStr = liveClock.toLocaleDateString("en-US", { day: "numeric", month: "long" });

  const budgetPct = useMemo(() => Math.round((costData.actual / costData.budget) * 100), []);
  const onlineEquip = useMemo(() => equipment.filter((e) => e.status === "online").length, [equipment]);

  return (
    <div className="workspace overview-workspace">
      <section className="hero-strip">
        <div>
          <p className="eyebrow">{dayName.toUpperCase()}, {dateStr} • SHIFT A</p>
          <h2>
            {greeting}, Nadia.
            <span> Your site needs attention in one zone.</span>
          </h2>
        </div>
        <div className="hero-strip__meta">
          <div>
            <Clock3 size={15} />
            <span>8h 24m</span>
            <small>since last incident</small>
          </div>
          <div>
            <Radio size={15} />
            <span>148 / 152</span>
            <small>sensors online</small>
          </div>
        </div>
      </section>

      <div className="metrics-grid">
        <MetricCard
          label="Safety score"
          value={safetyScore}
          unit="/100"
          trend={3.2}
          trendLabel="vs last week"
          icon={<ShieldCheck size={19} />}
          tone="lime"
        />
        <MetricCard
          label="Workers on site"
          value={activeWorkers}
          trend={8.4}
          trendLabel="capacity 76%"
          icon={<Users size={19} />}
          tone="cyan"
        />
        <MetricCard
          label="Carbon avoided"
          value="42.8"
          unit="tCO2e"
          trend={19.4}
          trendLabel="vs baseline"
          icon={<Leaf size={19} />}
          tone="violet"
        />
        <MetricCard
          label="Productivity"
          value="91.2"
          unit="%"
          trend={6.8}
          trendLabel="above plan"
          icon={<Wrench size={19} />}
          tone="amber"
        />
      </div>

      <div className="overview-grid overview-grid--top">
        <Panel className="command-card">
          <SectionHeader
            eyebrow="AI PRIORITY"
            title="Intervention recommended"
            action={<RiskBadge level={topAlert?.level ?? "low"} />}
          />
          {topAlert ? (
            <>
              <div className="command-card__body">
                <span className="command-card__icon">
                  <AlertTriangle size={23} />
                </span>
                <div>
                  <h3>{topAlert.title}</h3>
                  <p>{topAlert.detail}</p>
                  <div className="command-card__facts">
                    <span><strong>92%</strong> confidence</span>
                    <span><strong>18 min</strong> to threshold</span>
                    <span><strong>6</strong> workers exposed</span>
                  </div>
                </div>
              </div>
              <div className="recommendation">
                <Sparkles size={16} />
                <p>
                  <strong>Recommended:</strong> Deploy mobile cooling station, rotate the exposed
                  crew, and reduce continuous work blocks to 20 minutes.
                </p>
              </div>
              <div className="command-card__actions">
                <button
                  type="button"
                  className="primary-button"
                  onClick={() => acknowledgeAlert(topAlert.id)}
                >
                  <Check size={16} /> Dispatch response
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setView("safety")}
                >
                  Review evidence <ArrowRight size={15} />
                </button>
              </div>
            </>
          ) : (
            <div className="all-clear">
              <ShieldCheck size={30} />
              <div>
                <h3>All critical conditions cleared</h3>
                <p>Predictive monitoring remains active across all five zones.</p>
              </div>
            </div>
          )}
        </Panel>

        <Panel className="site-pulse-card">
          <SectionHeader
            eyebrow="PROJECT PULSE"
            title={`${site.progress}% complete`}
            action={<span className="on-track"><StatusDot tone="green" /> On track</span>}
          />
          <div className="project-ring-row">
            <div
              className="progress-ring"
              style={{ "--progress": `${site.progress * 3.6}deg` } as React.CSSProperties}
            >
              <div><strong>{site.progress}%</strong><span>overall</span></div>
            </div>
            <div className="project-milestones">
              <div><span>Current phase</span><strong>{site.phase}</strong></div>
              <div><span>Target handover</span><strong>{site.targetDate}</strong></div>
              <div><span>Schedule variance</span><strong className="positive">+3.5 days</strong></div>
            </div>
          </div>
          <div className="project-progress-list">
            <ProgressBar label="Structure" value={86} tone="lime" />
            <ProgressBar label="MEP services" value={61} tone="cyan" />
            <ProgressBar label="Envelope" value={48} tone="amber" />
          </div>
        </Panel>
      </div>

      <div className="overview-grid overview-grid--weather">
        <Panel className="weather-card">
          <SectionHeader
            eyebrow="SITE WEATHER"
            title={`${weather.temperature}°C`}
            action={<span className="on-track"><StatusDot tone={weather.condition === "stormy" ? "red" : weather.condition === "rainy" ? "amber" : "green"} pulse /> {weather.condition}</span>}
          />
          <div className="weather-card__body">
            <div className="weather-card__main">
              <span className="weather-card__icon">
                {weather.condition === "rainy" || weather.condition === "stormy" ? <Droplets size={28} /> : <Sun size={28} />}
              </span>
              <div>
                <div className="weather-card__stats">
                  <span><Wind size={13} /> {weather.windSpeed} km/h</span>
                  <span><Droplets size={13} /> {weather.humidity}%</span>
                  <span><ThermometerSun size={13} /> UV {weather.uvIndex}</span>
                </div>
              </div>
            </div>
            <div className="weather-card__forecast">
              {weather.forecast.slice(0, 5).map((day) => (
                <div key={day.day}>
                  <small>{day.day}</small>
                  <span className="weather-card__temp">{day.high}°</span>
                  <span className="weather-card__temp weather-card__temp--low">{day.low}°</span>
                </div>
              ))}
            </div>
          </div>
          {weather.warnings.length > 0 && (
            <div className="weather-card__warnings">
              {weather.warnings.map((w) => (
                <div key={w.type} className="weather-warning">
                  <AlertTriangle size={13} />
                  <span><strong>{w.type}:</strong> {w.text}</span>
                </div>
              ))}
            </div>
          )}
        </Panel>

        <Panel className="photo-timeline-card">
          <SectionHeader
            eyebrow="PHOTO DOCUMENTATION"
            title="Site visual timeline"
            action={
              <button type="button" className="text-button" onClick={() => setView("twin")}>
                <Camera size={14} /> View all
              </button>
            }
          />
          <div className="photo-timeline">
            {photoDocuments.slice(0, 4).map((photo) => (
              <div className="photo-item" key={photo.id}>
                <div className="photo-item__thumb">
                  <Camera size={18} />
                </div>
                <div>
                  <strong>{photo.title}</strong>
                  <small>{photo.date} • {photo.location}</small>
                </div>
                <span className="photo-item__cat">{photo.category}</span>
              </div>
            ))}
          </div>
          <button type="button" className="text-button photo-timeline__more" onClick={() => setView("twin")}>
            View all documentation <ArrowRight size={13} />
          </button>
        </Panel>

        <Panel className="cost-card">
          <SectionHeader
            eyebrow="FINANCIAL TRACKING"
            title="Budget vs actual"
            action={<span className="on-track">{costData.variance > 0 ? "+" : ""}{costData.variance}% variance</span>}
          />
          <div className="cost-card__summary">
            <div>
              <small>BUDGET</small>
              <strong>RM {(costData.budget / 1e6).toFixed(1)}M</strong>
            </div>
            <div>
              <small>ACTUAL</small>
              <strong>RM {(costData.actual / 1e6).toFixed(1)}M</strong>
            </div>
            <div>
              <small>FORECAST</small>
              <strong className={costData.forecast > costData.budget ? "negative" : "positive"}>RM {(costData.forecast / 1e6).toFixed(1)}M</strong>
            </div>
          </div>
          <ProgressBar label="Budget consumed" value={budgetPct} tone="lime" />
          <div className="cost-card__categories">
            {costData.categories.map((cat) => (
              <div key={cat.name}>
                <span>{cat.name}</span>
                <div className="cost-card__bar">
                  <span style={{ width: `${(cat.actual / cat.budget) * 100}%` }} />
                </div>
                <strong>{Math.round((cat.actual / cat.budget) * 100)}%</strong>
              </div>
            ))}
          </div>
          <button type="button" className="secondary-button full-button" onClick={() => setView("reports")}>
            <CircleDollarSign size={15} /> View financial report
          </button>
        </Panel>
      </div>

      <div className="overview-grid overview-grid--middle">
        <Panel className="chart-card">
          <SectionHeader
            eyebrow="TODAY • LIVE"
            title={chartMode === "productivity" ? "Productivity velocity" : "Safety performance"}
            action={
              <div className="segmented-control">
                <button
                  type="button"
                  className={cn(chartMode === "productivity" && "is-active")}
                  onClick={() => setChartMode("productivity")}
                >
                  Output
                </button>
                <button
                  type="button"
                  className={cn(chartMode === "safety" && "is-active")}
                  onClick={() => setChartMode("safety")}
                >
                  Safety
                </button>
              </div>
            }
          />
          <div className="chart-summary">
            <strong>{chartMode === "productivity" ? "91.2%" : `${safetyScore}/100`}</strong>
            <span>
              {chartMode === "productivity"
                ? "11.4 points above shift start"
                : "3.2% stronger than last week"}
            </span>
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={1}>
              <AreaChart data={productivityData}>
                <defs>
                  <linearGradient id="outputGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9ff5c" stopOpacity={0.32} />
                    <stop offset="100%" stopColor="#c9ff5c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="var(--chart-grid)" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: "var(--text-3)", fontSize: 11 }} />
                <YAxis domain={[60, 100]} hide />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey={chartMode === "productivity" ? "target" : "actual"}
                  stroke="var(--text-3)"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={1.5}
                />
                <Area
                  type="monotone"
                  dataKey={chartMode === "productivity" ? "actual" : "target"}
                  stroke="#c9ff5c"
                  fill="url(#outputGradient)"
                  strokeWidth={2.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="mini-twin-card">
          <SectionHeader
            eyebrow="DIGITAL TWIN"
            title="Live zone status"
            action={
              <button type="button" className="text-button" onClick={() => setView("twin")}>
                Open twin <ArrowRight size={14} />
              </button>
            }
          />
          <div className="mini-twin">
            <div className="mini-twin__grid" />
            {zones.map((zone) => (
              <button
                type="button"
                key={zone.id}
                className={cn("mini-zone", `mini-zone--${zone.risk}`)}
                style={{
                  left: `${zone.x}%`,
                  top: `${zone.y}%`,
                  width: `${zone.width}%`,
                  height: `${zone.height}%`
                }}
                onClick={() => setView("twin")}
                title={`${zone.name}: ${zone.risk} risk`}
              >
                <span>{zone.name}</span>
                <small>{zone.workers} people</small>
              </button>
            ))}
          </div>
          <div className="mini-twin__legend">
            <span><StatusDot tone="green" /> Nominal</span>
            <span><StatusDot tone="amber" /> Watch</span>
            <span><StatusDot tone="red" /> Act now</span>
          </div>
        </Panel>
      </div>

      <div className="overview-grid overview-grid--bottom">
        <Panel className="tasks-card">
          <SectionHeader
            eyebrow="SITE PLAN"
            title="Priority actions"
            action={<span className="count-label">{tasks.filter((task) => !task.completed).length} open</span>}
          />
          <div className="task-list">
            {tasks.slice(0, 4).map((task) => (
              <article className={cn("task-row", task.completed && "is-complete")} key={task.id}>
                <button
                  type="button"
                  className="task-check"
                  onClick={() => toggleTask(task.id)}
                  aria-label={task.completed ? "Reopen task" : "Complete task"}
                >
                  {task.completed && <Check size={14} />}
                </button>
                <div>
                  <strong>{task.title}</strong>
                  <span>{task.owner} • due {task.due}</span>
                </div>
                <RiskBadge level={task.priority} />
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="activity-card">
          <SectionHeader eyebrow="AUDIT STREAM" title="Recent activity" />
          <div className="activity-list">
            {activities.map((item) => (
              <article key={item.id}>
                <span className={cn("activity-list__dot", `is-${item.tone}`)} />
                <div>
                  <strong>{item.title}</strong>
                  <small>{item.meta}</small>
                </div>
                <time>{item.time}</time>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="value-card">
          <p className="eyebrow">VALUE CREATED • THIS MONTH</p>
          <div className="value-card__amount">
            <CircleDollarSign size={23} />
            <strong>RM 186,420</strong>
          </div>
          <p>Modeled savings from avoided downtime, material recovery, and energy optimization.</p>
          <div className="value-breakdown">
            <div><HardHat size={15} /><span>Avoided incidents</span><strong>RM 91k</strong></div>
            <div><CloudSun size={15} /><span>Carbon & waste</span><strong>RM 58k</strong></div>
            <div><Wrench size={15} /><span>Tool uptime</span><strong>RM 37k</strong></div>
          </div>
          <button type="button" className="secondary-button" onClick={() => setView("reports")}>
            View impact model
          </button>
        </Panel>
      </div>
    </div>
  );
}

function ChartTooltip({
  active,
  payload,
  label
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <span key={item.name}>
          <i style={{ background: item.color }} />
          {item.name}: {item.value}%
        </span>
      ))}
    </div>
  );
}
