import type { Person } from "../types";
import { Link } from "react-router";

interface PersonCardProps {
  person: Person;
  relatedEvidenceCount: number;
}

export default function PersonCard({
  person,
  relatedEvidenceCount,
}: PersonCardProps) {
  return (
    <article className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={`/${person.avatar}`}
          alt={`Portrait of ${person.name}`}
        />

        <div>
          <h3>{person.name}</h3>



          <div className="person-role">
            {person.role}
          </div>
        </div>
      </div>

      <p>
        <strong>Speciality:</strong>{" "}
        {person.speciality}
      </p>

      <ul>
        {person.responsibilities.map(
          (responsibility) => (
            <li key={responsibility}>
              {responsibility}
            </li>
          )
        )}
      </ul>

      <div className="person-statement">
        &ldquo;{person.statement}&rdquo;
      </div>

      {relatedEvidenceCount > 0 && (
        <p>
          {relatedEvidenceCount} related evidence{" "} 
          {relatedEvidenceCount === 1
            ? "item"
            : "items"}
        </p>
      )}

      {relatedEvidenceCount === 0 && (
        <p>No related evidence.</p>
      )}

      <p>
        <Link to={`/team/people/${person.id}`}>
          View person details
        </Link>
      </p>

    </article>
  );
}