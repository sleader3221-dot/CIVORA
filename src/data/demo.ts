import type {
  Activity,
  Alert,
  CarbonPoint,
  CostData,
  FloorPlan,
  Material,
  MetricPoint,
  PhotoDocument,
  Site,
  Task,
  ToolAsset,
  WeatherData,
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

export const weatherData: WeatherData = {
  condition: "hazy",
  temperature: 33,
  humidity: 68,
  windSpeed: 12,
  uvIndex: 8,
  forecast: [
    { day: "Today", high: 35, low: 26, condition: "Hazy sun" },
    { day: "Mon", high: 33, low: 25, condition: "Thunderstorms" },
    { day: "Tue", high: 31, low: 24, condition: "Heavy rain" },
    { day: "Wed", high: 32, low: 25, condition: "Cloudy" },
    { day: "Thu", high: 34, low: 26, condition: "Hazy sun" }
  ],
  warnings: [
    { type: "Heat stress", severity: "critical", text: "WBGT index exceeds safe threshold for sustained work between 11:00–15:00" },
    { type: "Lightning", severity: "high", text: "Isolated thunderstorms forecast Monday afternoon — crane ops must stop" }
  ]
};

export const costData: CostData = {
  budget: 42800000,
  actual: 39240000,
  forecast: 42680000,
  variance: 3.6,
  categories: [
    { name: "Structural", budget: 14200000, actual: 13100000 },
    { name: "MEP", budget: 9800000, actual: 9150000 },
    { name: "Finishes", budget: 7600000, actual: 6980000 },
    { name: "Envelope", budget: 6200000, actual: 5740000 },
    { name: "Siteworks", budget: 5000000, actual: 4270000 }
  ]
};

export const photoDocuments: PhotoDocument[] = [
  { id: "p-1", title: "Tower A slab pour", date: "Today 07:30", thumbnail: "", location: "Tower A", category: "progress" },
  { id: "p-2", title: "MEP corridor rough-in", date: "Yesterday 16:10", thumbnail: "", location: "MEP Corridor", category: "progress" },
  { id: "p-3", title: "PPE compliance check", date: "Yesterday 09:00", thumbnail: "", location: "Loading Bay", category: "safety" },
  { id: "p-4", title: "Drone overview — level 12", date: "2 days ago", thumbnail: "", location: "Tower A", category: "drone" },
  { id: "p-5", title: "Reclaimed steel delivery", date: "3 days ago", thumbnail: "", location: "Material Yard", category: "quality" },
  { id: "p-6", title: "Crane inspection", date: "4 days ago", thumbnail: "", location: "Tower B", category: "safety" }
];

export const equipmentTelemetryInit = [
  { id: "eq-1", name: "Tower crane T-01", type: "Lattice boom", status: "online" as const, battery: 100, fuelLevel: 76, operatingHours: 1420, location: { zone: "Tower A", level: "Ground" }, lastCommunication: new Date() },
  { id: "eq-2", name: "Mobile crane MC-3", type: "All-terrain", status: "online" as const, battery: 100, fuelLevel: 62, operatingHours: 886, location: { zone: "Loading Bay", level: "Ground" }, lastCommunication: new Date() },
  { id: "eq-3", name: "Concrete pump CP-2", type: "Truck-mounted", status: "online" as const, battery: 100, fuelLevel: 44, operatingHours: 214, location: { zone: "Tower B", level: "Ground" }, lastCommunication: new Date() },
  { id: "eq-4", name: "Generator G-07", type: "Diesel 150kVA", status: "maintenance" as const, battery: 100, fuelLevel: 18, operatingHours: 3200, location: { zone: "Material Yard", level: "Ground" }, lastCommunication: new Date() },
  { id: "eq-5", name: "Hoist H-02", type: "Personnel/material", status: "online" as const, battery: 100, fuelLevel: 88, operatingHours: 654, location: { zone: "Tower A", level: "Shaft B" }, lastCommunication: new Date() }
];

export const floorPlans: FloorPlan[] = [
  {
    id: "fl-gf",
    name: "Ground Floor",
    level: 0,
    width: 100, height: 100,
    temperature: 33,
    risk: "medium",
    rooms: [
      { id: "rm-ent", name: "Main Entrance", x: 8, y: 2, width: 18, height: 10, type: "workspace", occupants: 4, temperature: 32, risk: "low" },
      { id: "rm-lobby", name: "Lobby", x: 8, y: 14, width: 18, height: 16, type: "workspace", occupants: 6, temperature: 31, risk: "low" },
      { id: "rm-cores", name: "Core A", x: 30, y: 2, width: 10, height: 28, type: "core", occupants: 0, temperature: 33, risk: "low" },
      { id: "rm-off1", name: "Site Office", x: 44, y: 2, width: 20, height: 12, type: "workspace", occupants: 8, temperature: 29, risk: "low" },
      { id: "rm-off2", name: "Meeting Room", x: 44, y: 16, width: 20, height: 14, type: "workspace", occupants: 3, temperature: 28, risk: "low" },
      { id: "rm-cor1", name: "Main Corridor", x: 68, y: 2, width: 24, height: 8, type: "corridor", occupants: 2, temperature: 32, risk: "low" },
      { id: "rm-mep", name: "MEP Room", x: 68, y: 12, width: 10, height: 16, type: "mep", occupants: 1, temperature: 36, risk: "medium" },
      { id: "rm-stor", name: "Material Store", x: 80, y: 12, width: 12, height: 16, type: "storage", occupants: 0, temperature: 33, risk: "low" },
      { id: "rm-rest", name: "Rest Area", x: 44, y: 32, width: 18, height: 10, type: "workspace", occupants: 5, temperature: 30, risk: "low" },
      { id: "rm-stair-a", name: "Stair A", x: 64, y: 32, width: 6, height: 10, type: "stair", occupants: 0, temperature: 31, risk: "low" },
      { id: "rm-elev", name: "Elevator Bank", x: 72, y: 32, width: 8, height: 10, type: "elevator", occupants: 0, temperature: 30, risk: "low" },
      { id: "rm-cor-w", name: "West Wing", x: 8, y: 32, width: 20, height: 12, type: "corridor", occupants: 3, temperature: 34, risk: "low" },
      { id: "rm-wc", name: "Washrooms", x: 8, y: 46, width: 10, height: 8, type: "restroom", occupants: 0, temperature: 29, risk: "low" },
      { id: "rm-load", name: "Loading Dock", x: 30, y: 46, width: 40, height: 14, type: "workspace", occupants: 6, temperature: 35, risk: "high" },
      { id: "rm-yard", name: "Material Yard", x: 2, y: 62, width: 60, height: 30, type: "storage", occupants: 8, temperature: 36, risk: "medium" },
    ],
    workers: [
      { id: "wf-1", name: "Nadia R.", x: 12, y: 20, role: "Safety Lead", status: "active", avatar: "NR" },
      { id: "wf-2", name: "Faris H.", x: 50, y: 8, role: "Tool Coordinator", status: "active", avatar: "FH" },
      { id: "wf-3", name: "Mei L.", x: 46, y: 22, role: "Site Engineer", status: "active", avatar: "ML" },
      { id: "wf-4", name: "Rahim U.", x: 40, y: 52, role: "Steel Fixer", status: "active", avatar: "RU" },
      { id: "wf-5", name: "Arun K.", x: 70, y: 18, role: "MEP Technician", status: "active", avatar: "AK" },
      { id: "wf-6", name: "Siti N.", x: 14, y: 8, role: "Security", status: "active", avatar: "SN" },
      { id: "wf-7", name: "Wei M.", x: 14, y: 38, role: "Laborer", status: "resting", avatar: "WM" },
      { id: "wf-8", name: "Raj P.", x: 55, y: 50, role: "Rigger", status: "active", avatar: "RP" },
    ],
    equipment: [
      { id: "ef-1", name: "Forklift FL-1", x: 35, y: 52, type: "Forklift", icon: "🚜", status: "operational" },
      { id: "ef-2", name: "Generator G-07", x: 82, y: 18, type: "Diesel Gen", icon: "⚡", status: "maintenance" },
      { id: "ef-3", name: "Mobile Crane", x: 55, y: 68, type: "Crane", icon: "🏗️", status: "operational" },
      { id: "ef-4", name: "Concrete Pump", x: 20, y: 76, type: "Pump", icon: "🔧", status: "idle" },
    ]
  },
  {
    id: "fl-l5",
    name: "Level 5",
    level: 5,
    width: 100, height: 100,
    temperature: 31,
    risk: "medium",
    rooms: [
      { id: "r5-core", name: "Core & Lobby", x: 10, y: 2, width: 14, height: 24, type: "core", occupants: 0, temperature: 30, risk: "low" },
      { id: "r5-mep", name: "MEP Shaft", x: 10, y: 28, width: 8, height: 12, type: "mep", occupants: 1, temperature: 34, risk: "medium" },
      { id: "r5-open-a", name: "Open Plan A", x: 28, y: 2, width: 34, height: 22, type: "workspace", occupants: 12, temperature: 30, risk: "low" },
      { id: "r5-open-b", name: "Open Plan B", x: 28, y: 26, width: 34, height: 14, type: "workspace", occupants: 8, temperature: 31, risk: "low" },
      { id: "r5-balc", name: "Balcony", x: 28, y: 42, width: 34, height: 8, type: "workspace", occupants: 2, temperature: 35, risk: "high" },
      { id: "r5-stair", name: "Stairwell B", x: 66, y: 2, width: 6, height: 18, type: "stair", occupants: 0, temperature: 29, risk: "low" },
      { id: "r5-elev", name: "Elevator B", x: 66, y: 22, width: 6, height: 10, type: "elevator", occupants: 0, temperature: 29, risk: "low" },
      { id: "r5-corridor", name: "East Corridor", x: 76, y: 2, width: 18, height: 38, type: "corridor", occupants: 3, temperature: 32, risk: "low" },
      { id: "r5-rest", name: "Rest Area", x: 76, y: 42, width: 18, height: 8, type: "workspace", occupants: 2, temperature: 29, risk: "low" },
      { id: "r5-store", name: "Tool Store", x: 4, y: 44, width: 20, height: 10, type: "storage", occupants: 0, temperature: 30, risk: "low" },
    ],
    workers: [
      { id: "w5-1", name: "Ali B.", x: 42, y: 8, role: "Carpenter", status: "active", avatar: "AB" },
      { id: "w5-2", name: "Tan S.", x: 50, y: 14, role: "Carpenter", status: "active", avatar: "TS" },
      { id: "w5-3", name: "Lim C.", x: 38, y: 32, role: "Electrician", status: "active", avatar: "LC" },
      { id: "w5-4", name: "Siva K.", x: 80, y: 18, role: "Supervisor", status: "active", avatar: "SK" },
      { id: "w5-5", name: "Muthu R.", x: 14, y: 32, role: "MEP Fitter", status: "resting", avatar: "MR" },
      { id: "w5-6", name: "Peter W.", x: 54, y: 30, role: "Welder", status: "active", avatar: "PW" },
    ],
    equipment: [
      { id: "e5-1", name: "Welder W-3", x: 50, y: 32, type: "Welding Unit", icon: "🔥", status: "operational" },
      { id: "e5-2", name: "Scaffold Set 5", x: 80, y: 34, type: "Scaffolding", icon: "🔩", status: "operational" },
    ]
  },
  {
    id: "fl-l12",
    name: "Level 12",
    level: 12,
    width: 100, height: 100,
    temperature: 28,
    risk: "low",
    rooms: [
      { id: "r12-core", name: "Core", x: 8, y: 4, width: 12, height: 22, type: "core", occupants: 0, temperature: 27, risk: "low" },
      { id: "r12-mep", name: "MEP Riser", x: 8, y: 28, width: 8, height: 10, type: "mep", occupants: 1, temperature: 30, risk: "low" },
      { id: "r12-open", name: "Premium Suite A", x: 24, y: 4, width: 40, height: 20, type: "workspace", occupants: 6, temperature: 26, risk: "low" },
      { id: "r12-conf", name: "Conference", x: 24, y: 26, width: 18, height: 14, type: "workspace", occupants: 2, temperature: 26, risk: "low" },
      { id: "r12-stair", name: "Stairwell", x: 68, y: 4, width: 6, height: 36, type: "stair", occupants: 0, temperature: 27, risk: "low" },
      { id: "r12-cor", name: "Corridor", x: 78, y: 4, width: 16, height: 36, type: "corridor", occupants: 2, temperature: 27, risk: "low" },
      { id: "r12-fin", name: "Finishing Zone", x: 24, y: 42, width: 40, height: 12, type: "workspace", occupants: 4, temperature: 29, risk: "medium" },
    ],
    workers: [
      { id: "w12-1", name: "John C.", x: 38, y: 12, role: "Finisher", status: "active", avatar: "JC" },
      { id: "w12-2", name: "Ken L.", x: 50, y: 10, role: "Painter", status: "active", avatar: "KL" },
      { id: "w12-3", name: "Diana M.", x: 34, y: 46, role: "QA Inspector", status: "active", avatar: "DM" },
      { id: "w12-4", name: "Zaki R.", x: 82, y: 20, role: "Laborer", status: "resting", avatar: "ZR" },
    ],
    equipment: [
      { id: "e12-1", name: "Paint Sprayer", x: 46, y: 46, type: "Equipment", icon: "🎨", status: "operational" },
      { id: "e12-2", name: "Hoist H-02", x: 14, y: 14, type: "Hoist", icon: "⬆️", status: "operational" },
    ]
  },
  {
    id: "fl-rf",
    name: "Roof",
    level: 18,
    width: 100, height: 100,
    temperature: 36,
    risk: "high",
    rooms: [
      { id: "rf-core", name: "Roof Core", x: 8, y: 4, width: 12, height: 18, type: "core", occupants: 0, temperature: 34, risk: "low" },
      { id: "rf-mep", name: "MEP Penthouse", x: 8, y: 24, width: 16, height: 14, type: "mep", occupants: 2, temperature: 38, risk: "medium" },
      { id: "rf-deck", name: "Roof Deck", x: 28, y: 4, width: 48, height: 30, type: "workspace", occupants: 4, temperature: 37, risk: "high" },
      { id: "rf-crane", name: "Crane Base", x: 28, y: 36, width: 14, height: 14, type: "workspace", occupants: 1, temperature: 36, risk: "high" },
      { id: "rf-stair", name: "Stair Access", x: 80, y: 4, width: 6, height: 18, type: "stair", occupants: 0, temperature: 33, risk: "low" },
      { id: "rf-margin", name: "Edge Zone", x: 50, y: 36, width: 36, height: 14, type: "corridor", occupants: 0, temperature: 38, risk: "critical" },
    ],
    workers: [
      { id: "wr-1", name: "Crane Op", x: 34, y: 40, role: "Crane Operator", status: "active", avatar: "CR" },
      { id: "wr-2", name: "Hakim M.", x: 46, y: 14, role: "Steel Worker", status: "active", avatar: "HM" },
      { id: "wr-3", name: "Rajesh K.", x: 56, y: 20, role: "Steel Worker", status: "resting", avatar: "RK" },
      { id: "wr-4", name: "Chen W.", x: 14, y: 30, role: "MEP Tech", status: "active", avatar: "CW" },
    ],
    equipment: [
      { id: "er-1", name: "Tower Crane T-01", x: 34, y: 42, type: "Tower Crane", icon: "🏗️", status: "operational" },
      { id: "er-2", name: "Hoist Motor", x: 18, y: 10, type: "Hoist Mech", icon: "⚙️", status: "operational" },
    ]
  }
];

export const safetyMatrix = [
  { label: "Falls", likelihood: 3, impact: 5, trend: -12 },
  { label: "Struck-by", likelihood: 2, impact: 4, trend: -8 },
  { label: "Heat stress", likelihood: 4, impact: 4, trend: 19 },
  { label: "Electrical", likelihood: 2, impact: 5, trend: -4 },
  { label: "Silica exposure", likelihood: 3, impact: 4, trend: -15 }
];
