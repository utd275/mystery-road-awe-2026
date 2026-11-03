export function formatDate(
  ts: string | null | undefined
): string {
  if (!ts) {
    return "Unknown date";
  }

  const date = new Date(ts);

  if (Number.isNaN(date.getTime())) {
    return ts;
  }

  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

export function getStatusBadgeClass(
  status: string | null | undefined
): string {
  const normalized =
    (status ?? "").toLowerCase();

  if (normalized === "reviewed") {
    return "badge-reviewed";
  }

  if (normalized === "flagged") {
    return "badge-flagged";
  }

  return "badge-unreviewed";
}

export function getRelevanceBadgeClass(
  relevance: string | null | undefined
): string {
  const normalized =
    (relevance ?? "").toLowerCase();

  if (normalized === "relevant") {
    return "badge-relevant";
  }

  return "badge-unreviewed";
}