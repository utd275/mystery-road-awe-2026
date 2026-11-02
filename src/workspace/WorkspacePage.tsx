import {
  type ChangeEvent,
  type FormEvent,
  useState,
} from "react";

import { Link } from "react-router";

import type {
  Evidence,
  Person,
} from "../types";

import {
  STORAGE_KEY_HYPOTHESIS,
} from "../storage";

import NoteForm from "./NoteForm";

import {
  useBookmarks,
} from "../bookmarks/BookmarkContext";

interface WorkspacePageProps {
  evidence: Evidence[];
  people: Person[];
}


interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: string;
  explanation: string;
  alternative: string;
}

const emptyHypothesis: HypothesisDraft = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: "50",
  explanation: "",
  alternative: "",
};



function loadStoredNotes(): Record<
  string,
  string
> {
  try {
    const raw = localStorage.getItem(
      "remotion_notes"
    );

    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed)
    ) {
      return {};
    }

    const result: Record<string, string> =
      {};

    for (const [key, value] of Object.entries(
      parsed as Record<string, unknown>
    )) {
      if (typeof value === "string") {
        result[key] = value;
      }
    }

    return result;
  } catch {
    return {};
  }
}

function loadStoredHypothesis():
  HypothesisDraft {
  try {
    const raw = localStorage.getItem(
      STORAGE_KEY_HYPOTHESIS
    );

    if (!raw) {
      return emptyHypothesis;
    }

    const parsed = JSON.parse(raw) as Partial<
      HypothesisDraft
    >;

    return {
      suspectId:
        typeof parsed.suspectId === "string"
          ? parsed.suspectId
          : "",

      nature:
        typeof parsed.nature === "string"
          ? parsed.nature
          : "",

      evidenceIds:
        Array.isArray(parsed.evidenceIds)
          ? parsed.evidenceIds.filter(
              (id): id is string =>
                typeof id === "string"
            )
          : [],

      confidence:
        typeof parsed.confidence === "string"
          ? parsed.confidence
          : "50",

      explanation:
        typeof parsed.explanation === "string"
          ? parsed.explanation
          : "",

      alternative:
        typeof parsed.alternative === "string"
          ? parsed.alternative
          : "",
    };
  } catch {
    return emptyHypothesis;
  }
}

export default function WorkspacePage({
  evidence,
  people,
}: WorkspacePageProps) {

  const {
    bookmarks,
  } = useBookmarks();

  const [
    notes,
    setNotes,
  ] = useState<
    Record<string, string>
  >(loadStoredNotes)

  const [
    hypothesis,
    setHypothesis,
  ] = useState<HypothesisDraft>(
    loadStoredHypothesis
  );

  const [
    draftSaved,
    setDraftSaved,
  ] = useState(false);

  const bookmarkedItems = evidence.filter(
    (item) => bookmarks.includes(item.id)
  );

  const noteEntries = evidence
    .map((item) => ({
      evidence: item,
      text: notes[item.id] ?? "",
    }))
    .filter(
      (entry) =>
        entry.text.trim().length > 0
    );

  function handleSaveNote(
    evidenceId: string,
    text: string
  ) {
    const nextNotes = {
      ...notes,
      [evidenceId]: text,
    };

    setNotes(nextNotes);

    localStorage.setItem(
      "remotion_notes",
      JSON.stringify(nextNotes)
    );
  }

  function handleEvidenceSelection(
    event: ChangeEvent<HTMLSelectElement>
  ) {
    const selectedIds = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );

    setHypothesis((current) => ({
      ...current,
      evidenceIds: selectedIds,
    }));

    setDraftSaved(false);
  }

  function handleSaveHypothesis(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const draftToSave = {
      ...hypothesis,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(
      STORAGE_KEY_HYPOTHESIS,
      JSON.stringify(draftToSave)
    );

    setDraftSaved(true);
  }

  return (
    <section className="view active">
      <h2>Investigator Workspace</h2>

      <div className="workspace-grid">
        <section>
          <h3>Bookmarked Evidence</h3>

          <div className="bookmarks-list">
            {bookmarkedItems.length === 0 ? (
              <p>
                No bookmarked evidence yet.
                Bookmark items from the Evidence
                view.
              </p>
            ) : (
              bookmarkedItems.map((item) => (
                <div
                  className="mini-list-item"
                  key={item.id}
                >
                  <strong>{item.id}</strong>
                  {" — "}
                  {item.title}{" "}

                  <Link
                    className="btn btn-small btn-secondary"
                    to="/evidence"
                  >
                    Open Evidence
                  </Link>
                </div>
              ))
            )}
          </div>
        </section>

        <section>
          <h3>Investigator Notes</h3>

          <NoteForm
            evidence={evidence}
            onSaveNote={handleSaveNote}
          />

          <div className="notes-list">
            {noteEntries.length === 0 ? (
              <p>
                No notes yet. Add one from an
                evidence item's detail view.
              </p>
            ) : (
              noteEntries.map((entry) => (
                <div
                  className="mini-list-item"
                  key={entry.evidence.id}
                >
                  <strong>
                    {entry.evidence.id}
                  </strong>
                  {" — "}
                  {entry.evidence.title}

                  <div>{entry.text}</div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <section className="hypothesis-card">
        <h3>Hypothesis Draft</h3>

        <p className="hint-text">
          Record a working hypothesis for the
          investigation.
        </p>

        <form onSubmit={handleSaveHypothesis}>
          <div className="form-row">
            <label htmlFor="hypSuspect">
              Suspected responsible person
            </label>

            <select
              id="hypSuspect"
              value={hypothesis.suspectId}
              onChange={(event) => {
                setHypothesis((current) => ({
                  ...current,
                  suspectId:
                    event.target.value,
                }));

                setDraftSaved(false);
              }}
            >
              <option value="">
                Select a person…
              </option>

              {people.map((person) => (
                <option
                  key={person.id}
                  value={person.id}
                >
                  {person.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="hypNature">
              Accidental or deliberate incident
            </label>

            <select
              id="hypNature"
              value={hypothesis.nature}
              onChange={(event) => {
                setHypothesis((current) => ({
                  ...current,
                  nature:
                    event.target.value,
                }));

                setDraftSaved(false);
              }}
            >
              <option value="">
                Select…
              </option>

              <option value="accidental">
                Accidental
              </option>

              <option value="deliberate">
                Deliberate
              </option>

              <option value="unclear">
                Unclear
              </option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="hypEvidence">
              Selected supporting evidence
            </label>

            <select
              id="hypEvidence"
              multiple
              size={6}
              value={hypothesis.evidenceIds}
              onChange={
                handleEvidenceSelection
              }
            >
              {evidence.map((item) => (
                <option
                  key={item.id}
                  value={item.id}
                >
                  {item.id} - {item.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="hypConfidence">
              Confidence:{" "}
              {hypothesis.confidence}%
            </label>

            <input
              id="hypConfidence"
              type="range"
              min="0"
              max="100"
              value={hypothesis.confidence}
              onChange={(event) => {
                setHypothesis((current) => ({
                  ...current,
                  confidence:
                    event.target.value,
                }));

                setDraftSaved(false);
              }}
            />
          </div>

          <div className="form-row">
            <label htmlFor="hypExplanation">
              Written explanation
            </label>

            <textarea
              id="hypExplanation"
              rows={4}
              placeholder="Explain your reasoning…"
              value={hypothesis.explanation}
              onChange={(event) => {
                setHypothesis((current) => ({
                  ...current,
                  explanation:
                    event.target.value,
                }));

                setDraftSaved(false);
              }}
              
            />
          </div>

          <div className="form-row">
            <label htmlFor="hypAlternative">
              Alternative explanation
            </label>

            <textarea
              id="hypAlternative"
              rows={3}
              placeholder="What else could explain the evidence?"
              value={hypothesis.alternative}
              onChange={(event) => {
                setHypothesis((current) => ({
                  ...current,
                  alternative:
                    event.target.value,
                }));

                setDraftSaved(false);
              }}
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
            >
              Save hypothesis draft
            </button>

            {draftSaved && (
              <span className="saved-msg">
                Saved
              </span>
            )}
          </div>
        </form>
      </section>
    </section>
  );
}