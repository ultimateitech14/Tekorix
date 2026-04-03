export const jobCountries = [
  "United States",
  "India",
  "United Kingdom",
  "Canada",
  "Germany",
  "Australia",
  "Singapore",
  "United Arab Emirates",
  "Remote",
] as const;

export type JobCountry = (typeof jobCountries)[number];

export const jobCitiesByCountry: Record<JobCountry, string[]> = {
  "United States": ["New York, NY", "San Francisco, CA", "Austin, TX", "Chicago, IL", "Seattle, WA"],
  India: ["Bengaluru", "Pune", "Hyderabad", "Mumbai", "Delhi NCR"],
  "United Kingdom": ["London", "Manchester", "Bristol", "Birmingham"],
  Canada: ["Toronto", "Vancouver", "Montreal", "Calgary"],
  Germany: ["Berlin", "Munich", "Hamburg", "Frankfurt"],
  Australia: ["Sydney", "Melbourne", "Brisbane", "Perth"],
  Singapore: ["Singapore"],
  "United Arab Emirates": ["Dubai", "Abu Dhabi"],
  Remote: ["Remote"],
};

export function isJobCountry(value: string): value is JobCountry {
  return jobCountries.includes(value as JobCountry);
}

export function getCitiesForCountry(country: string) {
  if (isJobCountry(country)) {
    return jobCitiesByCountry[country];
  }

  return [];
}

export function buildJobLocation(country: string, city: string) {
  if (country === "Remote" || city.toLowerCase() === "remote") {
    return "Remote";
  }

  return `${city}, ${country}`;
}
