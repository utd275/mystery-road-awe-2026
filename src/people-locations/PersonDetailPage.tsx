import {
  Link,
  useParams,
} from "react-router";

import type {
  Evidence,
  Person,
} from "../types";

import PersonCard from "./PersonCard";

interface PersonDetailPageProps {
  people: Person[];
  evidence: Evidence[];
}

export default function PersonDetailPage({
  people,
  evidence,
}: PersonDetailPageProps) {
  const { personId } =
    useParams<{ personId: string }>();

  if (!personId) {
    return (
      <section className="view active">
        <h2>Person not found</h2>

        <Link to="/team/people">
          Back to People
        </Link>
      </section>
    );
  }

  const person = people.find(
    (candidate) =>
      candidate.id === personId
  );

  if (!person) {
    return (
      <section className="view active">
        <h2>Person not found</h2>

        <p>
          No person exists with the id{" "}
          <strong>{personId}</strong>.
        </p>

        <Link to="/team/people">
          Back to People
        </Link>
      </section>
    );
  }

  const relatedEvidenceCount =
    evidence.filter((item) =>
      item.personIds.includes(person.id)
    ).length;

  return (
    <section className="view active">
      <Link to="/team/people">
        ← Back to People
      </Link>

      <h2>Person Details</h2>

      <PersonCard
        person={person}
        relatedEvidenceCount={
          relatedEvidenceCount
        }
      />

      <p>
        <Link to={`/timeline?person=${person.id}`}>
          View this person's timeline
        </Link>
      </p>
    </section>
  );
}