import { useEffect, useState } from "react";

import DashboardPage from "./dashboard/DashboardPage";
import {
  loadAppData,
  type AppData,
} from "./react-data";

type AppView =
  | "dashboard"
  | "evidence"
  | "people"
  | "timeline"
  | "workspace";

const validViews: AppView[] = [
  "dashboard",
  "evidence",
  "people",
  "timeline",
  "workspace",
];

function isAppView(value: string): value is AppView {
  return validViews.some((view) => view === value);
}

function getViewFromHash(): AppView {
  const hash = window.location.hash.replace("#", "");

  if (isAppView(hash)) {
    return hash;
  }

  return "dashboard";
}

function navigateTo(view: AppView) {
  window.location.hash = view;
}



function EvidencePage() {
  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>
      <p>This view will be migrated later.</p>
    </section>
  );
}

function PeoplePage() {
  return (
    <section className="view active">
      <h2>People &amp; Locations</h2>
      <p>This view will be migrated in Exercise 4.</p>
    </section>
  );
}

function TimelinePage() {
  return (
    <section className="view active">
      <h2>Investigation Timeline</h2>
      <p>This view will be migrated in Exercise 4.</p>
    </section>
  );
}

function WorkspacePage() {
  return (
    <section className="view active">
      <h2>Investigator Workspace</h2>
      <p>This view will be migrated later.</p>
    </section>
  );
}

function loadStoredBookmarks(): string[] {
  try {
    const raw = localStorage.getItem("remotion_bookmarks");

    if (!raw) {
      return [];
    }

    const parsed: unknown = JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string =>
            typeof item === "string"
        )
      : [];
  } catch {
    return [];
  }
}

function App() {
  const [currentView, setCurrentView] = useState<AppView>(
    getViewFromHash()
  );

  const [appData, setAppData] =
    useState<AppData | null>(null);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [bookmarks] = useState<string[]>(
    loadStoredBookmarks
  );

  useEffect(() => {
    function handleHashChange() {
      setCurrentView(getViewFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    loadAppData()
      .then((data) => {
        setAppData(data);
      })
      .catch((error: unknown) => {
        console.error(error);

        setLoadError(
          "The case data could not be loaded."
        );
      });
  }, []);

  function renderCurrentView() {
    if (currentView === "evidence") {
      return <EvidencePage />;
    }

    if (currentView === "people") {
      return <PeoplePage />;
    }

    if (currentView === "timeline") {
      return <TimelinePage />;
    }

    if (currentView === "workspace") {
      return <WorkspacePage />;
    }

    if (loadError) {
      return (
        <section className="view active">
          <h2>Case Dashboard</h2>
          <p>{loadError}</p>
        </section>
      );
    }

    if (!appData) {
      return (
        <section className="view active">
          <h2>Case Dashboard</h2>
          <p>Loading case data...</p>
        </section>
      );
    }

    return (
      <DashboardPage
        caseData={appData.caseData}
        evidence={appData.evidence}
        people={appData.people}
        locations={appData.locations}
        timeline={appData.timeline}
        bookmarks={bookmarks}
      />
    );
  }

  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img
              src="assets/logo/logo.svg"
              alt="Project ReMotion logo"
              className="brand-logo"
            />

            <div>
              <h1>Project ReMotion</h1>
              <p className="subtitle">
                Investigate the failure of an AI-assisted rehabilitation robot.
              </p>
            </div>
          </div>

          <nav className="main-nav" aria-label="Main navigation">
            <button
              type="button"
              className={
                currentView === "dashboard"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => navigateTo("dashboard")}
            >
              Dashboard
            </button>

            <button
              type="button"
              className={
                currentView === "evidence"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => navigateTo("evidence")}
            >
              Evidence
            </button>

            <button
              type="button"
              className={
                currentView === "people"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => navigateTo("people")}
            >
              People &amp; Locations
            </button>

            <button
              type="button"
              className={
                currentView === "timeline"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => navigateTo("timeline")}
            >
              Timeline
            </button>

            <button
              type="button"
              className={
                currentView === "workspace"
                  ? "nav-btn active"
                  : "nav-btn"
              }
              onClick={() => navigateTo("workspace")}
            >
              Workspace
            </button>
          </nav>
        </div>
      </header>

      <main className="app-main">
        {renderCurrentView()}
      </main>

      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal &mdash; Research Center AI,
          Software and IT-Security of HCW (fictional case study)
        </p>
      </footer>
    </>
  );
}

export default App;