import type {
  TimelineCertainty,
  TimelineEvent,
} from "../types";

import { formatDate } from "../utils";

import Badge from "../shared/components/Badge";

interface TimelineEventCardProps {
  event: TimelineEvent;
}

function certaintyBadgeVariant(
  certainty: TimelineCertainty
): "reviewed" | "critical" | "flagged" {
  if (certainty === "confirmed") {
    return "reviewed";
  }

  if (certainty === "contradictory") {
    return "critical";
  }

  return "flagged";
}

export default function TimelineEventCard({
  event,
}: TimelineEventCardProps) {
  return (
    <article
      className={`timeline-event certainty-${event.certainty}`}
    >
      <div className="timeline-time">
        {formatDate(event.time)}
        {" · "}
        <Badge
          variant={certaintyBadgeVariant(
            event.certainty
          )}
        >
          {event.certainty}
        </Badge>
      </div>

      <h3>{event.title}</h3>

      <p>{event.description}</p>

      {event.locationIds.length > 0 && (
        <p className="evidence-meta">
          Locations: {event.locationIds.join(", ")}
        </p>
      )}
    </article>
  );
}