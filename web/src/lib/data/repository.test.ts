import { describe, it, expect } from 'vitest';
import { APPLICATION_MODE } from './types';
import {
  getAllCountries,
  getCountryCatalogEntry,
  getCountryInfo,
  getVisaTypes,
  getCountryVisaTypes,
  getAllLocations,
  getLocationsForCountry,
  getVfsCenterInfo,
  getRoutingEntry,
  getRequirementsData,
  getItineraryPlaces,
  getFormFillFields,
  getVisaType,
  getVisaTypesByCategory,
} from './repository';

describe('repository.ts - Data Access Layer (DAL)', () => {

  describe('Country UI Catalog APIs', () => {
    it('should return all supported countries', async () => {
      const countries = await getAllCountries();
      expect(Array.isArray(countries)).toBe(true);
      expect(countries.length).toBeGreaterThan(0);
      
      // Japan should be supported
      const jp = countries.find(c => c.code === 'JP');
      expect(jp).toBeDefined();
      expect(jp?.supported).toBe(true);

      // Vietnam should be supported
      const vn = countries.find(c => c.code === 'VN');
      expect(vn).toBeDefined();
      expect(vn?.supported).toBe(true);

      // Korea should be in catalog but not active yet
      const kr = countries.find(c => c.code === 'KR');
      expect(kr).toBeDefined();
      expect(kr?.supported).toBe(false);
    });

    it('should retrieve a country catalog entry by code (case-insensitive)', async () => {
      const entry1 = await getCountryCatalogEntry('jp');
      const entry2 = await getCountryCatalogEntry('JP  ');
      
      expect(entry1).toBeDefined();
      expect(entry1?.name).toBe('Japan');
      expect(entry1).toEqual(entry2);

      // Handle non-existent codes gracefully
      const missing = await getCountryCatalogEntry('XX');
      expect(missing).toBeNull();
    });

    it('should fail if parameter is missing or empty', async () => {
      await expect(getCountryCatalogEntry('')).rejects.toThrow();
      await expect(getCountryCatalogEntry('   ')).rejects.toThrow();
    });
  });

  describe('Dynamic JSON Loader APIs', () => {
    it('should fetch structured country info for Japan (JP)', async () => {
      const info = await getCountryInfo('JP');
      expect(info).toBeDefined();
      expect(info?.code).toBe('JP'); // code, not countryCode
      expect(Array.isArray(info?.supportedVfsLocationCodes)).toBe(true);
      expect(info?.supportedVfsLocationCodes).toContain('DELHI');
    });

    it('should fetch structured country info for Vietnam (VN)', async () => {
      const info = await getCountryInfo('VN');
      expect(info).toBeDefined();
      expect(info?.code).toBe('VN');
      expect(Array.isArray(info?.supportedVfsLocationCodes)).toBe(true);
      expect(info?.supportedVfsLocationCodes).toContain('ONLINE');
    });

    it('should fetch visa types for Japan', async () => {
      const record = await getCountryVisaTypes('JP');
      expect(record).toBeDefined();
      expect(record?.countryCode).toBe('JP');
      expect(Array.isArray(record?.visaTypes)).toBe(true);

      const types = await getVisaTypes('JP');
      expect(types.map(t => ({ ...t, process: undefined }))).toEqual(
        record?.visaTypes.map(t => ({ ...t, process: undefined }))
      );
      expect(types[0].process?.default).toEqual(record?.process?.default);

      const tourist = await getVisaType('JP', 'TOURIST');
      expect(tourist).toBeDefined();
      expect(tourist?.code).toBe('TOURIST');
    });

    it('should fetch visa types for Vietnam', async () => {
      const record = await getCountryVisaTypes('VN');
      expect(record).toBeDefined();
      expect(record?.countryCode).toBe('VN');
      expect(Array.isArray(record?.visaTypes)).toBe(true);

      const types = await getVisaTypes('VN');
      expect(types.length).toBeGreaterThan(0);
      expect(types[0].process?.default?.applicationMode).toBe(APPLICATION_MODE.ONLINE);

      const tourist = await getVisaType('VN', 'TOURIST');
      expect(tourist).toBeDefined();
      expect(tourist?.code).toBe('TOURIST');
      expect(tourist?.fees).toBe(25);
      expect(tourist?.currency).toBe('USD');

      const touristMulti = await getVisaType('VN', 'TOURIST_MULTI');
      expect(touristMulti).toBeDefined();
      expect(touristMulti?.code).toBe('TOURIST_MULTI');
      expect(touristMulti?.fees).toBe(50);
      expect(touristMulti?.currency).toBe('USD');
    });

    it('should return null for non-existent countries', async () => {
      expect(await getCountryInfo('XX')).toBeNull();
      expect(await getCountryVisaTypes('XX')).toBeNull();
    });
  });

  describe('Location & VFS Centers APIs', () => {
    it('should return active VFS locations', async () => {
      const locations = await getAllLocations();
      expect(Array.isArray(locations)).toBe(true);
      
      const vfsCodes = locations.map(l => l.code);
      expect(vfsCodes).toContain('DELHI');
      expect(vfsCodes).toContain('MUMBAI');
      expect(vfsCodes).not.toContain('HYDERABAD'); // Hyderabad exists in catalog but is not active
    });

    it('should fetch locations for Japan (JP)', async () => {
      const locations = await getLocationsForCountry('JP');
      expect(locations.length).toBeGreaterThan(0);
      
      const vfsCodes = locations.map(l => l.code);
      expect(vfsCodes).toContain('DELHI');
      expect(vfsCodes).toContain('MUMBAI');
    });

    it('should fetch locations for Vietnam (VN)', async () => {
      const locations = await getLocationsForCountry('VN');
      expect(locations.length).toBe(1);
      expect(locations[0].code).toBe('ONLINE');
    });

    it('should fetch center details dynamically', async () => {
      const delhi = await getVfsCenterInfo('DELHI');
      expect(delhi).toBeDefined();
      expect(delhi?.code).toBe('DELHI'); // code, not locationCode
      expect(delhi?.vfsCenter?.address).toBeDefined(); // nested under vfsCenter

      const mumbai = await getVfsCenterInfo('MUMBAI');
      expect(mumbai).toBeDefined();
      expect(mumbai?.code).toBe('MUMBAI');

      expect(await getVfsCenterInfo('HYDERABAD')).toBeNull();
    });
  });

  describe('Routing & Requirements APIs', () => {
    it('should retrieve routing entries', async () => {
      const routing = await getRoutingEntry('JP', 'DELHI');
      expect(routing).toBeDefined();
      expect(routing?.authorityLabel).toBeDefined(); // authorityLabel, not embassyName

      expect(await getRoutingEntry('JP', 'XX')).toBeNull();
    });

    it('should fetch requirements dynamically', async () => {
      const req = await getRequirementsData('JP', 'TOURIST', 'DELHI');
      expect(req).toBeDefined();
      expect(req?.countryCode).toBe('JP');
      expect(req?.visaTypeCode).toBe('TOURIST');
      expect(req?.locationCode).toBe('DELHI');

      const reqVn = await getRequirementsData('VN', 'TOURIST', 'ONLINE');
      expect(reqVn).toBeDefined();
      expect(reqVn?.countryCode).toBe('VN');
      expect(reqVn?.visaTypeCode).toBe('TOURIST');
      expect(reqVn?.locationCode).toBe('ONLINE');

      const reqVnMulti = await getRequirementsData('VN', 'TOURIST_MULTI', 'ONLINE');
      expect(reqVnMulti).toBeDefined();
      expect(reqVnMulti?.countryCode).toBe('VN');
      expect(reqVnMulti?.visaTypeCode).toBe('TOURIST_MULTI');
      expect(reqVnMulti?.locationCode).toBe('ONLINE');

      // Invalid combination
      expect(await getRequirementsData('JP', 'TOURIST', 'HYDERABAD')).toBeNull();
    });

    it('should fetch itinerary place suggestions', async () => {
      const places = await getItineraryPlaces('JP');
      expect(places).toBeDefined();
      expect(places?.cities).toBeTypeOf('object'); // object record, not array
      
      const tokyo = places?.cities?.tokyo;
      expect(tokyo).toBeDefined();
      expect(tokyo?.name).toBe('Tokyo');
    });
  });

  describe('Visa Form Fill & Category Filter APIs', () => {
    it('should return form fill field definitions', async () => {
      const fields = await getFormFillFields('JP_TOURIST_VISA_FORM_FIELDS_V1');
      expect(fields.length).toBeGreaterThan(0);

      const fieldsVn = await getFormFillFields('VN_TOURIST_EVISA_FORM_FIELDS_V1');
      expect(fieldsVn.length).toBeGreaterThan(0);

      // Verify structure of fields
      const field = fields[0];
      expect(field.id).toBeDefined();
      expect(field.label).toBeDefined();
      expect(field.section).toBeDefined();

      // Empty/invalid keys
      expect(await getFormFillFields('')).toEqual([]);
      expect(await getFormFillFields('INVALID_KEY')).toEqual([]);
    });

    it('should filter visa types by category', async () => {
      const shortStayVisaTypes = await getVisaTypesByCategory('JP', 'SHORT_STAY'); // SHORT_STAY category
      expect(shortStayVisaTypes.length).toBeGreaterThan(0);
      
      shortStayVisaTypes.forEach(v => {
        expect(v.category).toBe('SHORT_STAY');
      });
    });
  });

});
