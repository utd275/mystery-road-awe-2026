export type PersonId =
  | "signal-scholar"
  | "kernel-colt"
  | "nova-byte"
  | "patch-vector"
  | "refactor-rex"
  | "root-harbor";

export type LocationId =
  | "L01"
  | "L02"
  | "L03"
  | "L04"
  | "L05"
  | "L06";

export type TimelineCertainty =
  | "confirmed"
  | "reported"
  | "contradictory";

export interface CaseData {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: string;
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

export interface Evidence {
  id: string;
  type: string;
  title: string;
  timestamp: string;
  summary: string;
  content: string;
  personIds: PersonId[];
  locationIds: LocationId[];
  tags: string[];
  status: string;
  relevance: string;
}

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  contains: string[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  type: string;
  certainty: TimelineCertainty;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: string[];
}
