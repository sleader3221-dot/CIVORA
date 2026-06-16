"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const colors = ["#a7f3d0", "#fbbf24", "#fdba74", "#fb7185"];

export function DashboardCharts({
  volume,
  severity,
  status
}: {
  volume: Array<{ time: string; events: number }>;
  severity: Array<{ name: string; value: number }>;
  status: Array<{ name: string; value: number }>;
}) {
  return (
    <div className="grid three">
      <div className="card">
        <h3>Event volume</h3>
        <ResponsiveContainer width="100%" height={230}>
          <AreaChart data={volume}>
            <defs>
              <linearGradient id="eventFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.55} />
                <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
            <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ background: "#0e141d", border: "1px solid rgba(148,163,184,.2)", borderRadius: 12 }} />
            <Area dataKey="events" stroke="#7dd3fc" fill="url(#eventFill)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Severity distribution</h3>
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie data={severity} dataKey="value" nameKey="name" innerRadius={52} outerRadius={86} paddingAngle={3}>
              {severity.map((entry, index) => <Cell key={entry.name} fill={colors[index % colors.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: "#0e141d", border: "1px solid rgba(148,163,184,.2)", borderRadius: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="card">
        <h3>Case status</h3>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={status}>
            <CartesianGrid stroke="rgba(148,163,184,.12)" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
            <YAxis stroke="#94a3b8" fontSize={11} />
            <Tooltip contentStyle={{ background: "#0e141d", border: "1px solid rgba(148,163,184,.2)", borderRadius: 12 }} />
            <Bar dataKey="value" fill="#a7f3d0" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
