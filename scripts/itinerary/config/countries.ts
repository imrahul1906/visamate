// visamate/scripts/itinerary/generate/config/countries.ts

export interface CityConfig {
  slug: string;          // key in output JSON, e.g. "hokkaido"
  name: string;          // display name, e.g. "Hokkaido (Sapporo)"
  wikidataId: string;    // Wikidata Q-ID of the city
  regionQId?: string;    // broader region Q-ID (kept for future SPARQL use)
  categoryCity?: string; // override the city name used in Wikipedia category lookups.
                         // Use when display name ≠ Wikipedia category name.
                         // e.g. "Hokkaido (Sapporo)" → categoryCity: "Sapporo"
}

export interface CountryConfig {
  countryCode: string;
  countryName: string;
  cities: CityConfig[];
}

export const COUNTRIES: Record<string, CountryConfig> = {
  japan: {
    countryCode: "JP",
    countryName: "Japan",
    cities: [
      { slug: "tokyo",     name: "Tokyo",              wikidataId: "Q1490"  },
      { slug: "kyoto",     name: "Kyoto",              wikidataId: "Q34600" },
      { slug: "osaka",     name: "Osaka",              wikidataId: "Q35765" },
      { slug: "hiroshima", name: "Hiroshima",          wikidataId: "Q34120" },
      { slug: "nara",      name: "Nara",               wikidataId: "Q41587" },
      // Display name is "Hokkaido (Sapporo)" but Wikipedia category is
      // "Tourist_attractions_in_Sapporo" — use categoryCity to fix the lookup.
      {
        slug: "hokkaido",
        name: "Hokkaido (Sapporo)",
        wikidataId: "Q37951",
        categoryCity: "Sapporo",
      },
    ],
  },

  france: {
    countryCode: "FR",
    countryName: "France",
    cities: [
      { slug: "paris",    name: "Paris",    wikidataId: "Q90"    },
      { slug: "nice",     name: "Nice",     wikidataId: "Q33959" },
      { slug: "lyon",     name: "Lyon",     wikidataId: "Q456"   },
      { slug: "bordeaux", name: "Bordeaux", wikidataId: "Q1479"  },
    ],
  },

  india: {
    countryCode: "IN",
    countryName: "India",
    cities: [
      { slug: "delhi",    name: "Delhi",    wikidataId: "Q1353",   categoryCity: "Delhi" },
      { slug: "mumbai",   name: "Mumbai",   wikidataId: "Q1156"  },
      { slug: "agra",     name: "Agra",     wikidataId: "Q28403" },
      { slug: "jaipur",   name: "Jaipur",   wikidataId: "Q39369" },
      { slug: "goa",      name: "Goa",      wikidataId: "Q1171"  },
      { slug: "varanasi", name: "Varanasi", wikidataId: "Q200683" },
    ],
  },

  thailand: {
    countryCode: "TH",
    countryName: "Thailand",
    cities: [
      { slug: "bangkok",    name: "Bangkok",    wikidataId: "Q1861"   },
      { slug: "chiang_mai", name: "Chiang Mai", wikidataId: "Q54169"  },
      { slug: "phuket",     name: "Phuket",     wikidataId: "Q13011"  },
      { slug: "pattaya",    name: "Pattaya",    wikidataId: "Q214073" },
    ],
  },

  italy: {
    countryCode: "IT",
    countryName: "Italy",
    cities: [
      { slug: "rome",     name: "Rome",     wikidataId: "Q220"  },
      { slug: "venice",   name: "Venice",   wikidataId: "Q641"  },
      { slug: "florence", name: "Florence", wikidataId: "Q2044" },
      { slug: "milan",    name: "Milan",    wikidataId: "Q490"  },
      { slug: "naples",   name: "Naples",   wikidataId: "Q2634" },
    ],
  },

  usa: {
    countryCode: "US",
    countryName: "United States",
    cities: [
      { slug: "new_york",      name: "New York City", wikidataId: "Q60",    categoryCity: "New_York_City" },
      { slug: "los_angeles",   name: "Los Angeles",   wikidataId: "Q65"    },
      { slug: "las_vegas",     name: "Las Vegas",     wikidataId: "Q34404" },
      { slug: "san_francisco", name: "San Francisco", wikidataId: "Q62"    },
      { slug: "chicago",       name: "Chicago",       wikidataId: "Q1297"  },
    ],
  },

  uae: {
    countryCode: "AE",
    countryName: "United Arab Emirates",
    cities: [
      { slug: "dubai",     name: "Dubai",     wikidataId: "Q612"   },
      { slug: "abu_dhabi", name: "Abu Dhabi", wikidataId: "Q42534", categoryCity: "Abu_Dhabi" },
    ],
  },
};