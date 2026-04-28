type CoordinateSource = {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
};

function isValidCoordinate(value: number | null | undefined) {
  return typeof value === "number" && Number.isFinite(value);
}

export function hasCoordinates(opportunity: CoordinateSource) {
  return (
    isValidCoordinate(opportunity.latitude) &&
    isValidCoordinate(opportunity.longitude)
  );
}

export function getOpenStreetMapEmbedUrl(latitude: number, longitude: number) {
  const delta = 0.02;
  const left = longitude - delta;
  const right = longitude + delta;
  const bottom = latitude - delta;
  const top = latitude + delta;
  const marker = `${latitude},${longitude}`;

  return `https://www.openstreetmap.org/export/embed.html?bbox=${left},${bottom},${right},${top}&layer=mapnik&marker=${marker}`;
}

export function getOpenStreetMapExternalUrl(
  latitude: number,
  longitude: number,
) {
  return `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=14/${latitude}/${longitude}`;
}

export function getGoogleMapsUrl(latitude: number, longitude: number) {
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
}
