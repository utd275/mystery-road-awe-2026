// ---------------------------------------------------------------------
// SHARED APPLICATION STATE
// ---------------------------------------------------------------------

export var allEvidence = [];
export var filteredEvidence = [];
export var selectedEvidence = null;
export var bookmarks = [];
export var currentPage = "dashboard";

export var allPeople = [];
export var allLocations = [];
export var allTimeline = [];
export var caseData = {};

export var currentPeopleTab = "people";
export var loadingStepsRemaining = 2;

export var evidenceViewLoading = true;

export var viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};

export var notesStore = {};
export var modalCloseListenerCount = 0;



// ---------------------------------------------------------------------
// STATE UPDATE FUNCTIONS
// ---------------------------------------------------------------------

export function setAllEvidence(value) {
  allEvidence = value;
}

export function setFilteredEvidence(value) {
  filteredEvidence = value;
}

export function setSelectedEvidence(value) {
  selectedEvidence = value;
}

export function setBookmarks(value) {
  bookmarks = value;
}

export function setCurrentPage(value) {
  currentPage = value;
}

export function setAllPeople(value) {
  allPeople = value;
}

export function setAllLocations(value) {
  allLocations = value;
}

export function setAllTimeline(value) {
  allTimeline = value;
}

export function setCaseData(value) {
  caseData = value;
}

export function setCurrentPeopleTab(value) {
  currentPeopleTab = value;
}

export function setLoadingStepsRemaining(value) {
  loadingStepsRemaining = value;
}

export function setNotesStore(value) {
  notesStore = value;
}

export function incrementModalCloseListenerCount() {
  modalCloseListenerCount++;
}