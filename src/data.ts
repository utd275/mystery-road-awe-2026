import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.js";

import {
  currentPage,
  loadingStepsRemaining,
  setAllEvidence,
  setFilteredEvidence,
  setAllPeople,
  setAllLocations,
  setAllTimeline,
  setCaseData,
  setLoadingStepsRemaining,
  setEvidenceViewLoading,
} from "./state.js";

import { renderDashboard } from "./views/dashboard.js";

import {
  applyStoredBookmarkFlags,
  populateEvidenceDropdowns,
  renderEvidenceList,
} from "./views/evidence.js";

import { populateTimelineDropdowns, renderTimeline } from "./views/timeline.js";

import { populateHypothesisDropdowns } from "./views/workspace.js";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Failed to load " + url + ": " + response.status);
  }

  const data: unknown = await response.json();

  return data as T;
}


// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

function showLoadingOverlay(msg: string) {
  var overlay = document.getElementById("loadingOverlay");
  var text = document.getElementById("loadingText");

  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep() {
  var remaining = loadingStepsRemaining - 1;

  setLoadingStepsRemaining(remaining);

  if (remaining <= 0) {
    var overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

function loadCorePeopleAndLocations() {
  return fetchJson<CaseData>("data/case.json").then(function (caseJson) {
    setCaseData(caseJson);

    return fetchJson<Person[]>("data/people.json").then(function (peopleJson) {
      setAllPeople(peopleJson);

      return fetchJson<Location[]>("data/locations.json").then(function (
        locationsJson,
      ) {
        setAllLocations(locationsJson);

        hideLoadingStep();
        renderDashboard();
        populateAllDropdowns();
      });
    });
  });
}


function loadEvidenceData() {
  fetchJson<Evidence[]>("data/evidence.json")
    .then(function (data) {
      setAllEvidence(data);
      setEvidenceViewLoading(false);

      applyStoredBookmarkFlags();

      setFilteredEvidence(data);

      renderDashboard();
      populateAllDropdowns();

      if (currentPage === "evidence") {
        renderEvidenceList();
      }
    })
    .catch(function (err) {
      console.error("Failed to load evidence.json", err);
      alert("Evidence could not be loaded. Some views may be incomplete.");
    });
}

function loadTimelineData() {
  return fetchJson<TimelineEvent[]>("data/timeline.json")
    .then(function (data) {
      setAllTimeline(data);

      renderDashboard();

      if (currentPage === "timeline") {
        renderTimeline();
      }

      populateAllDropdowns();
    })
    .catch(function (err) {
      console.log("timeline load error", err);
    })
    .finally(function () {
      hideLoadingStep();
    });
}

export function loadAllData() {
  showLoadingOverlay("Loading case file…");

  setLoadingStepsRemaining(2);

  return loadCorePeopleAndLocations().then(function () {
    loadEvidenceData();
    loadTimelineData();
  });
}
