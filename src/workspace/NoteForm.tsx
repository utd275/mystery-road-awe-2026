import {
  type FormEvent,
  useState,
} from "react";

import type { Evidence } from "../types";

interface NoteFormProps {
  evidence: Evidence[];
  onSaveNote: (
    evidenceId: string,
    text: string
  ) => void;
}

export default function NoteForm({
  evidence,
  onSaveNote,
}: NoteFormProps) {
  const [
    evidenceId,
    setEvidenceId,
  ] = useState("");

  const [text, setText] = useState("");

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedText = text.trim();

    if (!evidenceId || !trimmedText) {
      return;
    }

    onSaveNote(
      evidenceId,
      trimmedText
    );

    setText("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="noteEvidence">
          Evidence item
        </label>

        <select
          id="noteEvidence"
          value={evidenceId}
          onChange={(event) =>
            setEvidenceId(
              event.target.value
            )
          }
        >
          <option value="">
            Select evidence…
          </option>

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
        <label htmlFor="noteText">
          Note
        </label>

        <textarea
          id="noteText"
          rows={3}
          value={text}
          placeholder="Add an investigator note…"
          onChange={(event) =>
            setText(
              event.target.value
            )
          }
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            !evidenceId ||
            !text.trim()
          }
        >
          Save note
        </button>
      </div>
    </form>
  );
}