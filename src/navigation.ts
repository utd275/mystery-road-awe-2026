import { viewRendered, setCurrentPage } from "./state.js";

import { renderDashboard } from "./views/dashboard.js";

import { renderEvidenceList } from "./views/evidence.js";

import { renderPeople, renderLocations } from "./views/people.js";

import { renderTimeline } from "./views/timeline.js";

import { renderWorkspace } from "./views/workspace.js";

// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------

export function navigateTo(viewName: string) {
  window.location.hash = viewName;
  // handleHashChange() will pick this up via the hashchange listener
}

export function handleHashChange() {
  let hash = window.location.hash.replace("#", "");

  var validViews = ["dashboard", "evidence", "people", "timeline", "workspace"];

  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }

  setCurrentPage(hash);

  var sections = document.querySelectorAll(".view");

  for (const section of sections) {
    section.classList.remove("active");
  }

  const activeSection = document.getElementById("view-" + hash);

  if (!activeSection) {
    throw new Error("Could not find view: " + hash);
  }

  activeSection.classList.add("active");

  var navButtons = document.querySelectorAll(".nav-btn");

  for (const navButton of navButtons) {
    navButton.classList.remove("active");

    if (navButton.getAttribute("data-view") === hash) {
      navButton.classList.add("active");
    }
  }

  if (hash === "dashboard" && !viewRendered.dashboard) {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === "evidence" && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === "people" && !viewRendered.people) {
    renderPeople();
    renderLocations();
    viewRendered.people = true;
  } else if (hash === "timeline" && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === "workspace") {
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}
