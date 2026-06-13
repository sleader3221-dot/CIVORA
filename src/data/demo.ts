import type {
  Activity,
  Alert,
  CarbonPoint,
  Material,
  MetricPoint,
  Site,
  Task,
  ToolAsset,
  Worker,
  Zone
} from "../types";

export const sites: Site[] = [
  {
    id: "merdeka",
    name: "Merdeka Residences",
    location: "Kuala Lumpur, MY",
    phase: "Structural works",
    progress: 68,
    targetDate: "28 Nov 2026"
  },
  {
    id: "penang",
    name: "Penang Transit Hub",
    location: "George Town, MY",
    phase: "Groundworks",
    progress: 31,
    targetDate: "14 Mar 2027"
  },
  {
    id: "johor",
    name: "Johor EcoCampus",
    location: "Iskandar Puteri, MY",
    phase: "Fit-out",
    progress: 84,
    targetDate: "09 Sep 2026"
  }
];

export const zones: Zone[] = [
  {
    id: "z-a",
    name: "Tower A",
    type: "High-rise core",
    x: 9,
    y: 10,
    width: 28,
    height: 53,
    risk: "medium",
    workers: 42,
    temperature: 31,
    airQuality: 94,
    noise: 76,
    status: "active"
  },
  {
    id: "z-b",
    name: "Tower B",
    type: "Floor plate",
    x: 44,
    y: 16,
    width: 26,
    height: 37,
    risk: "low",
    workers: 31,
    temperature: 29,
    airQuality: 97,
    noise: 68,
    status: "active"
  },
  {
    id: "z-c",
    name: "Loading Bay",
    type: "Logistics",
    x: 74,
    y: 10,
    width: 18,
    height: 26,
    risk: "high",
    workers: 14,
    temperature: 33,
    airQuality: 88,
    noise: 84,
    status: "restricted"
  },
  {
    id: "z-d",
    name: "Material Yard",
    type: "Storage",
    x: 43,
    y: 61,
    width: 23,
    height: 25,
    risk: "low",
    workers: 8,
    temperature: 30,
    airQuality: 98,
    noise: 61,
    status: "clear"
  },
  {
    id: "z-e",
    name: "MEP Corridor",
    type: "Services",
    x: 72,
    y: 48,
    width: 20,
    height: 38,
    risk: "critical",
    workers: 18,
    temperature: 35,
    airQuality: 72,
    noise: 89,
    status: "restricted"
  }
];

export const initialAlerts: Alert[] = [
  {
    id: "a-1",
    title: "Heat stress threshold exceeded",
    detail: "WBGT trend predicts unsafe exposure within 18 minutes.",
    zone: "MEP Corridor",
    level: "critical",
    status: "active",
    time: "2 min ago",
    category: "Environment"
  },
  {
    id: "a-2",
    title: "PPE compliance anomaly",
    detail: "Vision model detected missing eye protection near cutting station.",
    zone: "Loading Bay",
    level: "high",
    status: "active",
    time: "6 min ago",
    category: "PPE"
  },
  {
    id: "a-3",
    title: "Tool vibration drift",
    detail: "Angle grinder AG-4 vibration is 17% above its seven-day baseline.",
    zone: "Tower A",
    level: "medium",
    status: "active",
    time: "14 min ago",
    category: "Equipment"
  },
  {
    id: "a-4",
    title: "Delivery conflict forecast",
    detail: "Concrete truck arrival overlaps with crane exclusion window.",
    zone: "Loading Bay",
    level: "medium",
    status: "acknowledged",
    time: "24 min ago",
    category: "Schedule"
  }
];

export const initialTasks: Task[] = [
  {
    id: "t-1",
    title: "Deploy cooling station to MEP corridor",
    owner: "Nadia",
    due: "10:45",
    priority: "critical",
    completed: false
  },
  {
    id: "t-2",
    title: "Inspect AG-4 vibration mount",
    owner: "Faris",
    due: "11:20",
    priority: "medium",
    completed: false
  },
  {
    id: "t-3",
    title: "Approve reclaimed steel transfer",
    owner: "Mei Lin",
    due: "13:00",
    priority: "low",
    completed: true
  }
];

export const activities: Activity[] = [
  {
    id: "ac-1",
    title: "Cooling intervention dispatched",
    meta: "Nadia accepted AI recommendation",
    time: "Now",
    tone: "red"
  },
  {
    id: "ac-2",
    title: "Material passport verified",
    meta: "4.2 t reclaimed steel • Batch RS-2026-88",
    time: "8m",
    tone: "green"
  },
  {
    id: "ac-3",
    title: "Tool returned to smart locker",
    meta: "Rotary hammer TE 60-22 • 78% charge",
    time: "17m",
    tone: "blue"
  },
  {
    id: "ac-4",
    title: "Morning briefing completed",
    meta: "113 workers • 5 languages • 98% comprehension",
    time: "43m",
    tone: "amber"
  }
];

export const productivityData: MetricPoint[] = [
  { time: "06:00", actual: 72, target: 74 },
  { time: "07:00", actual: 76, target: 75 },
  { time: "08:00", actual: 81, target: 77 },
  { time: "09:00", actual: 84, target: 79 },
  { time: "10:00", actual: 87, target: 80 },
  { time: "11:00", actual: 89, target: 82 },
  { time: "12:00", actual: 91, target: 83 }
];

export const carbonData: CarbonPoint[] = [
  { month: "Jul", baseline: 640, civora: 611 },
  { month: "Aug", baseline: 612, civora: 568 },
  { month: "Sep", baseline: 590, civora: 526 },
  { month: "Oct", baseline: 566, civora: 484 },
  { month: "Nov", baseline: 540, civora: 438 },
  { month: "Dec", baseline: 518, civora: 397 }
];

export const tools: ToolAsset[] = [
  {
    id: "tool-1",
    name: "TE 60-22",
    type: "Rotary hammer",
    zone: "Tower A",
    battery: 78,
    health: 96,
    usageHours: 342,
    status: "in-use",
    serviceDue: 48
  },
  {
    id: "tool-2",
    name: "AG 4S-22",
    type: "Angle grinder",
    zone: "Tower A",
    battery: 54,
    health: 71,
    usageHours: 288,
    status: "maintenance",
    serviceDue: 3
  },
  {
    id: "tool-3",
    name: "SIW 6AT-22",
    type: "Impact wrench",
    zone: "MEP Corridor",
    battery: 86,
    health: 92,
    usageHours: 174,
    status: "in-use",
    serviceDue: 94
  },
  {
    id: "tool-4",
    name: "PR 40G-22",
    type: "Rotating laser",
    zone: "Smart locker",
    battery: 100,
    health: 99,
    usageHours: 61,
    status: "available",
    serviceDue: 180
  },
  {
    id: "tool-5",
    name: "VC 40M-X",
    type: "Dust extractor",
    zone: "Loading Bay",
    battery: 63,
    health: 88,
    usageHours: 209,
    status: "in-use",
    serviceDue: 72
  }
];

export const workers: Worker[] = [
  {
    id: "w-1",
    name: "Nadia Rahman",
    role: "Safety lead",
    zone: "MEP Corridor",
    shift: "06:00–14:00",
    competency: 96,
    fatigue: "low",
    language: "Bahasa Melayu",
    status: "on-site"
  },
  {
    id: "w-2",
    name: "Faris Hamdan",
    role: "Tool coordinator",
    zone: "Tower A",
    shift: "07:00–15:00",
    competency: 91,
    fatigue: "medium",
    language: "English",
    status: "on-site"
  },
  {
    id: "w-3",
    name: "Arun Kumar",
    role: "MEP technician",
    zone: "MEP Corridor",
    shift: "06:00–14:00",
    competency: 88,
    fatigue: "high",
    language: "Tamil",
    status: "break"
  },
  {
    id: "w-4",
    name: "Mei Lin Tan",
    role: "Site engineer",
    zone: "Material Yard",
    shift: "08:00–17:00",
    competency: 94,
    fatigue: "low",
    language: "Mandarin",
    status: "on-site"
  },
  {
    id: "w-5",
    name: "Rahim Uddin",
    role: "Steel fixer",
    zone: "Tower B",
    shift: "06:00–14:00",
    competency: 82,
    fatigue: "medium",
    language: "Bengali",
    status: "on-site"
  }
];

export const materials: Material[] = [
  {
    id: "m-1",
    name: "Reclaimed structural steel",
    quantity: "4.2 tonnes",
    origin: "Petaling Jaya recovery",
    embodiedCarbon: 0.42,
    circularity: 96,
    status: "on-site"
  },
  {
    id: "m-2",
    name: "Low-carbon concrete",
    quantity: "86 m³",
    origin: "Shah Alam batch plant",
    embodiedCarbon: 0.71,
    circularity: 68,
    status: "incoming"
  },
  {
    id: "m-3",
    name: "Reprocessed timber formwork",
    quantity: "132 sheets",
    origin: "Tower A reuse loop",
    embodiedCarbon: 0.18,
    circularity: 89,
    status: "available"
  }
];

export const safetyMatrix = [
  { label: "Falls", likelihood: 3, impact: 5, trend: -12 },
  { label: "Struck-by", likelihood: 2, impact: 4, trend: -8 },
  { label: "Heat stress", likelihood: 4, impact: 4, trend: 19 },
  { label: "Electrical", likelihood: 2, impact: 5, trend: -4 },
  { label: "Silica exposure", likelihood: 3, impact: 4, trend: -15 }
];
