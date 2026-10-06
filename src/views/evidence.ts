import {
  allEvidence,
  allPeople,
  allLocations,
  filteredEvidence,
  bookmarks,
  currentPage,
  evidenceViewLoading,
  viewRendered,
  setFilteredEvidence,
  setBookmarks,
  setSelectedEvidence,
} from "../state.js";

import {
  findEvidenceById,
  findPersonById,
  findLocationById,
  evidenceMentionsPerson,
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
} from "../utils.js";

import {
  saveBookmarksToStorage,
  loadNoteForEvidence,
  saveNoteForEvidence,
} from "../storage.js";

import type { Evidence } from "../types.js";

// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------

export function populateEvidenceDropdowns() {
  var typeSelect = document.getElementById("filterType");
  var personSelect = document.getElementById("filterPerson");
  var locationSelect = document.getElementById("filterLocation");

  if (!typeSelect || !personSelect || !locationSelect) return;

  const types: string[] = [];

  for (const evidence of allEvidence) {
    const t = evidence.type.toLowerCase();

    if (types.indexOf(t) === -1) {
      types.push(t);
    }
  }

  typeSelect.innerHTML = '<option value="">All types</option>';

  for (const type of types) {
    typeSelect.innerHTML +=
      '<option value="' + type + '">' + type + "</option>";
  }

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
      " - " +
      location.name +
      "</option>";
  }
}

function getFilteredEvidence() {
  const searchBox = document.getElementById("evidenceSearch");
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  const statusSelect = document.getElementById("filterStatus");
  const relevanceSelect = document.getElementById("filterRelevance");

  const searchTerm =
    searchBox instanceof HTMLInputElement
      ? searchBox.value.toLowerCase().trim()
      : "";

  if (
    !(typeSelect instanceof HTMLSelectElement) ||
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement) ||
    !(statusSelect instanceof HTMLSelectElement) ||
    !(relevanceSelect instanceof HTMLSelectElement)
  ) {
    throw new Error("Could not find evidence filter elements.");
  }

  const typeVal = typeSelect.value;
  const personVal = personSelect.value;
  const locationVal = locationSelect.value;
  const statusVal = statusSelect.value;
  const relevanceVal = relevanceSelect.value;

  const results = [];

  for (const item of allEvidence) {
    let matches = true;

    if (searchTerm) {
      const haystack = (
        item.title +
        " " +
        item.summary +
        " " +
        item.tags.join(" ")
      ).toLowerCase();

      if (haystack.indexOf(searchTerm) === -1) {
        matches = false;
      }
    }

    if (matches && typeVal && item.type.toLowerCase() !== typeVal) {
      matches = false;
    }

    if (matches && personVal) {
      const person = findPersonById(personVal);

      if (!person || !evidenceMentionsPerson(item, person)) {
        matches = false;
      }
    }

    if (
      matches &&
      locationVal &&
      !item.locationIds.some((locationId) => locationId === locationVal)
    ) {
      matches = false;
    }

    if (
      matches &&
      statusVal &&
      (item.status || "").toLowerCase() !== statusVal
    ) {
      matches = false;
    }

    if (
      matches &&
      relevanceVal &&
      (item.relevance || "").toLowerCase() !== relevanceVal
    ) {
      matches = false;
    }

    if (matches) {
      results.push(item);
    }
  }

  setFilteredEvidence(results);

  return results;
}

export function renderEvidenceList() {
  var container = document.getElementById("evidenceList");

  if (!container) return;

  var loadingIndicator = document.getElementById("evidenceLoadingIndicator");

  if (evidenceViewLoading) {
    if (loadingIndicator) {
      loadingIndicator.classList.remove("hidden");
    }

    container.innerHTML = "";
    return;
  }

  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }

  var results = getFilteredEvidence();

  var html = "";

  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }

  for (const evidence of results) {
    html += renderEvidenceCardHTML(evidence);
  }

  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: Evidence): string {
  var isBookmarked = bookmarks.indexOf(ev.id) !== -1;

  var html = '<div class="evidence-card" data-id="' + ev.id + '">';

  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";

  html += "<h3>" + ev.title + "</h3>";

  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";

  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }

  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    "</span>";

  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    "</span>";

  html += "<div>";

  for (const tag of ev.tags) {
    html += '<span class="tag-chip">' + tag + "</span>";
  }

  html += "</div>";
  html += "</div>";

  return html;
}

function handleEvidenceListClick(event: MouseEvent) {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset.action === "bookmark") {
    event.stopPropagation();

    const evidenceId = target.dataset.id;

    if (!evidenceId) {
      return;
    }

    handleBookmarkClick(evidenceId);
    return;
  }

  const card = target.closest(".evidence-card");

  if (card) {
    const evidenceId = card.getAttribute("data-id");

    if (evidenceId) {
      openEvidenceDetail(evidenceId);
    }
  }
}

function handleBookmarkClick(evidenceId: string) {
  var ev = findEvidenceById(evidenceId);

  if (!ev) return;

  if (bookmarks.indexOf(evidenceId) === -1) {
    bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    setBookmarks(
      bookmarks.filter(function (id) {
        return id !== evidenceId;
      }),
    );

    ev.bookmarked = false;
  }

  saveBookmarksToStorage();

  if (currentPage === "evidence") {
    renderEvidenceList();
  }
}

export function applyStoredBookmarkFlags() {
  for (const evidence of allEvidence) {
    evidence.bookmarked = bookmarks.indexOf(evidence.id) !== -1;
  }
}

export function handleSortChange() {
  const sortSelect = document.getElementById("sortEvidence");

  if (!(sortSelect instanceof HTMLSelectElement)) {
    throw new Error("Could not find sortEvidence select.");
  }

  const sortValue = sortSelect.value;

  if (sortValue === "title-asc") {
    filteredEvidence.sort(function (a, b) {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "title-desc") {
    filteredEvidence.sort(function (a, b) {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === "date-asc") {
    filteredEvidence.sort(function (a, b) {
      return (
        new Date(a.timestamp).getTime() -
        new Date(b.timestamp).getTime()
      );
    });
  } else {
    filteredEvidence.sort(function (a, b) {
      return (
        new Date(b.timestamp).getTime() -
        new Date(a.timestamp).getTime()
      );
    });
  }

  renderEvidenceList();
}

export function clearFilters() {
  const searchInput = document.getElementById("evidenceSearch");
  const typeSelect = document.getElementById("filterType");
  const personSelect = document.getElementById("filterPerson");
  const locationSelect = document.getElementById("filterLocation");
  const statusSelect = document.getElementById("filterStatus");
  const relevanceSelect = document.getElementById("filterRelevance");

  if (
    !(searchInput instanceof HTMLInputElement) ||
    !(typeSelect instanceof HTMLSelectElement) ||
    !(personSelect instanceof HTMLSelectElement) ||
    !(locationSelect instanceof HTMLSelectElement) ||
    !(statusSelect instanceof HTMLSelectElement) ||
    !(relevanceSelect instanceof HTMLSelectElement)
  ) {
    throw new Error("Could not find evidence filter elements.");
  }

  searchInput.value = "";
  typeSelect.value = "";
  personSelect.value = "";
  locationSelect.value = "";
  statusSelect.value = "";
  relevanceSelect.value = "";

  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(term);
    }, 300);
  });
}

var latestSearchRequestId = 0;

export function handleSearchInput(event: Event) {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const term = target.value;
  const requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(function () {
    // parameter resolvedTerm is not used, so I removed it for Ex2 Demo4
    // Only apply this response if nothing newer
    // has been typed meanwhile.
    if (requestId !== latestSearchRequestId) return;

    renderEvidenceList();
  });
}

// ---------------------------------------------------------------------
// EVIDENCE DETAIL
// ---------------------------------------------------------------------

export function openEvidenceDetail(evidenceId: string) {
  const ev = findEvidenceById(evidenceId);

  if (!ev) return;

  setSelectedEvidence(ev);

  const section = document.getElementById("evidenceDetailSection");

  if (!section) {
    throw new Error("Could not find evidenceDetailSection.");
  }

  section.classList.remove("hidden");

  renderEvidenceDetail(ev);

  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function closeEvidenceDetail() {
  const section = document.getElementById("evidenceDetailSection");

  if (!section) {
    throw new Error("Could not find evidenceDetailSection.");
  }

  section.classList.add("hidden");
  section.innerHTML = "";

  setSelectedEvidence(null);
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = document.getElementById("evidenceDetailSection");

  if (!section) {
    throw new Error("Could not find evidenceDetailSection.");
  }

  const personNames: string[] = [];

  for (const personId of ev.personIds) {
    const person = findPersonById(personId);

    personNames.push(person ? person.name : personId);
  }

  const locationNames: string[] = [];

  for (const locationId of ev.locationIds) {
    const loc = findLocationById(locationId);

    locationNames.push(loc ? loc.id + " - " + loc.name : locationId);
  }

  let tagsHtml = "";

  for (const tag of ev.tags) {
    tagsHtml += '<span class="tag-chip">' + tag + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";

  html += '<div class="evidence-detail-header">';

  html += "<div><h2>" + ev.title + "</h2>";

  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";

  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';

  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    ev.summary +
    "</div>";

  html += '<div class="evidence-detail-content">' + ev.content + "</div>";

  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(", ") +
    "</div>";

  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";

  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';

  html += '<select id="detailStatusSelect">';

  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");
  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");
  html += statusOptionHTML(ev.status, "flagged", "Flagged");

  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';

  html += '<select id="detailRelevanceSelect">';

  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");
  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");
  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");

  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';

  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";

  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';

  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";

  section.innerHTML = html;

  const statusSelect = document.getElementById("detailStatusSelect");
  const relevanceSelect = document.getElementById("detailRelevanceSelect");

  if (
    !(statusSelect instanceof HTMLSelectElement) ||
    !(relevanceSelect instanceof HTMLSelectElement)
  ) {
    throw new Error("Could not find evidence detail selects.");
  }

  statusSelect.addEventListener("change", function () {
    ev.status = statusSelect.value;

    renderEvidenceDetail(ev);

    if (viewRendered.evidence) {
      renderEvidenceList();
    }
  });

  relevanceSelect.addEventListener("change", function () {
    ev.relevance = relevanceSelect.value;

    renderEvidenceDetail(ev);

    if (viewRendered.evidence) {
      renderEvidenceList();
    }
  });
}

function statusOptionHTML(current: string, value: string, label: string): string {
  var currentLower = (current || "").toLowerCase();

  var selected = currentLower === value ? " selected" : "";

  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

export function saveCurrentNote() {
  const textarea = document.getElementById("evidenceNoteInput");

  if (!(textarea instanceof HTMLTextAreaElement)) {
    return;
  }

  const evidenceId = textarea.getAttribute("data-evidence-id");

  if (!evidenceId) {
    return;
  }

  const text = textarea.value;

  saveNoteForEvidence(evidenceId, text);

  const preview = document.getElementById("notePreview");

  if (preview) {
    preview.innerHTML = text;
  }
}
