import type {
  PersonId,
  TimelineEvent,
} from "../types";
import { useSearchParams } from "react-router";

import TimelineEventCard from "./TimelineEventCard";

interface TimelinePageProps {
  timeline: TimelineEvent[];
}

export default function TimelinePage({
  timeline,
}: TimelinePageProps) {
  const [searchParams] = useSearchParams();
  const personId = searchParams.get("person") as PersonId | null;

  const displayedTimeline = personId
    ? timeline.filter((event) =>
        event.personIds.includes(personId)
      )
    : timeline;

  return (
    <section className="view active">
      <h2>Investigation Timeline</h2>

      <div className="timeline-container">
        {displayedTimeline.map((event) => (
          <TimelineEventCard
            key={event.id}
            event={event}
          />
        ))}
      </div>
    </section>
  );
}