import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "./types";

export interface AppData {
  caseData: CaseData;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
}

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function loadAppData(): Promise<AppData> {
  const [caseData, evidence, people, locations, timeline] =
    await Promise.all([
      fetchJson<CaseData>("/api/case"),
      fetchJson<Evidence[]>("/api/evidence"),
      fetchJson<Person[]>("/api/people"),
      fetchJson<Location[]>("/api/locations"),
      fetchJson<TimelineEvent[]>("/api/timeline"),
    ]);

  return {
    caseData,
    evidence,
    people,
    locations,
    timeline,
  };
}