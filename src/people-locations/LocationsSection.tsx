import type { Location } from "../types";

import LocationCard from "./LocationCard";

interface LocationsSectionProps {
  locations: Location[];
}

export default function LocationsSection({
  locations,
}: LocationsSectionProps) {
  return (
    <div className="locations-grid">
      {locations.map((location) => (
        <LocationCard
          key={location.id}
          location={location}
        />
      ))}
    </div>
  );
}