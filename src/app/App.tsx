import { useEffect, useState } from "react";

import {
  Navigate,
  NavLink,
  Route,
  Routes,
} from "react-router";

import DashboardPage from "../dashboard/DashboardPage";
import PeopleLocationsPage from "../people-locations/PeopleLocationsPage";
import TimelinePage from "../timeline/TimelinePage";
import PersonDetailPage from "../people-locations/PersonDetailPage";

import {
  loadAppData,
  type AppData,
} from "../react-data";

function EvidencePage() {
  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>
      <p>This view will be migrated later.</p>
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
    const raw = localStorage.getItem(
      "remotion_bookmarks"
    );

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
  const [appData, setAppData] =
    useState<AppData | null>(null);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [bookmarks] = useState<string[]>(
    loadStoredBookmarks
  );

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

  function renderDashboard() {
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

  function renderTeam(
    view: "people" | "locations"
  ) {
    if (loadError) {
      return (
        <section className="view active">
          <h2>People &amp; Locations</h2>
          <p>{loadError}</p>
        </section>
      );
    }

    if (!appData) {
      return (
        <section className="view active">
          <h2>People &amp; Locations</h2>
          <p>Loading people and locations...</p>
        </section>
      );
    }

    return (
      <PeopleLocationsPage
        people={appData.people}
        locations={appData.locations}
        evidence={appData.evidence}
        view={view}
      />
    );
  }

  function renderTimeline() {
    if (loadError) {
      return (
        <section className="view active">
          <h2>Investigation Timeline</h2>
          <p>{loadError}</p>
        </section>
      );
    }

    if (!appData) {
      return (
        <section className="view active">
          <h2>Investigation Timeline</h2>
          <p>Loading timeline...</p>
        </section>
      );
    }

    return (
      <TimelinePage
        timeline={appData.timeline}
      />
    );
  }

  function renderPersonDetail() {
    if (loadError) {
      return (
        <section className="view active">
          <h2>Person Details</h2>
          <p>{loadError}</p>
        </section>
      );
    }

    if (!appData) {
      return (
        <section className="view active">
          <h2>Person Details</h2>
          <p>Loading person...</p>
        </section>
      );
    }

    return (
      <PersonDetailPage
        people={appData.people}
        evidence={appData.evidence}
      />
    );
  }



  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <img
              src="/assets/logo/logo.svg"
              alt="Project ReMotion logo"
              className="brand-logo"
            />

            <div>
              <h1>Project ReMotion</h1>

              <p className="subtitle">
                Investigate the failure of an
                AI-assisted rehabilitation robot.
              </p>
            </div>
          </div>

          <nav
            className="main-nav"
            aria-label="Main navigation"
          >
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                isActive
                  ? "nav-btn active"
                  : "nav-btn"
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/evidence"
              className={({ isActive }) =>
                isActive
                  ? "nav-btn active"
                  : "nav-btn"
              }
            >
              Evidence
            </NavLink>

            <NavLink
              to="/team"
              className={({ isActive }) =>
                isActive
                  ? "nav-btn active"
                  : "nav-btn"
              }
            >
              People &amp; Locations
            </NavLink>

            <NavLink
              to="/timeline"
              className={({ isActive }) =>
                isActive
                  ? "nav-btn active"
                  : "nav-btn"
              }
            >
              Timeline
            </NavLink>

            <NavLink
              to="/workspace"
              className={({ isActive }) =>
                isActive
                  ? "nav-btn active"
                  : "nav-btn"
              }
            >
              Workspace
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={renderDashboard()}
          />

          <Route
            path="/evidence"
            element={<EvidencePage />}
          />

          <Route
            path="/team"
            element={
              <Navigate
                to="/team/people"
                replace
              />
            }
          />

          <Route
            path="/team/people"
            element={renderTeam("people")}
          />

          <Route
            path="/team/people/:personId"
            element={renderPersonDetail()}
          />

          <Route
            path="/team/locations"
            element={renderTeam("locations")}
          />

          <Route
            path="/timeline"
            element={renderTimeline()}
          />

          <Route
            path="/workspace"
            element={<WorkspacePage />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>
          Project ReMotion Investigation Portal
          &mdash; Research Center AI, Software and
          IT-Security of HCW (fictional case study)
        </p>
      </footer>
    </>
  );
}

export default App;