import type { CountryInfo, CountryVisaTypes, VisaType, RoutingEntry, VfsCenterInfo, RequirementsData } from './types';

// Hard‑coded imports for Japan data (relative to this file)
import japanInfo from '../../../../data/countries/japan/info.json';
import japanVisaTypes from '../../../../data/countries/japan/visa-types.json';
import japanRoutingDelhi from '../../../../data/countries/japan/routing/delhi.json';
import japanVfsCenterDelhi from '../../../../data/vfs_center/delhi.json';
import japanRequirementsDelhi from '../../../../data/requirements/japan-tourist-delhi.json';

/**
 * Returns the country info for the given ISO country code.
 * Currently only supports Japan (JP).
 */
export function getCountryInfo(countryCode: string): CountryInfo | null {
  if (countryCode.toUpperCase() === 'JP') {
    return japanInfo as CountryInfo;
  }
  return null;
}

/**
 * Returns the list of visa types for the given country code.
 */
export function getVisaTypes(countryCode: string): VisaType[] | null {
  if (countryCode.toUpperCase() === 'JP') {
    // visa-types.json contains a CountryVisaTypes object; extract array
    const data = japanVisaTypes as CountryVisaTypes;
    return data.visaTypes ?? null;
  }
  return null;
}

/**
 * Returns the full CountryVisaTypes structure for the given country.
 */
export function getCountryVisaTypes(countryCode: string): CountryVisaTypes | null {
  if (countryCode.toUpperCase() === 'JP') {
    return japanVisaTypes as CountryVisaTypes;
  }
  return null;
}

/**
 * Returns routing entry for a given country and location id.
 * Example only includes Delhi routing for Japan.
 */
export function getRoutingEntry(countryCode: string, locationId: string): RoutingEntry | null {
  if (countryCode.toUpperCase() === 'JP' && locationId.toLowerCase() === 'delhi') {
    return japanRoutingDelhi as RoutingEntry;
  }
  return null;
}

/**
 * Returns VFS center information for a given center code.
 */
export function getVfsCenterInfo(centerCode: string): VfsCenterInfo | null {
  if (centerCode.toLowerCase() === 'delhi') {
    return japanVfsCenterDelhi as VfsCenterInfo;
  }
  return null;
}

/**
 * Returns requirements data for a given country and location.
 * Currently only supports Japan‑Delhi requirements.
 */
export function getRequirementsData(countryCode: string, locationId: string, visaTypeCode?: string): RequirementsData | null {
  if (countryCode.toUpperCase() === 'JP' && locationId.toLowerCase() === 'delhi') {
    return japanRequirementsDelhi as RequirementsData;
  }
  return null;
}
