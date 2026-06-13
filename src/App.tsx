import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { Shell } from "./components/Shell";
import { Skeleton } from "./components/Primitives";
import { initialAlerts, initialTasks, sites } from "./data/demo";
import { useLiveTelemetry } from "./hooks/useLiveTelemetry";
import { usePersistentState } from "./hooks/usePersistentState";
import type { Alert, AppState, Task, ViewId } from "./types";
const Overview = lazy(() => import("./views/Overview").then((module) => ({ default: module.Overview })));
const DigitalTwin = lazy(() => import("./views/DigitalTwin").then((module) => ({ default: module.DigitalTwin })));
const Safety = lazy(() => import("./views/Safety").then((module) => ({ default: module.Safety })));
const Sustainability = lazy(() => import("./views/Sustainability").then((module) => ({ default: module.Sustainability })));
const Workforce = lazy(() => import("./views/Workforce").then((module) => ({ default: module.Workforce })));
const Assets = lazy(() => import("./views/Assets").then((module) => ({ default: module.Assets })));
const Reports = lazy(() => import("./views/Reports").then((module) => ({ default: module.Reports })));

const initialState: AppState = {
  selectedSite: sites[0].id,
  alerts: initialAlerts,
  tasks: initialTasks,
  theme: "dark",
  acknowledgedTour: false
};

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [state, setState] = usePersistentState<AppState>("civora-app-state-v1", initialState);
  const { zones, lastUpdated, online } = useLiveTelemetry();

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme;
  }, [state.theme]);

  const selectedSite = useMemo(
    () => sites.find((site) => site.id === state.selectedSite) ?? sites[0],
    [state.selectedSite]
  );

  const acknowledgeAlert = (id: string) => {
    setState((current) => ({
      ...current,
      alerts: current.alerts.map((alert) =>
        alert.id === id ? { ...alert, status: "acknowledged" } : alert
      )
    }));
  };

  const addIncident = (alert: Alert) => {
    setState((current) => ({ ...current, alerts: [alert, ...current.alerts] }));
  };

  const toggleTask = (id: string) => {
    setState((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
  };

  const createTask = (task: Omit<Task, "id" | "completed">) => {
    setState((current) => ({
      ...current,
      tasks: [{ ...task, id: crypto.randomUUID(), completed: false }, ...current.tasks]
    }));
  };

  return (
    <Shell
      view={view}
      setView={setView}
      selectedSite={selectedSite}
      setSelectedSiteId={(id) => setState((current) => ({ ...current, selectedSite: id }))}
      alerts={state.alerts}
      acknowledgeAlert={acknowledgeAlert}
      tasks={state.tasks}
      theme={state.theme}
      setTheme={(theme) => setState((current) => ({ ...current, theme }))}
      lastUpdated={lastUpdated}
      online={online}
      onCreateTask={createTask}
    >
      <Suspense fallback={<WorkspaceLoading />}>
        {view === "overview" && (
          <Overview
            site={selectedSite}
            zones={zones}
            alerts={state.alerts}
            tasks={state.tasks}
            setView={setView}
            acknowledgeAlert={acknowledgeAlert}
            toggleTask={toggleTask}
          />
        )}
        {view === "twin" && <DigitalTwin zones={zones} />}
        {view === "safety" && (
          <Safety
            alerts={state.alerts}
            zones={zones}
            acknowledgeAlert={acknowledgeAlert}
            addIncident={addIncident}
          />
        )}
        {view === "sustainability" && <Sustainability />}
        {view === "workforce" && <Workforce />}
        {view === "assets" && <Assets />}
        {view === "reports" && (
          <Reports site={selectedSite} alerts={state.alerts} tasks={state.tasks} />
        )}
      </Suspense>
    </Shell>
  );
}

function WorkspaceLoading() {
  return (
    <div className="workspace workspace-loading" aria-label="Loading workspace">
      <Skeleton className="workspace-loading__title" />
      <div className="workspace-loading__grid">
        <Skeleton /><Skeleton /><Skeleton /><Skeleton />
      </div>
      <Skeleton className="workspace-loading__main" />
    </div>
  );
}
