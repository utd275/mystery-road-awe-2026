import type { MouseEvent } from "react";

import {
  useBookmarks,
} from "../bookmarks/BookmarkContext";

import type { Evidence } from "../types";

import {
  formatDate,
  getRelevanceBadgeClass,
  getStatusBadgeClass,
} from "../utils";


interface EvidenceCardProps {
  evidence: Evidence;
  onOpen: (
    evidence: Evidence
  ) => void;
}

export default function EvidenceCard({
  evidence,
  onOpen,
}: EvidenceCardProps) {
  const {
    bookmarks,
    onToggleBookmark,
  } = useBookmarks();

  const isBookmarked =
    bookmarks.includes(evidence.id);
    
  function handleBookmarkClick(
    event: MouseEvent<HTMLButtonElement>
  ) {
    event.stopPropagation();

    onToggleBookmark(evidence.id);
  }

  return (
    <article
      className="evidence-card"
      onClick={() => onOpen(evidence)}
    >
      <button
        type="button"
        className={
          isBookmarked
            ? "bookmark-btn active"
            : "bookmark-btn"
        }
        onClick={handleBookmarkClick}
        aria-label={`Toggle bookmark for ${evidence.title}`}
      >
        <span className="bookmark-icon">
          {isBookmarked ? "★" : "☆"}
        </span>
      </button>

      <h3>{evidence.title}</h3>

      <div className="evidence-meta">
        {evidence.id}
        {" · "}
        {evidence.type}
        {" · "}
        {formatDate(evidence.timestamp)}
      </div>

      <div className="evidence-summary">
        {evidence.summary}
      </div>

      {evidence.tags.includes("critical") && (
        <span className="badge badge-critical">
          Critical
        </span>
      )}

      <span
        className={`badge ${getStatusBadgeClass(
          evidence.status
        )}`}
      >
        {evidence.status}
      </span>

      <span
        className={`badge ${getRelevanceBadgeClass(
          evidence.relevance
        )}`}
      >
        {evidence.relevance}
      </span>

      <div>
        {evidence.tags.map((tag) => (
          <span
            className="tag-chip"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>
    </article>
  );
}