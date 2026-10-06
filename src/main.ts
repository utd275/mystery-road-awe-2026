import { navigateTo, handleHashChange } from "./navigation.js";

import { loadAllData } from "./data.js";

import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
  loadNoteAsync,
} from "./storage.js";

import {
  renderEvidenceList,
  handleSearchInput,
  clearFilters,
  handleSortChange,
  closeEvidenceDetail,
  saveCurrentNote,
} from "./views/evidence.js";

import { renderTimeline } from "./views/timeline.js";

import { switchPeopleTab } from "./views/people.js";

import { saveHypothesis } from "./views/workspace.js";

declare global {
  interface Window {
    navigateTo: typeof navigateTo;
    handleSortChange: typeof handleSortChange;
    switchPeopleTab: typeof switchPeopleTab;
    saveHypothesis: typeof saveHypothesis;
    closeEvidenceDetail: typeof closeEvidenceDetail;
    saveCurrentNote: typeof saveCurrentNote;
    renderEvidenceList: typeof renderEvidenceList;
  }
}

// ---------------------------------------------------------------------
// LEGACY INLINE HTML HANDLERS
// ---------------------------------------------------------------------

// Module functions are not automatically added to window.
// The existing HTML still uses inline onclick/onchange handlers,
// so these specific functions must remain globally reachable.

window.navigateTo = navigateTo;
window.handleSortChange = handleSortChange;
window.switchPeopleTab = switchPeopleTab;
window.saveHypothesis = saveHypothesis;
window.closeEvidenceDetail = closeEvidenceDetail;
window.saveCurrentNote = saveCurrentNote;
window.renderEvidenceList = renderEvidenceList;

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

  const navButtons = document.querySelectorAll(".nav-btn");

  for (const button of navButtons) {
    button.addEventListener("click", function () {
      const targetView = button.getAttribute("data-view");

      console.log("nav clicked:", targetView);
    });
  }

  const evidenceSearch = document.getElementById("evidenceSearch");
  const filterType = document.getElementById("filterType");
  const filterPerson = document.getElementById("filterPerson");
  const filterLocation = document.getElementById("filterLocation");
  const filterStatus = document.getElementById("filterStatus");
  const filterRelevance = document.getElementById("filterRelevance");
  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

  const timelineOrder = document.getElementById("timelineOrder");
  const timelinePersonFilter = document.getElementById(
    "timelinePersonFilter",
  );

  const timelineLocationFilter = document.getElementById(
    "timelineLocationFilter",
  );

  const timelineTypeFilter = document.getElementById("timelineTypeFilter");

  const hypConfidence = document.getElementById("hypConfidence");
  const hypConfidenceValue = document.getElementById(
    "hypConfidenceValue",
  );

  if (
    !(evidenceSearch instanceof HTMLInputElement) ||
    !(filterType instanceof HTMLSelectElement) ||
    !(filterPerson instanceof HTMLSelectElement) ||
    !(filterLocation instanceof HTMLSelectElement) ||
    !(filterStatus instanceof HTMLSelectElement) ||
    !(filterRelevance instanceof HTMLSelectElement) ||
    !(clearFiltersBtn instanceof HTMLButtonElement) ||
    !(timelineOrder instanceof HTMLSelectElement) ||
    !(timelinePersonFilter instanceof HTMLSelectElement) ||
    !(timelineLocationFilter instanceof HTMLSelectElement) ||
    !(timelineTypeFilter instanceof HTMLSelectElement) ||
    !(hypConfidence instanceof HTMLInputElement) ||
    !hypConfidenceValue
  ) {
    throw new Error("Could not find required application controls.");
  }

  evidenceSearch.addEventListener("input", handleSearchInput);

  filterType.addEventListener("change", renderEvidenceList);
  filterPerson.addEventListener("change", renderEvidenceList);
  filterLocation.addEventListener("change", renderEvidenceList);
  filterStatus.addEventListener("change", renderEvidenceList);

  filterStatus.setAttribute("onchange", "renderEvidenceList()");

  filterRelevance.addEventListener("change", renderEvidenceList);

  clearFiltersBtn.addEventListener("click", clearFilters);

  timelineOrder.addEventListener("change", renderTimeline);
  timelinePersonFilter.addEventListener("change", renderTimeline);
  timelineLocationFilter.addEventListener("change", renderTimeline);
  timelineTypeFilter.addEventListener("change", renderTimeline);

  // Kept as arrow callback from Exercise 1 Demo 10
  hypConfidence.addEventListener("input", () => {
    hypConfidenceValue.textContent = hypConfidence.value;
  });

}

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------

function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();

  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();

    var firstNote = loadNoteAsync("E01");

    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);

window.addEventListener("hashchange", handleHashChange);
