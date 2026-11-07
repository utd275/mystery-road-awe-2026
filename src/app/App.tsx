import { useEffect, useState } from "react";

import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
} from "react-router";

import DashboardPage from "../dashboard/DashboardPage";
import PeopleLocationsPage from "../people-locations/PeopleLocationsPage";
import TimelinePage from "../timeline/TimelinePage";
import PersonDetailPage from "../people-locations/PersonDetailPage";
import EvidencePage from "../evidence/EvidencePage";
import WorkspacePage from "../workspace/WorkspacePage";

import {
  loadAppData,
  type AppData,
} from "../react-data";

import {
  BookmarkContext,
} from "../bookmarks/BookmarkContext";



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
  const { pathname } = useLocation();

  const [appData, setAppData] =
    useState<AppData | null>(null);

  const [loadError, setLoadError] =
    useState<string | null>(null);

  const [
    bookmarks,
    setBookmarks,
  ] = useState<string[]>(
    loadStoredBookmarks
  );

  // TEMPORARY Exercise 6 DEMO 2 EFFECTS
  /*
  useEffect(() => {
    console.log("[Demo 2] no dependency array");
  });

  useEffect(() => {
    console.log("[Demo 2] empty dependency array");
  }, []);

  useEffect(() => {
    console.log(
      "[Demo 2] pathname changed:",
      pathname
    );
  }, [pathname]);
  */

  useEffect(() => {
    const titles: Record<string, string> = {
      "/dashboard": "Dashboard",
      "/evidence": "Evidence",
      "/team/people": "People",
      "/team/locations": "Locations",
      "/timeline": "Timeline",
      "/workspace": "Workspace",
    };

    const viewTitle =
      titles[pathname] ?? "Case";

    document.title =
      `${viewTitle} | Project ReMotion`;
  }, [pathname]);


  useEffect(() => {
    function handleResize() {
      console.log(
        "[Demo 3] resize:",
        pathname,
        window.innerWidth
      );
    }

    console.log(
      "[Demo 3] setup:",
      pathname
    );

    window.addEventListener(
      "resize",
      handleResize
    );

    // Cleanup function für Exercise 6 Demo 3 entfernen
    
    return () => {
      console.log(
        "[Demo 3] cleanup:",
        pathname
      );

      window.removeEventListener(
        "resize",
        handleResize
      );
    };
    

  }, [pathname]);


  // Existing data-loading effect
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

  function handleToggleBookmark(
    evidenceId: string
  ) {
    const nextBookmarks =
      bookmarks.includes(evidenceId)
        ? bookmarks.filter(
            (id) => id !== evidenceId
          )
        : [...bookmarks, evidenceId];

    setBookmarks(nextBookmarks);

    localStorage.setItem(
      "remotion_bookmarks",
      JSON.stringify(nextBookmarks)
    );
  }

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

  function renderWorkspace() {
    if (loadError) {
      return (
        <section className="view active">
          <h2>Investigator Workspace</h2>
          <p>{loadError}</p>
        </section>
      );
    }

    if (!appData) {
      return (
        <section className="view active">
          <h2>Investigator Workspace</h2>
          <p>Loading workspace...</p>
        </section>
      );
    }

    return (
      <WorkspacePage
        evidence={appData.evidence}
        people={appData.people}
      />
    );
  }

  function renderEvidence() {
    if (loadError) {
      return (
        <section className="view active">
          <h2>Evidence Catalogue</h2>

          <div role="alert">
            <h3>Evidence could not be loaded</h3>

            <p>{loadError}</p>
          </div>
        </section>
      );
    }

    if (!appData) {
      return (
        <section className="view active">
          <h2>Evidence Catalogue</h2>

          <div className="evidence-loading">
            <div className="spinner" />

            <h3>Loading evidence...</h3>

            <p>
              Waiting for the backend
              response.
            </p>
          </div>
        </section>
      );
    }

    return (
      <EvidencePage
        evidence={appData.evidence}
        people={appData.people}
        locations={appData.locations}
      />
    );
  }

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        onToggleBookmark:
          handleToggleBookmark,
      }}
    >
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
            element={renderEvidence()}
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
            element={renderWorkspace()}
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
    </BookmarkContext.Provider>
  );
}

export default App;