export type ViewId =
  | "overview"
  | "twin"
  | "safety"
  | "sustainability"
  | "workforce"
  | "assets"
  | "reports";

export type RiskLevel = "critical" | "high" | "medium" | "low";
export type AlertStatus = "active" | "acknowledged" | "resolved";

export interface Site {
  id: string;
  name: string;
  location: string;
  phase: string;
  progress: number;
  targetDate: string;
}

export interface Zone {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  risk: RiskLevel;
  workers: number;
  temperature: number;
  airQuality: number;
  noise: number;
  status: "active" | "restricted" | "clear";
}

export interface Alert {
  id: string;
  title: string;
  detail: string;
  zone: string;
  level: RiskLevel;
  status: AlertStatus;
  time: string;
  category: "PPE" | "Environment" | "Equipment" | "Access" | "Schedule";
}

export interface Activity {
  id: string;
  title: string;
  meta: string;
  time: string;
  tone: "green" | "amber" | "blue" | "red";
}

export interface Task {
  id: string;
  title: string;
  owner: string;
  due: string;
  priority: RiskLevel;
  completed: boolean;
}

export interface ToolAsset {
  id: string;
  name: string;
  type: string;
  zone: string;
  battery: number;
  health: number;
  usageHours: number;
  status: "in-use" | "available" | "maintenance";
  serviceDue: number;
}

export interface Worker {
  id: string;
  name: string;
  role: string;
  zone: string;
  shift: string;
  competency: number;
  fatigue: RiskLevel;
  language: string;
  status: "on-site" | "break" | "off-site";
}

export interface Material {
  id: string;
  name: string;
  quantity: string;
  origin: string;
  embodiedCarbon: number;
  circularity: number;
  status: "on-site" | "incoming" | "available";
}

export interface MetricPoint {
  time: string;
  actual: number;
  target: number;
}

export interface CarbonPoint {
  month: string;
  baseline: number;
  civora: number;
}

export interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  time: string;
}

export interface AppState {
  selectedSite: string;
  alerts: Alert[];
  tasks: Task[];
  theme: "dark" | "light";
  acknowledgedTour: boolean;
}
