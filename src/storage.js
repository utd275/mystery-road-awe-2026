import { bookmarks, notesStore, setBookmarks, setNotesStore } from "./state.js";

// ---------------------------------------------------------------------
// LOCAL STORAGE KEYS
// ---------------------------------------------------------------------

export var STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
export var STORAGE_KEY_NOTES = "remotion_notes";
export var STORAGE_KEY_HYPOTHESIS = "remotion_hypothesis";

// ---------------------------------------------------------------------
// LOCAL STORAGE HELPERS
// ---------------------------------------------------------------------

export function saveBookmarksToStorage() {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage() {
  try {
    var raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    var parsed = raw ? JSON.parse(raw) : [];

    setBookmarks(Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    setBookmarks([]);
  }
}

export function saveNoteForEvidence(evidenceId, text) {
  notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

export function loadNoteForEvidence(evidenceId) {
  return notesStore[evidenceId] || "";
}

export function loadNotesFromStorage() {
  var raw = localStorage.getItem(STORAGE_KEY_NOTES);

  if (!raw) {
    setNotesStore({});
    return;
  }

  setNotesStore(JSON.parse(raw));
}

export function loadNoteAsync(evidenceId) {
  return new Promise(function (resolve) {
    resolve(notesStore[evidenceId] || "");
  });
}
