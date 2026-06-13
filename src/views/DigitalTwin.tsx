import {
  AlertTriangle,
  Box,
  Camera,
  ChevronRight,
  Droplets,
  Eye,
  Gauge,
  Layers3,
  Maximize2,
  Radio,
  ThermometerSun,
  Users,
  Volume2,
  Wind,
  X
} from "lucide-react";
import { useState } from "react";
import type { Zone } from "../types";
import { cn } from "../lib/utils";
import { Panel, ProgressBar, RiskBadge, SectionHeader, StatusDot } from "../components/Primitives";

type TwinLayer = "risk" | "workers" | "environment" | "assets";

export function DigitalTwin({ zones }: { zones: Zone[] }) {
  const [activeLayer, setActiveLayer] = useState<TwinLayer>("risk");
  const [selectedZone, setSelectedZone] = useState<Zone>(zones[4]);
  const [cameraMode, setCameraMode] = useState(false);
  const [timeIndex, setTimeIndex] = useState(8);

  const layers: Array<{ id: TwinLayer; label: string; icon: typeof Box }> = [
    { id: "risk", label: "Risk", icon: AlertTriangle },
    { id: "workers", label: "People", icon: Users },
    { id: "environment", label: "Environment", icon: Wind },
    { id: "assets", label: "Assets", icon: Box }
  ];

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
            {zones.map((zone) => {
              const isSelected = selectedZone.id === zone.id;
              const layerValue =
                activeLayer === "workers"
                  ? `${zone.workers}`
                  : activeLayer === "environment"
                    ? `${zone.temperature}°`
                    : activeLayer === "assets"
                      ? `${Math.max(2, Math.round(zone.workers / 6))} tools`
                      : zone.risk;
              return (
                <button
                  type="button"
                  key={zone.id}
                  className={cn(
                    "twin-zone",
                    `twin-zone--${zone.risk}`,
                    isSelected && "is-selected"
                  )}
                  style={{
                    left: `${zone.x}%`,
                    top: `${zone.y}%`,
                    width: `${zone.width}%`,
                    height: `${zone.height}%`,
                    "--height": `${25 + zone.workers}px`
                  } as React.CSSProperties}
                  onClick={() => setSelectedZone(zone)}
                >
                  <span className="twin-zone__roof" />
                  <span className="twin-zone__side" />
                  <span className="twin-zone__label">
                    <strong>{zone.name}</strong>
                    <small>{layerValue}</small>
                  </span>
                  {zone.risk === "critical" && <span className="risk-radar" />}
                </button>
              );
            })}
            <div className="sensor-cluster sensor-cluster--one">
              <span /><span /><span /><small>12</small>
            </div>
            <div className="sensor-cluster sensor-cluster--two">
              <span /><span /><span /><small>8</small>
            </div>
          </div>

          <div className="timeline-control">
            <button type="button" className="timeline-live">LIVE</button>
            <span>06:00</span>
            <input
              type="range"
              min="0"
              max="12"
              value={timeIndex}
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
        <button type="button" className="panel" style={{ cursor: "pointer", textAlign: "left", border: "var(--border)", display: "grid", gridTemplateColumns: "35px 1fr 16px", alignItems: "center", gap: 10, padding: 12 }}
          onClick={() => setTimeIndex(10)}>
          <span className="insight-icon insight-icon--red"><AlertTriangle size={18} /></span>
          <div><small>PREDICTED CONFLICT</small><strong>Crane path × delivery route</strong><p>11:35 • Loading Bay • 81% confidence</p></div>
          <ChevronRight size={17} />
        </button>
        <button type="button" className="panel" style={{ cursor: "pointer", textAlign: "left", border: "var(--border)", display: "grid", gridTemplateColumns: "35px 1fr 16px", alignItems: "center", gap: 10, padding: 12 }}
          onClick={() => setSelectedZone(zones.find((z) => z.name === "Tower A") ?? zones[0])}>
          <span className="insight-icon insight-icon--cyan"><Droplets size={18} /></span>
          <div><small>RESOURCE SIGNAL</small><strong>Water use 14% above model</strong><p>Tower A • probable valve leak</p></div>
          <ChevronRight size={17} />
        </button>
        <button type="button" className="panel" style={{ cursor: "pointer", textAlign: "left", border: "var(--border)", display: "grid", gridTemplateColumns: "35px 1fr 16px", alignItems: "center", gap: 10, padding: 12 }}
          onClick={() => setSelectedZone(zones.find((z) => z.name === "Tower B") ?? zones[0])}>
          <span className="insight-icon insight-icon--lime"><Users size={18} /></span>
          <div><small>FLOW OPTIMIZATION</small><strong>Move Crew 3 to Tower B</strong><p>Recover 22 worker-minutes this hour</p></div>
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
              <div className="camera-feed__stamp"><StatusDot tone="red" pulse /> LIVE • 10:24:18</div>
            </div>
            <div className="camera-modal__footer">
              <span><ShieldCheckIcon /> Privacy-preserving edge inference</span>
              <p>Faces are never stored. Only safety events and anonymized coordinates leave the camera.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShieldCheckIcon() {
  return <Eye size={15} />;
}
