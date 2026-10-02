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

  var navButtons = document.querySelectorAll(".nav-btn");

  for (var i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function (e) {
      var targetView = e.currentTarget.getAttribute("data-view");

      console.log("nav clicked:", targetView);
    });
  }

  document
    .getElementById("evidenceSearch")
    .addEventListener("input", handleSearchInput);

  document
    .getElementById("filterType")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("filterPerson")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("filterLocation")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("filterStatus")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("filterStatus")
    .setAttribute("onchange", "renderEvidenceList()");

  document
    .getElementById("filterRelevance")
    .addEventListener("change", renderEvidenceList);

  document
    .getElementById("clearFiltersBtn")
    .addEventListener("click", clearFilters);

  document
    .getElementById("timelineOrder")
    .addEventListener("change", renderTimeline);

  document
    .getElementById("timelinePersonFilter")
    .addEventListener("change", renderTimeline);

  document
    .getElementById("timelineLocationFilter")
    .addEventListener("change", renderTimeline);

  document
    .getElementById("timelineTypeFilter")
    .addEventListener("change", renderTimeline);

  // Kept as arrow callback from Exercise 1 Demo 10
  document.getElementById("hypConfidence").addEventListener("input", (e) => {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
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
