import type { Match } from "./types.js";

type Venue = Match["venue"];

export const VENUES = {
  mexico_city: {
    city: "Mexico City",
    country: "MEX",
    stadium: "Estadio Azteca",
    tz: "America/Mexico_City",
  },
  guadalajara: {
    city: "Guadalajara",
    country: "MEX",
    stadium: "Estadio Akron",
    tz: "America/Mexico_City",
  },
  monterrey: {
    city: "Monterrey",
    country: "MEX",
    stadium: "Estadio BBVA",
    tz: "America/Monterrey",
  },
  toronto: { city: "Toronto", country: "CAN", stadium: "BMO Field", tz: "America/Toronto" },
  vancouver: { city: "Vancouver", country: "CAN", stadium: "BC Place", tz: "America/Vancouver" },
  atlanta: {
    city: "Atlanta",
    country: "USA",
    stadium: "Mercedes-Benz Stadium",
    tz: "America/New_York",
  },
  boston: { city: "Boston", country: "USA", stadium: "Gillette Stadium", tz: "America/New_York" },
  dallas: { city: "Dallas", country: "USA", stadium: "AT&T Stadium", tz: "America/Chicago" },
  houston: { city: "Houston", country: "USA", stadium: "NRG Stadium", tz: "America/Chicago" },
  kansas_city: {
    city: "Kansas City",
    country: "USA",
    stadium: "Arrowhead Stadium",
    tz: "America/Chicago",
  },
  los_angeles: {
    city: "Los Angeles",
    country: "USA",
    stadium: "SoFi Stadium",
    tz: "America/Los_Angeles",
  },
  miami: { city: "Miami", country: "USA", stadium: "Hard Rock Stadium", tz: "America/New_York" },
  new_york: {
    city: "New York / New Jersey",
    country: "USA",
    stadium: "MetLife Stadium",
    tz: "America/New_York",
  },
  philadelphia: {
    city: "Philadelphia",
    country: "USA",
    stadium: "Lincoln Financial Field",
    tz: "America/New_York",
  },
  san_francisco: {
    city: "San Francisco Bay Area",
    country: "USA",
    stadium: "Levi's Stadium",
    tz: "America/Los_Angeles",
  },
  seattle: { city: "Seattle", country: "USA", stadium: "Lumen Field", tz: "America/Los_Angeles" },
} as const satisfies Record<string, Venue>;

export type VenueKey = keyof typeof VENUES;
