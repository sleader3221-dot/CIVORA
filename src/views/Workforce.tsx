import {
  BadgeCheck,
  BrainCircuit,
  CalendarClock,
  Check,
  ChevronRight,
  CircleGauge,
  GraduationCap,
  Languages,
  MapPin,
  MessageSquareText,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  Timer,
  UserCheck,
  Users,
  Volume2
} from "lucide-react";
import { useMemo, useState } from "react";
import { workers } from "../data/demo";
import { cn } from "../lib/utils";
import { Panel, ProgressBar, RiskBadge, SectionHeader, StatusDot } from "../components/Primitives";

export function Workforce() {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("Bahasa Melayu");
  const [briefingPlaying, setBriefingPlaying] = useState(false);
  const [shiftOptimized, setShiftOptimized] = useState(false);

  const filteredWorkers = useMemo(
    () =>
      workers.filter((worker) =>
        `${worker.name} ${worker.role} ${worker.zone}`.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  return (
    <div className="workspace workforce-workspace">
      <div className="workspace-intro">
        <div>
          <p className="eyebrow">HUMAN-CENTERED OPERATIONS</p>
          <h2>Every worker informed, capable, and protected.</h2>
          <p>
            Match skills to tasks, communicate across languages, and manage fatigue without
            intrusive individual surveillance.
          </p>
        </div>
        <div className="intro-actions">
          <span className="privacy-badge"><ShieldCheck size={15} /> Privacy by design</span>
          <button type="button" className="primary-button" onClick={() => setShiftOptimized(true)}>
            <Sparkles size={16} /> Optimize shift
          </button>
        </div>
      </div>

      <div className="workforce-metrics">
        <Panel><span><Users size={20} /></span><div><small>ON SITE NOW</small><strong>113</strong><p>76% planned capacity</p></div></Panel>
        <Panel><span><UserCheck size={20} /></span><div><small>COMPETENCY COVERAGE</small><strong>94%</strong><p>3 task gaps detected</p></div></Panel>
        <Panel><span><CircleGauge size={20} /></span><div><small>FATIGUE RISK</small><strong>Low</strong><p>4 people need rotation</p></div></Panel>
        <Panel><span><BadgeCheck size={20} /></span><div><small>BRIEFING COMPLETE</small><strong>98%</strong><p>111 acknowledgements</p></div></Panel>
      </div>

      <div className="workforce-main-grid">
        <Panel className="crew-directory">
          <SectionHeader
            eyebrow="LIVE CREW DIRECTORY"
            title="People & readiness"
            action={
              <label className="table-search">
                <Search size={14} />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find worker..." />
              </label>
            }
          />
          <div className="crew-table">
            <div className="crew-table__head">
              <span>Worker</span><span>Zone</span><span>Readiness</span><span>Fatigue</span><span>Status</span>
            </div>
            {filteredWorkers.map((worker) => (
              <article key={worker.id}>
                <div className="crew-identity">
                  <span>{worker.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>
                  <div><strong>{worker.name}</strong><small>{worker.role}</small></div>
                </div>
                <span className="crew-zone"><MapPin size={13} /> {worker.zone}</span>
                <div className="readiness-cell">
                  <ProgressBar value={worker.competency} tone={worker.competency > 90 ? "lime" : "cyan"} />
                  <strong>{worker.competency}%</strong>
                </div>
                <RiskBadge level={worker.fatigue} label={worker.fatigue} />
                <span className="crew-status"><StatusDot tone={worker.status === "on-site" ? "green" : worker.status === "break" ? "amber" : "muted"} /> {worker.status}</span>
              </article>
            ))}
          </div>
        </Panel>

        <Panel className="briefing-studio">
          <SectionHeader eyebrow="AI BRIEFING STUDIO" title="Speak every worker's language" />
          <div className="briefing-preview">
            <span className={cn("briefing-wave", briefingPlaying && "is-playing")}>
              {[28, 58, 41, 72, 34, 64, 48, 80, 43, 61, 31, 56].map((height, index) => (
                <i key={index} style={{ height: `${height}%` }} />
              ))}
            </span>
            <button type="button" onClick={() => setBriefingPlaying((current) => !current)}>
              {briefingPlaying ? <Volume2 size={18} /> : <Play size={18} />}
            </button>
            <div><strong>Morning heat safety briefing</strong><small>01:28 • AI voice • supervisor approved</small></div>
          </div>
          <label className="language-select">
            <Languages size={16} />
            <select value={language} onChange={(event) => setLanguage(event.target.value)}>
              <option>Bahasa Melayu</option><option>English</option><option>Tamil</option>
              <option>Bengali</option><option>Mandarin</option>
            </select>
          </label>
          <div className="briefing-script">
            <p className="eyebrow">SCRIPT PREVIEW • {language.toUpperCase()}</p>
            <p>
              {language === "Bahasa Melayu"
                ? "Hari ini suhu di koridor MEP dijangka tinggi. Minum air dengan kerap dan berehat di stesen penyejukan setiap 20 minit."
                : language === "Tamil"
                  ? "MEP பகுதியில் இன்று வெப்பநிலை அதிகமாக இருக்கும். தவறாமல் தண்ணீர் குடித்து, 20 நிமிடத்திற்கு ஒருமுறை ஓய்வு எடுக்கவும்."
                  : language === "Bengali"
                    ? "আজ MEP করিডোরে তাপমাত্রা বেশি থাকবে। নিয়মিত পানি পান করুন এবং প্রতি ২০ মিনিটে বিশ্রাম নিন।"
                    : language === "Mandarin"
                      ? "今天机电走廊温度较高。请定时补充水分，每工作二十分钟到降温站休息。"
                      : "Temperatures in the MEP corridor will be high today. Hydrate regularly and use the cooling station every 20 minutes."}
            </p>
          </div>
          <div className="briefing-comprehension">
            <div><span>Comprehension check</span><strong>98%</strong></div>
            <ProgressBar value={98} tone="lime" />
            <small>111 of 113 workers answered the confirmation correctly.</small>
          </div>
          <button type="button" className="secondary-button full-button"><MessageSquareText size={15} /> Send to crew devices</button>
        </Panel>
      </div>

      <div className="workforce-secondary-grid">
        <Panel className="skill-coverage">
          <SectionHeader eyebrow="SKILL GRAPH" title="Today's capability coverage" />
          {[
            { name: "Work at height", value: 96, need: "24 / 25 covered" },
            { name: "Hot work", value: 88, need: "14 / 16 covered" },
            { name: "Lifting operations", value: 100, need: "12 / 12 covered" },
            { name: "First response", value: 83, need: "5 / 6 covered" }
          ].map((skill) => (
            <div className="skill-row" key={skill.name}>
              <div><span>{skill.name}</span><small>{skill.need}</small></div>
              <ProgressBar value={skill.value} tone={skill.value === 100 ? "lime" : skill.value < 90 ? "amber" : "cyan"} />
              <strong>{skill.value}%</strong>
            </div>
          ))}
          <div className="skill-recommendation">
            <GraduationCap size={17} />
            <p><strong>Close tomorrow's gap:</strong> schedule a 12-minute hot-work refresher for two crew members.</p>
            <ChevronRight size={15} />
          </div>
        </Panel>

        <Panel className="shift-load">
          <SectionHeader eyebrow="FATIGUE GUARD" title="Shift load forecast" />
          <div className="shift-heatmap">
            {["06", "08", "10", "12", "14", "16"].map((hour, column) => (
              <div key={hour}>
                <small>{hour}:00</small>
                {[0, 1, 2, 3].map((row) => {
                  const intensity = (column + row * 2) % 5;
                  return <span key={row} className={`load-${intensity}`} />;
                })}
              </div>
            ))}
          </div>
          <div className="shift-alert">
            <Timer size={16} />
            <p><strong>12:00 peak:</strong> rotate Crew M2 fifteen minutes earlier to avoid cumulative heat load.</p>
          </div>
        </Panel>

        <Panel className="training-card">
          <SectionHeader eyebrow="MICROLEARNING" title="Skills in the flow of work" />
          <div className="training-feature">
            <span><BrainCircuit size={22} /></span>
            <div><small>RECOMMENDED • 8 MIN</small><h3>Recognizing heat illness</h3><p>Generated from today's live risk profile.</p></div>
          </div>
          <div className="training-meta">
            <span><Users size={14} /> 6 assigned</span>
            <span><CalendarClock size={14} /> Before 11:30</span>
          </div>
          <button type="button" className="primary-button full-button">Assign lesson <ChevronRight size={15} /></button>
        </Panel>
      </div>

      {shiftOptimized && (
        <div className="modal-layer" role="dialog" aria-modal="true">
          <button className="modal-scrim" onClick={() => setShiftOptimized(false)} aria-label="Close" />
          <div className="optimization-modal">
            <span className="optimization-modal__icon"><Sparkles size={26} /></span>
            <p className="eyebrow">SHIFT OPTIMIZER</p>
            <h2>Safer plan, same output.</h2>
            <p>Civora found four crew moves that reduce fatigue exposure by 31% without changing planned production.</p>
            <div>
              <span><Check size={15} /> Move 6 MEP workers to early rotation</span>
              <span><Check size={15} /> Swap two certified hot-work operators</span>
              <span><Check size={15} /> Add 15-minute recovery block at 12:00</span>
            </div>
            <button type="button" className="primary-button" onClick={() => setShiftOptimized(false)}>Apply optimized shift</button>
          </div>
        </div>
      )}
    </div>
  );
}
