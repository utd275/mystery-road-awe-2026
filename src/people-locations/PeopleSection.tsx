import type {
  Evidence,
  Person,
} from "../types";

import PersonCard from "./PersonCard";

interface PeopleSectionProps {
  people: Person[];
  evidence: Evidence[];
}

export default function PeopleSection({
  people,
  evidence,
}: PeopleSectionProps) {
  if (people.length === 0) {
    return <p>No people available.</p>;
  }

  return (
    <div className="people-grid">
      {people.map((person) => {
        const relatedEvidenceCount =
          evidence.filter((item) =>
            item.personIds.includes(person.id)
          ).length;

        return (
          <PersonCard
            key={person.id}
            person={person}
            relatedEvidenceCount={
              relatedEvidenceCount
            }
          />
        );
      })}
    </div>
  );
}