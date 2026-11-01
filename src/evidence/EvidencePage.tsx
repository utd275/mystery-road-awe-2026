import {
  type ChangeEvent,
  useState,
} from "react";

import type {
  Evidence,
  Location,
  Person,
} from "../types";

import EvidenceCard from "./EvidenceCard";

interface EvidencePageProps {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  bookmarks: string[];
  onToggleBookmark: (
    evidenceId: string
  ) => void;
}



export default function EvidencePage({
  evidence,
  people,
  locations,
  bookmarks,
  onToggleBookmark,
}: EvidencePageProps) {
  const [searchTerm, setSearchTerm] =
    useState("");
  const [typeFilter, setTypeFilter] =
    useState("");

  const [personFilter, setPersonFilter] =
    useState("");

  const [locationFilter, setLocationFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [relevanceFilter, setRelevanceFilter] =
    useState("");

  const [sortOrder, setSortOrder] =
    useState("date-desc");

  
  const [
    selectedEvidence,
    setSelectedEvidence,
  ] = useState<Evidence | null>(null);

  const typeOptions = Array.from(
    new Set(
      evidence.map((item) =>
        item.type.toLowerCase()
      )
    )
  ).sort();

  const displayedEvidence = evidence
    .filter((item) => {
      const term =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !term ||
        item.title
          .toLowerCase()
          .includes(term) ||
        item.summary
          .toLowerCase()
          .includes(term) ||
        item.tags.some((tag) =>
          tag.toLowerCase().includes(term)
        );

      const matchesType =
        !typeFilter ||
        item.type.toLowerCase() === typeFilter;

      const matchesPerson =
        !personFilter ||
        item.personIds.some(
          (id) => id === personFilter
        );

      const matchesLocation =
        !locationFilter ||
        item.locationIds.some(
          (id) => id === locationFilter
        );

      const matchesStatus =
        !statusFilter ||
        item.status.toLowerCase() ===
          statusFilter;

      const matchesRelevance =
        !relevanceFilter ||
        item.relevance.toLowerCase() ===
          relevanceFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesPerson &&
        matchesLocation &&
        matchesStatus &&
        matchesRelevance
      );
    })
    .sort((a, b) => {
      switch (sortOrder) {
        case "date-asc":
          return (
            new Date(a.timestamp).getTime() -
            new Date(b.timestamp).getTime()
          );

        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "date-desc":
        default:
          return (
            new Date(b.timestamp).getTime() -
            new Date(a.timestamp).getTime()
          );
      }
    });

  function handleSearchChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setSearchTerm(event.target.value);
  }

  
  
  

  /* (Demo3)
  function handleToggleBookmark(
    evidenceId: string
  ) {
    if (bookmarks.includes(evidenceId)) {
      const index =
        bookmarks.indexOf(evidenceId);

      bookmarks.splice(index, 1);
    } else {
      bookmarks.push(evidenceId);
    }

    setBookmarks(bookmarks);

    localStorage.setItem(
      "remotion_bookmarks",
      JSON.stringify(bookmarks)
    );
  }
  */



  function handleOpenEvidence(
    item: Evidence
  ) {
    setSelectedEvidence(item);
  }

  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>

      <div className="toolbar">
        <div className="toolbar-row">
          <input
            type="text"
            placeholder="Search evidence..."
            value={searchTerm}
            onChange={handleSearchChange}
          />

          <select
            value={typeFilter}
            onChange={(event) =>
              setTypeFilter(event.target.value)
            }
          >
            <option value="">
              All types
            </option>

            {typeOptions.map((type) => (
              <option
                key={type}
                value={type}
              >
                {type}
              </option>
            ))}
          </select>

          <select
            value={personFilter}
            onChange={(event) =>
              setPersonFilter(event.target.value)
            }
          >
            <option value="">
              All people
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

          <select
            value={locationFilter}
            onChange={(event) =>
              setLocationFilter(event.target.value)
            }
          >
            <option value="">
              All locations
            </option>

            {locations.map((location) => (
              <option
                key={location.id}
                value={location.id}
              >
                {location.id}
                {" - "}
                {location.name}
              </option>
            ))}
          </select>
        </div>

        <div className="toolbar-row">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="">
              All statuses
            </option>

            <option value="unreviewed">
              Unreviewed
            </option>

            <option value="reviewed">
              Reviewed
            </option>
            
            <option value="flagged">
              Flagged
            </option>
          </select>

          <select
            value={relevanceFilter}
            onChange={(event) =>
              setRelevanceFilter(event.target.value)
            }
          >
            <option value="">
              All relevance
            </option>

            <option value="unknown">
              Unknown
            </option>

            <option value="relevant">
              Relevant
            </option>

            <option value="irrelevant">
              Irrelevant
            </option>
          </select>

          <select
            value={sortOrder}
            onChange={(event) =>
               setSortOrder(event.target.value)
            }
          >
            <option value="date-desc">
              Newest first
            </option>

            <option value="date-asc">
              Oldest first
            </option>

            <option value="title-asc">
              Title A-Z
            </option>

            <option value="title-desc">
              Title Z-A
            </option>
          </select>
        </div>
      </div>

      {displayedEvidence.length === 0 ? (
        <p>
          No evidence matches the current
          search.
        </p>
      ) : (
        <div className="evidence-grid">
          {displayedEvidence.map(
            (item) => (
              <EvidenceCard
                key={item.id}
                evidence={item}
                isBookmarked={bookmarks.includes(
                  item.id
                )}
                onToggleBookmark={
                  onToggleBookmark
                }
                onOpen={
                  handleOpenEvidence
                }
              />
            )
          )}
        </div>
      )}

      {selectedEvidence && (
        <section className="evidence-detail">
          <div className="evidence-detail-header">
            <div>
              <h2>
                {selectedEvidence.title}
              </h2>

              <div className="evidence-meta">
                {selectedEvidence.id}
                {" · "}
                {selectedEvidence.type}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() =>
                setSelectedEvidence(null)
              }
            >
              Close
            </button>
          </div>

          {selectedEvidence.tags.includes(
            "critical"
          ) && (
            <div className="warning-banner">
              This item is tagged as
              critical evidence.
            </div>
          )}

          <div className="detail-field">
            <strong>Summary</strong>
            {selectedEvidence.summary}
          </div>

          <div className="evidence-detail-content">
            {selectedEvidence.content}
          </div>

          <div className="detail-field">
            <strong>Tags</strong>

            {selectedEvidence.tags.map(
              (tag) => (
                <span
                  className="tag-chip"
                  key={tag}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </section>
      )}
    </section>
  );
}