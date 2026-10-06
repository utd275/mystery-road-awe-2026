import { allEvidence, allPeople, notesStore } from "../state.js";

import { STORAGE_KEY_HYPOTHESIS } from "../storage.js";

import { openEvidenceDetail } from "./evidence.js";

// ---------------------------------------------------------------------
// WORKSPACE
// ---------------------------------------------------------------------

export function renderWorkspace() {
  renderBookmarksList();
  renderNotesList();
  populateHypothesisDropdowns();
  loadHypothesisFromStorage();
}

function renderBookmarksList() {
  var container = document.getElementById("bookmarksList");

  if (!container) return;

  var bookmarkedItems = allEvidence.filter(function (ev) {
    return ev.bookmarked;
  });

  if (bookmarkedItems.length === 0) {
    container.innerHTML =
      "<p>No bookmarked evidence yet. Bookmark items from the Evidence view.</p>";
    return;
  }

  var html = "";

  for (const ev of bookmarkedItems) {
    html +=
      '<div class="mini-list-item"><strong>' +
      ev.id +
      "</strong> &mdash; " +
      ev.title +
      ' <button type="button" class="btn btn-small btn-secondary" data-open-evidence="' +
      ev.id +
      '">Open</button></div>';
  }

  container.innerHTML = html;

  var openButtons = container.querySelectorAll("[data-open-evidence]");

  for (const button of openButtons) {
    button.addEventListener("click", function () {
      const id = button.getAttribute("data-open-evidence");

      if (!id) {
        return;
      }

      // Same effect as old navigateTo("evidence"),
      // but avoids importing navigation.js here.
      window.location.hash = "evidence";

      setTimeout(function () {
        openEvidenceDetail(id);
      }, 0);
    });
  }
}

function renderNotesList() {
  var container = document.getElementById("notesList");

  if (!container) return;

  type NoteEntry = {
    index: number;
    evidenceId: string;
    title: string;
    text: string;
  };

  const noteEntries: NoteEntry[] = [];

  for (const [index, evidence] of allEvidence.entries()) {
    var note = notesStore[evidence.id];

    if (note) {
      noteEntries.push({
        index: index,
        evidenceId: evidence.id,
        title: evidence.title,
        text: note,
      });
    }
  }

  if (noteEntries.length === 0) {
    container.innerHTML =
      "<p>No notes yet. Add one from an evidence item's detail view.</p>";
    return;
  }

  var html = "";

  for (const entry of noteEntries) {
    html +=
      '<div class="mini-list-item"><strong>' +
      entry.evidenceId +
      "</strong> &mdash; " +
      entry.title;

    html +=
      '<div id="noteText-' + entry.index + '">' + entry.text + "</div></div>";
  }

  container.innerHTML = html;
}

export function populateHypothesisDropdowns() {
  var suspectSelect = document.getElementById("hypSuspect");
  var evidenceSelect = document.getElementById("hypEvidence");

  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(evidenceSelect instanceof HTMLSelectElement)
  ) {
    return;
  }

  var currentSuspect = suspectSelect.value;

  suspectSelect.innerHTML = '<option value="">Select a person…</option>';

  for (const person of allPeople) {
    suspectSelect.innerHTML +=
      '<option value="' +
      person.id +
      '">' +
      person.name +
      "</option>";
  }

  suspectSelect.value = currentSuspect;

  evidenceSelect.innerHTML = "";

  for (const evidence of allEvidence) {
    evidenceSelect.innerHTML +=
      '<option value="' +
      evidence.id +
      '">' +
      evidence.id +
      " - " +
      evidence.title +
      "</option>";
  }
}

export function saveHypothesis() {
  const suspectSelect = document.getElementById("hypSuspect");
  const natureSelect = document.getElementById("hypNature");
  const evidenceSelect = document.getElementById("hypEvidence");
  const confidenceInput = document.getElementById("hypConfidence");
  const explanationInput = document.getElementById("hypExplanation");
  const alternativeInput = document.getElementById("hypAlternative");

  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(natureSelect instanceof HTMLSelectElement) ||
    !(evidenceSelect instanceof HTMLSelectElement) ||
    !(confidenceInput instanceof HTMLInputElement) ||
    !(explanationInput instanceof HTMLTextAreaElement) ||
    !(alternativeInput instanceof HTMLTextAreaElement)
  ) {
    throw new Error("Could not find hypothesis form elements.");
  }

  var draft = {
    suspectId: suspectSelect.value,
    nature: natureSelect.value,
    evidenceIds: getSelectedOptions(evidenceSelect),
    confidence: confidenceInput.value,
    explanation: explanationInput.value,
    alternative: alternativeInput.value,
    savedAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem(STORAGE_KEY_HYPOTHESIS, JSON.stringify(draft));
  } catch (err) {
    console.error("Could not save hypothesis draft", err);

    alert("Your hypothesis could not be saved to local storage.");

    return;
  }

  const msg = document.getElementById("hypothesisSavedMsg");

  if (!msg) {
    throw new Error("Could not find hypothesisSavedMsg.");
  }

  msg.classList.remove("hidden");

  setTimeout(function () {
    msg.classList.add("hidden");
  }, 2000);

}

function getSelectedOptions(selectEl: HTMLSelectElement): string[] {
  const result: string[] = [];

  for (const option of selectEl.options) {
    if (option.selected) {
      result.push(option.value);
    }
  }

  return result;
}

type HypothesisDraft = {
  suspectId?: string;
  nature?: string;
  evidenceIds?: string[];
  confidence?: string;
  explanation?: string;
  alternative?: string;
  savedAt?: string;
};


function loadHypothesisFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY_HYPOTHESIS);

  if (!raw) return;

  const draft = JSON.parse(raw) as HypothesisDraft;

  const suspectSelect = document.getElementById("hypSuspect");
  const natureSelect = document.getElementById("hypNature");
  const confidenceInput = document.getElementById("hypConfidence");
  const confidenceValue = document.getElementById("hypConfidenceValue");
  const explanationInput = document.getElementById("hypExplanation");
  const alternativeInput = document.getElementById("hypAlternative");
  const evidenceSelect = document.getElementById("hypEvidence");

  if (
    !(suspectSelect instanceof HTMLSelectElement) ||
    !(natureSelect instanceof HTMLSelectElement) ||
    !(confidenceInput instanceof HTMLInputElement) ||
    !confidenceValue ||
    !(explanationInput instanceof HTMLTextAreaElement) ||
    !(alternativeInput instanceof HTMLTextAreaElement) ||
    !(evidenceSelect instanceof HTMLSelectElement)
  ) {
    throw new Error("Could not find hypothesis form elements.");
  }

  suspectSelect.value = draft.suspectId || "";
  natureSelect.value = draft.nature || "";

  const confidence = draft.confidence || "50";

  confidenceInput.value = confidence;
  confidenceValue.textContent = confidence;

  explanationInput.value = draft.explanation || "";
  alternativeInput.value = draft.alternative || "";

  const savedIds = draft.evidenceIds || [];

  for (const option of evidenceSelect.options) {
    option.selected = savedIds.indexOf(option.value) !== -1;
  }
}
