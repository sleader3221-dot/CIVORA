import {
  AlertTriangle,
  ArrowRight,
  Box,
  Camera,
  ChevronRight,
  Droplets,
  Eye,
  Gauge,
  Layers3,
  MapPin,
  Maximize2,
  Radio,
  ThermometerSun,
  Users,
  Volume2,
  Wind,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { floorPlans, zones } from "../data/demo";
import type { EquipmentPosition, FloorPlan, WorkerPosition, Zone } from "../types";
import { cn } from "../lib/utils";
import { Panel, ProgressBar, RiskBadge, SectionHeader, StatusDot } from "../components/Primitives";

type TwinLayer = "risk" | "workers" | "environment" | "assets";

export function DigitalTwin({ zones: liveZones }: { zones: Zone[] }) {
  const [activeLayer, setActiveLayer] = useState<TwinLayer>("risk");
  const [selectedZone, setSelectedZone] = useState<Zone>(liveZones[4]);
  const [cameraMode, setCameraMode] = useState(false);
  const [timeIndex, setTimeIndex] = useState(8);
  const [activeFloor, setActiveFloor] = useState(0);
  const [selectedWorker, setSelectedWorker] = useState<WorkerPosition | null>(null);
  const [selectedEquip, setSelectedEquip] = useState<EquipmentPosition | null>(null);

  const layers: Array<{ id: TwinLayer; label: string; icon: typeof Box }> = [
    { id: "risk", label: "Risk", icon: AlertTriangle },
    { id: "workers", label: "People", icon: Users },
    { id: "environment", label: "Environment", icon: Wind },
    { id: "assets", label: "Assets", icon: Box }
  ];

  const floor = floorPlans[activeFloor];

  const roomsByRisk = useMemo(() => {
    const c = { critical: 0, high: 0, medium: 0, low: 0 };
    floor.rooms.forEach((r) => { c[r.risk]++; });
    return c;
  }, [floor]);

  const tempColor = (temp: number) => {
    if (temp >= 36) return "temp-critical";
    if (temp >= 33) return "temp-high";
    if (temp >= 30) return "temp-medium";
    return "temp-low";
  };

  return (
    <div className="workspace twin-workspace">
      <div className="workspace-intro">
        <div>
          <p className="eyebrow">SPATIAL OPERATIONS</p>
          <h2>One live view of the physical site.</h2>
          <p>
            Fuse location, environmental, equipment, and workforce signals to act before
            disruption becomes an incident.
          </p>
        </div>
        <div className="intro-actions">
          <span className="data-quality"><StatusDot tone="green" pulse /> 97.4% data quality</span>
          <button type="button" className="secondary-button" onClick={() => setCameraMode(true)}>
            <Camera size={16} /> Open vision feed
          </button>
        </div>
      </div>

      <div className="twin-layout">
        <Panel className="twin-stage-panel">
          <div className="twin-toolbar">
            <div className="layer-tabs">
              {layers.map((layer) => {
                const Icon = layer.icon;
                return (
                  <button
                    type="button"
                    key={layer.id}
                    className={cn(activeLayer === layer.id && "is-active")}
                    onClick={() => setActiveLayer(layer.id)}
                  >
                    <Icon size={15} /> {layer.label}
                  </button>
                );
              })}
            </div>
            <div className="twin-toolbar__right">
              <span><Radio size={14} /> LIVE</span>
              <button type="button" className="icon-button" aria-label="Fullscreen twin"
                onClick={() => document.documentElement.requestFullscreen?.().catch(() => {})}>
                <Maximize2 size={16} />
              </button>
            </div>
          </div>

          <div className={cn("digital-twin", `digital-twin--${activeLayer}`)}>
            <div className="digital-twin__grid" />
            <div className="north-arrow">N <span /></div>

            {/* Building outline */}
            <div className="twin-building">
              <div className="twin-building__label">{floor.name} — {floor.rooms.length} zones</div>

              {/* Room rectangles */}
              {floor.rooms.map((room) => {
                const layerClass = activeLayer === "risk" ? `risk-room--${room.risk}` :
                  activeLayer === "environment" ? tempColor(room.temperature) :
                  activeLayer === "workers" ? (room.occupants > 5 ? "worker-dense" : "worker-sparse") :
                  "asset-room";
                return (
                  <div
                    key={room.id}
                    className={cn("twin-room", layerClass, `twin-room--${room.type}`)}
                    style={{ left: `${room.x}%`, top: `${room.y}%`, width: `${room.width}%`, height: `${room.height}%` }}
                    title={`${room.name} — ${room.occupants} occupants — ${room.temperature}°C`}
                  >
                    <span className="twin-room__label">{room.type === "workspace" || room.type === "corridor" ? room.name : ""}</span>
                    {activeLayer === "environment" && <span className="twin-room__temp">{room.temperature}°</span>}
                    {activeLayer === "workers" && room.occupants > 0 && <span className="twin-room__occ">{room.occupants}</span>}
                  </div>
                );
              })}

              {/* Worker dots */}
              {activeLayer === "workers" && floor.workers.map((worker) => (
                <button
                  key={worker.id}
                  type="button"
                  className={cn("twin-worker", selectedWorker?.id === worker.id && "is-selected")}
                  style={{ left: `${worker.x}%`, top: `${worker.y}%` }}
                  onClick={(e) => { e.stopPropagation(); setSelectedWorker(worker); setSelectedEquip(null); }}
                  title={`${worker.name} — ${worker.role}`}
                >
                  <span className="twin-worker__dot" />
                  <span className="twin-worker__name">{worker.name}</span>
                  <span className={cn("twin-worker__status", `worker-${worker.status}`)} />
                </button>
              ))}

              {/* Equipment markers */}
              {activeLayer === "assets" && floor.equipment.map((eq) => (
                <button
                  key={eq.id}
                  type="button"
                  className={cn("twin-equip", selectedEquip?.id === eq.id && "is-selected", `equip-${eq.status}`)}
                  style={{ left: `${eq.x}%`, top: `${eq.y}%` }}
                  onClick={(e) => { e.stopPropagation(); setSelectedEquip(eq); setSelectedWorker(null); }}
                  title={`${eq.name} — ${eq.type}`}
                >
                  <span className="twin-equip__icon">{eq.icon}</span>
                  <span className="twin-equip__name">{eq.name}</span>
                </button>
              ))}

              {/* Structural grid */}
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={`col-${i}`} className="structural-column" style={{
                  left: `${8 + (i % 6) * 16}%`,
                  top: `${6 + Math.floor(i / 6) * 26}%`,
                  width: "3%", height: "3%"
                }} />
              ))}

              {/* Zone boundaries from original data */}
              {liveZones.map((zone) => (
                <button
                  type="button"
                  key={zone.id}
                  className={cn("twin-zone-overlay", `twin-zone-overlay--${zone.risk}`, selectedZone.id === zone.id && "is-active")}
                  style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.width}%`, height: `${zone.height}%` }}
                  onClick={() => setSelectedZone(zone)}
                  title={`${zone.name}: ${zone.risk} risk`}
                >
                  <span>{zone.name}</span>
                </button>
              ))}

              {/* Sensor clusters */}
              <div className="sensor-cluster sensor-cluster--one">
                <span /><span /><span /><small>12</small>
              </div>
              <div className="sensor-cluster sensor-cluster--two">
                <span /><span /><span /><small>8</small>
              </div>
            </div>
          </div>

          {/* Floor selector */}
          <div className="floor-tabs">
            {floorPlans.map((f, index) => (
              <button
                key={f.id}
                type="button"
                className={cn("floor-tab", activeFloor === index && "is-active")}
                onClick={() => { setActiveFloor(index); setSelectedWorker(null); setSelectedEquip(null); }}
              >
                <span className="floor-tab__level">L.{f.level}</span>
                <span className="floor-tab__name">{f.name}</span>
                <RiskBadge level={f.risk} />
              </button>
            ))}
          </div>

          {/* Floor legend */}
          <div className="floor-legend">
            <span><StatusDot tone="green" /> Low risk</span>
            <span><StatusDot tone="amber" /> Medium risk</span>
            <span><StatusDot tone="red" /> High risk</span>
            <span className="floor-legend__divider" />
            <span><i className="floor-legend__dot" /> Workers</span>
            <span><i className="floor-legend__equip" /> Equipment</span>
          </div>

          {/* Timeline */}
          <div className="timeline-control">
            <button type="button" className="timeline-live">LIVE</button>
            <span>06:00</span>
            <input
              type="range" min="0" max="12" value={timeIndex}
              onChange={(event) => setTimeIndex(Number(event.target.value))}
              aria-label="Twin timeline"
            />
            <span>{`${String(8 + Math.floor(timeIndex / 2)).padStart(2, "0")}:${timeIndex % 2 ? "30" : "00"}`}</span>
            <span>Forecast +2h</span>
          </div>
        </Panel>

        <Panel className="zone-inspector">
          <SectionHeader
            eyebrow="ZONE INSPECTOR"
            title={selectedZone.name}
            action={<RiskBadge level={selectedZone.risk} />}
          />
          <p className="zone-inspector__type">{selectedZone.type} • {selectedZone.status}</p>

          <div className="zone-vitals">
            <div>
              <ThermometerSun size={17} />
              <span>Temperature</span>
              <strong>{selectedZone.temperature}°C</strong>
              <small className={selectedZone.temperature >= 34 ? "negative" : "positive"}>
                {selectedZone.temperature >= 34 ? "Above limit" : "Nominal"}
              </small>
            </div>
            <div>
              <Wind size={17} />
              <span>Air quality</span>
              <strong>{selectedZone.airQuality}</strong>
              <small>AQI index</small>
            </div>
            <div>
              <Volume2 size={17} />
              <span>Noise</span>
              <strong>{selectedZone.noise} dB</strong>
              <small>{selectedZone.noise > 85 ? "Protection required" : "Within limit"}</small>
            </div>
            <div>
              <Users size={17} />
              <span>People</span>
              <strong>{selectedZone.workers}</strong>
              <small>3 crews</small>
            </div>
          </div>

          {/* Floor & room info */}
          <div className="zone-floor-info">
            <p className="eyebrow">CURRENT FLOOR</p>
            <div className="zone-floor-stats">
              <span>{floor.name}</span>
              <span><strong>{floor.workers.length}</strong> workers</span>
              <span><strong>{floor.equipment.length}</strong> equipment</span>
              <span><strong>{roomsByRisk.critical + roomsByRisk.high}</strong> risk zones</span>
            </div>
          </div>

          {/* Selected worker detail */}
          {selectedWorker && (
            <div className="twin-detail-card">
              <div className="twin-detail-card__head">
                <span className="twin-detail-card__avatar">{selectedWorker.avatar}</span>
                <div>
                  <strong>{selectedWorker.name}</strong>
                  <small>{selectedWorker.role}</small>
                </div>
                <span className={cn("twin-detail-card__status", `detail-${selectedWorker.status}`)}>
                  {selectedWorker.status}
                </span>
              </div>
              <button type="button" className="text-button" onClick={() => setSelectedWorker(null)}>
                <X size={14} /> Dismiss
              </button>
            </div>
          )}

          {/* Selected equipment detail */}
          {selectedEquip && (
            <div className="twin-detail-card">
              <div className="twin-detail-card__head">
                <span className="twin-detail-card__icon">{selectedEquip.icon}</span>
                <div>
                  <strong>{selectedEquip.name}</strong>
                  <small>{selectedEquip.type}</small>
                </div>
                <span className={cn("twin-detail-card__status", `detail-${selectedEquip.status}`)}>
                  {selectedEquip.status}
                </span>
              </div>
              <button type="button" className="text-button" onClick={() => setSelectedEquip(null)}>
                <X size={14} /> Dismiss
              </button>
            </div>
          )}

          <div className="zone-risk-forecast">
            <div className="zone-risk-forecast__head">
              <span><Gauge size={15} /> Risk forecast</span>
              <strong>Next 2 hours</strong>
            </div>
            <div className="risk-forecast-bars">
              {[38, 44, 57, 72, 84, 79, 66, 52].map((value, index) => (
                <span key={index} style={{ height: `${value}%` }} className={value > 75 ? "is-risk" : ""} />
              ))}
            </div>
            <p>Peak exposure forecast at 12:20 due to heat and reduced ventilation.</p>
          </div>

          <div className="sensor-health">
            <div className="sensor-health__head">
              <span><Layers3 size={15} /> Sensor coverage</span>
              <strong>24 / 25 online</strong>
            </div>
            <ProgressBar value={96} tone="lime" />
            <div className="sensor-health__items">
              <span><StatusDot tone="green" /> Environment 8/8</span>
              <span><StatusDot tone="green" /> Access 6/6</span>
              <span><StatusDot tone="amber" /> Asset tags 10/11</span>
            </div>
          </div>

          <button type="button" className="primary-button zone-inspector__button" onClick={() => setCameraMode(true)}>
            <Eye size={16} /> Inspect live feed <ChevronRight size={15} />
          </button>
        </Panel>
      </div>

      <div className="twin-insights">
        <button type="button" className="panel insight-card" onClick={() => { setActiveFloor(0); setActiveLayer("risk"); }}>
          <span className="insight-icon insight-icon--red"><AlertTriangle size={18} /></span>
          <div><small>GROUND FLOOR</small><strong>Heat stress in Loading Bay</strong><p>35°C • 6 workers exposed • Immediate action advised</p></div>
          <ChevronRight size={17} />
        </button>
        <button type="button" className="panel insight-card" onClick={() => { setActiveFloor(2); setActiveLayer("workers"); }}>
          <span className="insight-icon insight-icon--cyan"><Users size={18} /></span>
          <div><small>LEVEL 12</small><strong>Finishing crew at target</strong><p>4 workers on schedule • QA inspection in progress</p></div>
          <ChevronRight size={17} />
        </button>
        <button type="button" className="panel insight-card" onClick={() => { setActiveFloor(0); setActiveLayer("assets"); }}>
          <span className="insight-icon insight-icon--lime"><Box size={18} /></span>
          <div><small>GROUND FLOOR</small><strong>Crane T-01 operational</strong><p>76% fuel • 1,420 hrs • Next service in 48 hrs</p></div>
          <ChevronRight size={17} />
        </button>
      </div>

      {cameraMode && (
        <div className="modal-layer camera-modal-layer" role="dialog" aria-modal="true">
          <button className="modal-scrim" onClick={() => setCameraMode(false)} aria-label="Close feed" />
          <div className="camera-modal">
            <div className="camera-modal__head">
              <div>
                <p className="eyebrow">EDGE VISION • CAM-07</p>
                <h2>{selectedZone.name} live feed</h2>
              </div>
              <button type="button" className="icon-button" onClick={() => setCameraMode(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="camera-feed">
              <div className="camera-feed__scanline" />
              <span className="camera-person camera-person--one"><i /> Worker • PPE 98%</span>
              <span className="camera-person camera-person--two"><i /> Worker • PPE 96%</span>
              <span className="camera-hazard"><i /> Heat zone • 35.2°C</span>
              <div className="camera-feed__stamp"><StatusDot tone="red" pulse /> LIVE • {new Date().toLocaleTimeString()}</div>
            </div>
            <div className="camera-modal__footer">
              <span><Eye size={15} /> Privacy-preserving edge inference</span>
              <p>Faces are never stored. Only safety events and anonymized coordinates leave the camera.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
