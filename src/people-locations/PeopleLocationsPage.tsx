import { NavLink } from "react-router";

import type {
  Evidence,
  Location,
  Person,
} from "../types";

import Panel from "../shared/components/Panel";
import PeopleSection from "./PeopleSection";
import LocationsSection from "./LocationsSection";

type TeamView = "people" | "locations";

interface PeopleLocationsPageProps {
  people: Person[];
  locations: Location[];
  evidence: Evidence[];
  view: TeamView;
}

export default function PeopleLocationsPage({
  people,
  locations,
  evidence,
  view,
}: PeopleLocationsPageProps) {
  return (
    <section className="view active">
      <h2>People &amp; Locations</h2>

      <nav
        className="tab-bar"
        aria-label="People and locations"
      >
        <NavLink
          to="/team/people"
          className={({ isActive }) =>
            isActive
              ? "tab-btn active"
              : "tab-btn"
          }
        >
          People
        </NavLink>

        <NavLink
          to="/team/locations"
          className={({ isActive }) =>
            isActive
              ? "tab-btn active"
              : "tab-btn"
          }
        >
          Locations
        </NavLink>
      </nav>

      {view === "people" ? (
        <Panel title="People">
          <PeopleSection
            people={people}
            evidence={evidence}
          />
        </Panel>
      ) : (
        <Panel title="Locations">
          <LocationsSection
            locations={locations}
          />
        </Panel>
      )}
    </section>
  );
}