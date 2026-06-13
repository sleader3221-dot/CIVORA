import type { PropsWithChildren, ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import type { RiskLevel } from "../types";
import { cn } from "../lib/utils";

export function Panel({
  children,
  className,
  as: Component = "section"
}: PropsWithChildren<{
  className?: string;
  as?: "section" | "article" | "div";
}>) {
  return <Component className={cn("panel", className)}>{children}</Component>;
}

export function SectionHeader({
  eyebrow,
  title,
  action,
  compact = false
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={cn("section-header", compact && "section-header--compact")}>
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function RiskBadge({
  level,
  label
}: {
  level: RiskLevel;
  label?: string;
}) {
  return (
    <span className={cn("risk-badge", `risk-badge--${level}`)}>
      <span className="risk-badge__dot" />
      {label ?? level}
    </span>
  );
}

export function StatusDot({
  tone = "green",
  pulse = false
}: {
  tone?: "green" | "amber" | "red" | "blue" | "muted";
  pulse?: boolean;
}) {
  return <span className={cn("status-dot", `status-dot--${tone}`, pulse && "is-pulsing")} />;
}

export function MetricCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  icon,
  tone = "lime"
}: {
  label: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: ReactNode;
  tone?: "lime" | "cyan" | "amber" | "violet";
}) {
  const TrendIcon =
    trend === undefined || trend === 0 ? Minus : trend > 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <Panel className={cn("metric-card", `metric-card--${tone}`)}>
      <div className="metric-card__top">
        <span className="metric-card__label">{label}</span>
        <span className="metric-card__icon">{icon}</span>
      </div>
      <div className="metric-card__value">
        {value}
        {unit && <span>{unit}</span>}
      </div>
      {trend !== undefined && (
        <div className={cn("metric-card__trend", trend >= 0 ? "is-positive" : "is-negative")}>
          <TrendIcon size={14} />
          <span>{Math.abs(trend)}%</span>
          {trendLabel && <span className="metric-card__trend-label">{trendLabel}</span>}
        </div>
      )}
    </Panel>
  );
}

export function ProgressBar({
  value,
  tone = "lime",
  label
}: {
  value: number;
  tone?: "lime" | "cyan" | "amber" | "red";
  label?: string;
}) {
  return (
    <div className="progress">
      {label && (
        <div className="progress__label">
          <span>{label}</span>
          <strong>{value}%</strong>
        </div>
      )}
      <div className="progress__track">
        <span
          className={cn("progress__fill", `progress__fill--${tone}`)}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  detail,
  action
}: {
  title: string;
  detail: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark">C</div>
      <h3>{title}</h3>
      <p>{detail}</p>
      {action}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <span className={cn("skeleton", className)} />;
}
