import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../types";

import {
  formatDate,
  getStatusBadgeClass,
} from "../utils";

interface DashboardPageProps {
  caseData: CaseData;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
  bookmarks: string[];
}

interface StatCardProps {
  value: number;
  label: string;
}

function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

export default function DashboardPage({
  caseData,
  evidence,
  people,
  locations,
  timeline,
  bookmarks,
}: DashboardPageProps) {
  const reviewedCount = evidence.filter(
    (item) => item.status.toLowerCase() === "reviewed"
  ).length;

  const progressPct =
    evidence.length === 0
      ? 0
      : Math.round((reviewedCount / evidence.length) * 100);

  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <section className="view active">
      <h2>Case Dashboard</h2>

      <div className="case-summary-card">
        <h3>{caseData.title}</h3>

        <p>
          <span className="badge badge-flagged">
            {caseData.status.toUpperCase()}
          </span>
        </p>

        <p>{caseData.summary}</p>
      </div>

      <div className="stat-grid">
        <StatCard
          value={evidence.length}
          label="Evidence items"
        />

        <StatCard
          value={people.length}
          label="People"
        />

        <StatCard
          value={locations.length}
          label="Locations"
        />

        <StatCard
          value={bookmarks.length}
          label="Bookmarked"
        />

        <StatCard
          value={reviewedCount}
          label="Reviewed"
        />
      </div>

      <div className="dashboard-panel">
        <h3>Review progress</h3>

        <div className="progress-bar-outer">
          <div
            className="progress-bar-inner"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <p>{progressPct}% of evidence reviewed</p>
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-panel">
          <h3>Recent evidence</h3>

          {recentEvidence.length === 0 ? (
            <p>No evidence loaded yet.</p>
          ) : (
            recentEvidence.map((item) => (
              <div
                className="mini-list-item"
                key={item.id}
              >
                <strong>{item.id}</strong>
                {" — "}
                {item.title}{" "}
                <span
                  className={`badge ${getStatusBadgeClass(
                    item.status
                  )}`}
                >
                  {item.status}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="dashboard-panel">
          <h3>Recent timeline events</h3>

          {recentTimeline.length === 0 ? (
            <p>No timeline events loaded yet.</p>
          ) : (
            recentTimeline.map((event) => (
              <div
                className="mini-list-item"
                key={event.id}
              >
                <strong>{formatDate(event.time)}</strong>
                <br />
                {event.title}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}