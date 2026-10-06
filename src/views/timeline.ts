import {
  allPeople,
  allLocations,
  allTimeline,
  modalCloseListenerCount,
  incrementModalCloseListenerCount,
} from "../state.js";

import { findEvidenceById, findLocationById, formatDate } from "../utils.js";

import { openEvidenceDetail } from "./evidence.js";

import type {
  TimelineCertainty,
  TimelineEvent,
} from "../types.js";

// ---------------------------------------------------------------------
// TIMELINE
// ---------------------------------------------------------------------

export function populateTimelineDropdowns() {
  var personSelect = document.getElementById("timelinePersonFilter");
  var locationSelect = document.getElementById("timelineLocationFilter");
  var typeSelect = document.getElementById("timelineTypeFilter");

  if (!personSelect || !locationSelect || !typeSelect) return;

  personSelect.innerHTML = '<option value="">All people</option>';

  for (const person of allPeople) {
    personSelect.innerHTML +=
      '<option value="' +
      person.id +
      '">' +
      person.name +
      "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';

  for (const location of allLocations) {
  locationSelect.innerHTML +=
    '<option value="' +
    location.id +
    '">' +
    location.id +
    "</option>";
  }

  const types: string[] = [];

  for (const timelineEvent of allTimeline) {
    if (types.indexOf(timelineEvent.type) === -1) {
      types.push(timelineEvent.type);
    }
  }

  typeSelect.innerHTML = '<option value="">All event types</option>';

  for (const type of types) {
    typeSelect.innerHTML +=
      '<option value="' + type + '">' + type + "</option>";
  }
}

export function renderTimeline() {
  var container = document.getElementById("timelineContainer");

  if (!container) return;

  const orderSelect = document.getElementById("timelineOrder");
  const personSelect = document.getElementById("timelinePersonFilter");
  const locationSelect = document.getElementById("timelineLocationFilter");
  const typeSelect = document.getElementById("timelineTypeFilter");

  if (
    !(orderSelect instanceof HTMLSelectElement) ||
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement) ||
    !(typeSelect instanceof HTMLSelectElement)
  ) {
    throw new Error("Could not find timeline filter elements.");
  }

  const order = orderSelect.value;
  const personFilter = personSelect.value;
  const locationFilter = locationSelect.value;
  const typeFilter = typeSelect.value;

  let events: TimelineEvent[] = [];

  for (const evt of allTimeline) {
    if (
      personFilter &&
      !evt.personIds.some((personId) => personId === personFilter)
    ) {
      continue;
    }

    if (
      locationFilter &&
      !evt.locationIds.some((locationId) => locationId === locationFilter)
    ) {
      continue;
    }

    if (typeFilter && evt.type !== typeFilter) {
      continue;
    }

    events.push(evt);
  }

  events = events.slice().sort(function (a, b) {
    const diff =
      new Date(a.time).getTime() - new Date(b.time).getTime();

    return order === "desc" ? -diff : diff;
  });

  var html = "";

  for (const item of events) {

    html += '<div class="timeline-event certainty-' + item.certainty + '">';

    html +=
      '<div class="timeline-time">' +
      formatDate(item.time) +
      '&nbsp;&middot;&nbsp;<span class="badge badge-' +
      certaintyBadgeClass(item.certainty) +
      '">' +
      item.certainty +
      "</span></div>";

    html += "<h3>" + item.title + "</h3>";

    html += "<p>" + item.description + "</p>";

    var eventLocationNames = [];

    for (const locationId of item.locationIds) {
      var evtLoc = findLocationById(locationId);

      eventLocationNames.push(evtLoc || locationId);
    }

    if (eventLocationNames.length > 0) {
      html +=
        '<p class="evidence-meta">Location: ' +
        eventLocationNames.join(", ") +
        "</p>";
    }

    for (const evidenceId of item.evidenceIds) {
      html +=
        '<button type="button" class="evidence-link-btn" data-evidence-id="' +
        evidenceId +
        '">View ' +
        evidenceId +
        "</button>";
    }

    html += "</div>";
  }

  if (events.length === 0) {
    html = "<p>No timeline events match the current filters.</p>";
  }

  container.innerHTML = html;

  var linkButtons = container.querySelectorAll(".evidence-link-btn");

  for (const button of linkButtons) {
    button.addEventListener("click", function () {
      const evidenceId = button.getAttribute("data-evidence-id");

      if (!evidenceId) {
        return;
      }

      openEvidenceModal(evidenceId);
    });
  }
}

function certaintyBadgeClass(certainty: TimelineCertainty): string {
  if (certainty === "confirmed") return "reviewed";
  if (certainty === "contradictory") return "critical";
  if (certainty === "reported") return "flagged";

  return "unreviewed";
}

// ---------------------------------------------------------------------
// QUICK-VIEW MODAL
// ---------------------------------------------------------------------

function openEvidenceModal(evidenceId: string) {
  var ev = findEvidenceById(evidenceId);

  if (!ev) return;

  var modal = document.getElementById("quickViewModal");

  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quickViewModal";
    document.body.appendChild(modal);
  }

  modal.innerHTML =
    '<div class="modal-backdrop"><div class="modal-box">' +
    '<button type="button" class="modal-close-btn" aria-label="Close">&times;</button>' +
    "<h3>" +
    ev.title +
    "</h3>" +
    '<p class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</p>" +
    "<p>" +
    ev.summary +
    "</p>" +
    '<button type="button" class="btn btn-primary btn-small" data-open-full="' +
    ev.id +
    '">Open full evidence</button>' +
    "</div></div>";

  incrementModalCloseListenerCount();

  console.log("modal opened, active close listeners:", modalCloseListenerCount);

  const modalElement = modal;


  modalElement.addEventListener("click", function (e) {
    const target = e.target;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (
      target.classList.contains("modal-close-btn") ||
      target.classList.contains("modal-backdrop")
    ) {
      modalElement.innerHTML = "";
    }

    const evidenceId = target.getAttribute("data-open-full");

    if (evidenceId) {
      modalElement.innerHTML = "";

      // Same effect as the old navigateTo("evidence"),
      // without importing navigation.js and creating a cycle.
      window.location.hash = "evidence";

      setTimeout(function () {
        openEvidenceDetail(evidenceId);
      }, 0);
    }
  });
}
