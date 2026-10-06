import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types.js";

// ---------------------------------------------------------------------
// SHARED APPLICATION STATE
// ---------------------------------------------------------------------

export var allEvidence: Evidence[] = [];
export var filteredEvidence: Evidence[] = [];
export var selectedEvidence: Evidence | null = null;
export var bookmarks: string[] = [];

export type AppView =
  | "dashboard"
  | "evidence"
  | "people"
  | "timeline"
  | "workspace";

export var currentPage: AppView = "dashboard";

export var allPeople: Person[] = [];
export var allLocations: Location[] = [];
export var allTimeline: TimelineEvent[] = [];
export var caseData: CaseData | null = null;

export type PeopleTab = "people" | "locations";
export var currentPeopleTab: PeopleTab = "people";

export var loadingStepsRemaining: number = 2;

export var evidenceViewLoading: boolean = true;

export var viewRendered: Record<AppView, boolean> = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

export var notesStore: Record<string, string> = {};
export var modalCloseListenerCount: number = 0;

// ---------------------------------------------------------------------
// STATE UPDATE FUNCTIONS
// ---------------------------------------------------------------------

export function setAllEvidence(value: Evidence[]) {
  allEvidence = value;
}

export function setFilteredEvidence(value: Evidence[]) {
  filteredEvidence = value;
}

export function setSelectedEvidence(value: Evidence | null) {
  selectedEvidence = value;
}

export function setBookmarks(value: string[]) {
  bookmarks = value;
}

export function setCurrentPage(value: AppView) {
  currentPage = value;
}

export function setAllPeople(value: Person[]) {
  allPeople = value;
}

export function setAllLocations(value: Location[]) {
  allLocations = value;
}

export function setAllTimeline(value: TimelineEvent[]) {
  allTimeline = value;
}

export function setCaseData(value: CaseData) {
  caseData = value;
}

export function setCurrentPeopleTab(value: PeopleTab) {
  currentPeopleTab = value;
}

export function setLoadingStepsRemaining(value: number) {
  loadingStepsRemaining = value;
}

export function setEvidenceViewLoading(value: boolean) {
  evidenceViewLoading = value;
}

export function setNotesStore(value: Record<string, string>) {
  notesStore = value;
}

export function incrementModalCloseListenerCount() {
  modalCloseListenerCount++;
}
