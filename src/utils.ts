import { allEvidence, allPeople, allLocations } from "./state.js";

import type {
  Evidence,
  Location,
  Person,
} from "./types.js";

// ---------------------------------------------------------------------
// GENERIC LOOKUP HELPERS
// ---------------------------------------------------------------------

export function findEvidenceById(id: string): Evidence | null {
  for (const evidence of allEvidence) {
    if (evidence.id === id) return evidence;
  }

  return null;
}

export function findPersonById(id: string): Person | null {
  for (const person of allPeople) {
    if (person.id === id) return person;
  }

  return null;
}

export function findLocationById(id: string): Location | null {
  for (const location of allLocations) {
    if (location.id === id) return location;
  }

  return null;
}

export function evidenceMentionsPerson(
  ev: Evidence,
  person: Person,
): boolean {
  return ev.personIds.indexOf(person.id) !== -1;
}

export function formatDate(ts: string | null | undefined): string {
  if (!ts) return "Unknown date";

  var d = new Date(ts);

  if (isNaN(d.getTime())) return ts;

  return (
    d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    d.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

// Kept as arrow functions from Exercise 1 Demo 10
export const getStatusBadgeClass = (status: string | null | undefined): string => {
  var s = (status || "").toLowerCase();

  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";

  return "badge-unreviewed";
};

// Kept as arrow functions from Exercise 1 Demo 10
export const getRelevanceBadgeClass = (relevance: string | null | undefined): string => {
  var r = (relevance || "").toLowerCase();

  if (r === "relevant") return "badge-relevant";

  return "badge-unreviewed";
};
