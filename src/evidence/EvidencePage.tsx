import {
  type ChangeEvent,
  useEffect,
  useReducer,
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
}

interface EvidenceFilterState {
  searchTerm: string;
  typeFilter: string;
  personFilter: string;
  locationFilter: string;
  statusFilter: string;
  relevanceFilter: string;
  sortOrder: string;
}

type EvidenceFilterField =
  | "searchTerm"
  | "typeFilter"
  | "personFilter"
  | "locationFilter"
  | "statusFilter"
  | "relevanceFilter";

type EvidenceFilterAction =
  | {
      type: "SET_FILTER";
      field: EvidenceFilterField;
      value: string;
    }
  | {
      type: "SET_SORT";
      value: string;
    }
  | {
      type: "CLEAR_FILTERS";
    };

const initialEvidenceFilterState:
  EvidenceFilterState = {
    searchTerm: "",
    typeFilter: "",
    personFilter: "",
    locationFilter: "",
    statusFilter: "",
    relevanceFilter: "",
    sortOrder: "date-desc",
  };

function evidenceFilterReducer(
  state: EvidenceFilterState,
  action: EvidenceFilterAction
): EvidenceFilterState {
  switch (action.type) {
    case "SET_FILTER":
      return {
        ...state,
        [action.field]: action.value,
      };

    case "SET_SORT":
      return {
        ...state,
        sortOrder: action.value,
      };

    case "CLEAR_FILTERS":
      return initialEvidenceFilterState;
  }
}

/* (Exercise 6 - Demo 1)
let demoRenderCount = 0;
*/

export default function EvidencePage({
  evidence,
  people,
  locations,
}: EvidencePageProps) {
   
  /* (Exercise 6 - Demo 1)
  demoRenderCount++;
  
  console.log(
    `[Demo 1] EvidencePage render #${demoRenderCount}`
  );
  */

  const [
    filterState,
    dispatch,
  ] = useReducer(
    evidenceFilterReducer,
    initialEvidenceFilterState
  );

  const [raceRequest, setRaceRequest] =
    useState<"slow" | "fast" | null>(
      null
    );

  const [raceResult, setRaceResult] =
    useState(
      "No race request started yet."
    );
  
  /* (Exercise 6 - Demo 7)
  useEffect(() => {
    if (!raceRequest) {
      return;
    }

    const delay =
      raceRequest === "slow"
        ? 3000
        : 300;

    const label =
      raceRequest === "slow"
        ? "Slow request"
        : "Fast request";

    setRaceResult(
      `${label} started...`
    );

    fetch(
      `/api/evidence?delay=${delay}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Request failed"
          );
        }

        return response.json();
      })
      .then(() => {
        setRaceResult(
          `${label} finished and updated the UI.`
        );
      })
      .catch((error: unknown) => {
        console.error(error);

        setRaceResult(
          `${label} failed.`
        );
      });
  }, [raceRequest]);
  */

  useEffect(() => {
    if (!raceRequest) {
      return;
    }

    const controller =
      new AbortController();

    const delay =
      raceRequest === "slow"
        ? 3000
        : 300;

    const label =
     raceRequest === "slow"
        ? "Slow request"
        : "Fast request";

    setRaceResult(
      `${label} started...`
    );

    fetch(
      `/api/evidence?delay=${delay}`,
      {
        signal: controller.signal,
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "Request failed"
          );
        }

        return response.json();
      })
      .then(() => {
        setRaceResult(
          `${label} finished and updated the UI.`
        );
      })
      .catch((error: unknown) => {
        if (
          error instanceof DOMException &&
          error.name === "AbortError"
        ) {
          console.log(
            `[Demo 7] ${label} aborted`
          );

          return;
        }

        console.error(error);

        setRaceResult(
          `${label} failed.`
        );
      });

    return () => {
      controller.abort();
    };
  }, [raceRequest]);

  const {
    searchTerm,
    typeFilter,
    personFilter,
    locationFilter,
    statusFilter,
    relevanceFilter,
    sortOrder,
  } = filterState;

  
  const [
    selectedEvidenceId,
    setSelectedEvidenceId,
  ] = useState<string | null>(null);

  function dispatchFilterAction(
    action: EvidenceFilterAction
  ) {
    if (action.type !== "SET_SORT") {
      setSelectedEvidenceId(null);
    }

    dispatch(action);
  }

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

    const selectedEvidence =
      selectedEvidenceId
        ? evidence.find(
            (item) =>
              item.id === selectedEvidenceId
          ) ?? null
        : null;

  function handleSearchChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    dispatchFilterAction({
      type: "SET_FILTER",
      field: "searchTerm",
      value: event.target.value,
    });
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
    setSelectedEvidenceId(item.id);
  }

  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>

      <div>
        <h3>Demo 7 — Request race</h3>

        <button
          type="button"
          onClick={() => {
            setRaceRequest("slow");
          }}
        >
          Start slow request
        </button>

        <button
          type="button"
          onClick={() => {
            setRaceRequest("fast");
          }}
        >
          Start fast request
        </button>

        <p>{raceResult}</p>
      </div>

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
              dispatchFilterAction({
                type: "SET_FILTER",
                field: "typeFilter",
                value: event.target.value,
              })
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
              dispatchFilterAction({
                type: "SET_FILTER",
                field: "personFilter",
                value: event.target.value,
              })
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
              dispatchFilterAction({
                type: "SET_FILTER",
                field: "locationFilter",
                value: event.target.value,
              })
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
              dispatchFilterAction({
                type: "SET_FILTER",
                field: "statusFilter",
                value: event.target.value,
              })
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
              dispatchFilterAction({
                type: "SET_FILTER",
                field: "relevanceFilter",
                value: event.target.value,
              })
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
              dispatchFilterAction({
                type: "SET_SORT",
                value: event.target.value,
              })
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

          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={() =>
              dispatchFilterAction({
                type: "CLEAR_FILTERS",
              })
            }
          >
            Clear filters
          </button>
          
        </div>
      </div>

      {evidence.length === 0 ? (
        <div className="evidence-loading">
          <h3>No evidence available</h3>
          <p>
            The request succeeded, but this
            case currently contains no
            evidence.
          </p>
        </div>
      ) : displayedEvidence.length === 0 ? (
        <p>
          No evidence matches the current
          search or filters.
        </p>
      ) : (
        <div className="evidence-grid">
          {displayedEvidence.map(
            (item) => (
              <EvidenceCard
                key={item.id}
                evidence={item}
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
                setSelectedEvidenceId(null)
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