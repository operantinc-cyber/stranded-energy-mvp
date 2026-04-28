import { describe, expect, it } from "vitest";
import {
  getGoogleMapsUrl,
  getOpenStreetMapEmbedUrl,
  hasCoordinates,
} from "./maps";

describe("maps", () => {
  it("returns true only when latitude and longitude are valid numbers", () => {
    expect(hasCoordinates({ latitude: 31.9686, longitude: -99.9018 })).toBe(
      true,
    );
    expect(hasCoordinates({ latitude: 31.9686, longitude: null })).toBe(false);
    expect(hasCoordinates({ latitude: null, longitude: -99.9018 })).toBe(false);
    expect(hasCoordinates({ latitude: Number.NaN, longitude: -99.9018 })).toBe(
      false,
    );
  });

  it("creates an OpenStreetMap embed URL with latitude and longitude", () => {
    const url = getOpenStreetMapEmbedUrl(31.9686, -99.9018);

    expect(url).toContain("openstreetmap.org/export/embed.html");
    expect(url).toContain("31.9686");
    expect(url).toContain("-99.9018");
  });

  it("creates a Google Maps URL with latitude and longitude", () => {
    const url = getGoogleMapsUrl(31.9686, -99.9018);

    expect(url).toContain("google.com/maps");
    expect(url).toContain("31.9686");
    expect(url).toContain("-99.9018");
  });
});
