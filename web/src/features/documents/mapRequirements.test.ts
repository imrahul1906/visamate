import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { mapRequirementsToDocumentData } from './mapRequirements';
import type { RequirementsData } from '@/lib/data/types';

// Helper to align right border perfectly regardless of content length
function padLine(text: string, targetLen = 74): string {
  const padAmount = Math.max(0, targetLen - text.length);
  return `  │ ${text}${' '.repeat(padAmount)} │`;
}

describe('mapRequirements.ts - Dynamic Checklist Validator', () => {
  const requirementsDir = path.resolve(__dirname, '../../data/requirements');

  let requirementFiles: string[] = [];
  try {
    requirementFiles = fs
      .readdirSync(requirementsDir)
      .filter((file) => file.endsWith('.json'));
  } catch (err) {
    console.error(`Failed to read requirements directory at: ${requirementsDir}`, err);
  }

  // ─── Environment-Variable Filters (Granular Overrides for Each Input Field) ───
  const filterCountry = process.env.TEST_COUNTRY?.toUpperCase();
  const filterVisa = process.env.TEST_VISA?.toUpperCase();
  const filterLocation = process.env.TEST_LOCATION?.toUpperCase();
  const filterSponsorship = process.env.TEST_SPONSORSHIP?.toUpperCase(); // "SELF" or "SPONSORED"

  // Filter JSON files based on Country, Visa, or Location criteria
  if (filterCountry || filterVisa || filterLocation) {
    requirementFiles = requirementFiles.filter(filename => {
      try {
        const filePath = path.join(requirementsDir, filename);
        const rawContent = fs.readFileSync(filePath, 'utf8');
        const reqData = JSON.parse(rawContent) as RequirementsData;

        if (filterCountry && reqData.countryCode !== filterCountry) return false;
        if (filterVisa && reqData.visaTypeCode !== filterVisa) return false;
        if (filterLocation && reqData.locationCode !== filterLocation) return false;
        
        return true;
      } catch (e) {
        return false;
      }
    });
  }

  // Ensure we found some requirements files matching the filter
  it('should find at least one requirement JSON file matching criteria', () => {
    expect(requirementFiles.length).toBeGreaterThan(0);
  });

  requirementFiles.forEach((filename) => {
    const filePath = path.join(requirementsDir, filename);
    const rawContent = fs.readFileSync(filePath, 'utf8');
    const reqData = JSON.parse(rawContent) as RequirementsData;

    const { countryCode, visaTypeCode, locationCode } = reqData;

    describe(`Config: ${countryCode} · ${visaTypeCode} · ${locationCode}`, () => {
      
      it('should have correct internal identifier metadata', () => {
        expect(reqData.schemaVersion).toBeTypeOf('number');
        expect(reqData.id).toBeDefined();
        expect(reqData.countryCode).toBeDefined();
        expect(reqData.visaTypeCode).toBeDefined();
        expect(reqData.locationCode).toBeDefined();
      });

      // 2. SELF-SPONSORED mapping case (Run only if no sponsorship filter OR filter is SELF)
      const runSelfTest = !filterSponsorship || filterSponsorship === 'SELF';
      if (runSelfTest) {
        it('should map documents correctly for SELF-sponsored applicants', () => {
          const mappedSelf = mapRequirementsToDocumentData(
            reqData,
            `${countryCode} Country`,
            `${visaTypeCode} Visa`,
            `${locationCode} Center`,
            'SELF'
          );

          // Print mapped documents nicely in test log with perfect alignments
          console.log(`\n  ┌${'─'.repeat(76)}┐`);
          console.log(padLine(`INPUTS: Country: ${countryCode} | Visa: ${visaTypeCode} | Location: ${locationCode} | Sponsorship: SELF`));
          console.log(`  ├${'─'.repeat(76)}┤`);
          mappedSelf.categories.forEach(category => {
            console.log(padLine(`📁 Category: ${category.label}`));
            category.documents.forEach(doc => {
              const opt = doc.status === 'required' ? 'REQUIRED' : 'OPTIONAL';
              console.log(padLine(`  - [${opt.padEnd(8)}] ${doc.name}`));
            });
          });
          console.log(`  └${'─'.repeat(76)}┘\n`);

          expect(mappedSelf.country).toBe(`${countryCode} Country`);
          expect(mappedSelf.visaType).toBe(`${visaTypeCode} Visa`);
          expect(mappedSelf.location).toBe(`${locationCode} Center`);

          const sectionIds = mappedSelf.categories.map((c) => c.id);
          expect(sectionIds).toContain('COMMON');
          if (reqData.documentSections.some((s) => s.sectionId === 'SELF_SPONSORED')) {
            expect(sectionIds).toContain('SELF_SPONSORED');
          }
          expect(sectionIds).not.toContain('SPONSORED');

          mappedSelf.categories.forEach((category) => {
            category.documents.forEach((doc) => {
              expect(doc.id).toBeDefined();
              expect(doc.name).toBeDefined();
            });
          });
        });
      }

      // 3. SPONSORED mapping case (Run only if no sponsorship filter OR filter is SPONSORED)
      const runSponsoredTest = !filterSponsorship || filterSponsorship === 'SPONSORED';
      if (runSponsoredTest) {
        it('should map documents correctly for SPONSORED applicants', () => {
          const mappedSponsored = mapRequirementsToDocumentData(
            reqData,
            `${countryCode} Country`,
            `${visaTypeCode} Visa`,
            `${locationCode} Center`,
            'SPONSORED'
          );

          // Print mapped documents nicely in test log with perfect alignments
          console.log(`\n  ┌${'─'.repeat(76)}┐`);
          console.log(padLine(`INPUTS: Country: ${countryCode} | Visa: ${visaTypeCode} | Location: ${locationCode} | Sponsorship: SPONSOR`));
          console.log(`  ├${'─'.repeat(76)}┤`);
          mappedSponsored.categories.forEach(category => {
            console.log(padLine(`📁 Category: ${category.label}`));
            category.documents.forEach(doc => {
              const opt = doc.status === 'required' ? 'REQUIRED' : 'OPTIONAL';
              console.log(padLine(`  - [${opt.padEnd(8)}] ${doc.name}`));
            });
          });
          console.log(`  └${'─'.repeat(76)}┘\n`);

          expect(mappedSponsored.country).toBe(`${countryCode} Country`);
          expect(mappedSponsored.visaType).toBe(`${visaTypeCode} Visa`);
          expect(mappedSponsored.location).toBe(`${locationCode} Center`);

          const sectionIds = mappedSponsored.categories.map((c) => c.id);
          expect(sectionIds).toContain('COMMON');
          if (reqData.documentSections.some((s) => s.sectionId === 'SPONSORED')) {
            expect(sectionIds).toContain('SPONSORED');
          }
          expect(sectionIds).not.toContain('SELF_SPONSORED');
        });
      }

      // 4. Widget checks
      it('should correctly link special widgets like cover letters or photo specs', () => {
        const mappedSelf = mapRequirementsToDocumentData(
          reqData,
          `${countryCode} Country`,
          `${visaTypeCode} Visa`,
          `${locationCode} Center`,
          'SELF'
        );
        const allDocs = mappedSelf.categories.flatMap((c) => c.documents);

        allDocs.forEach((doc) => {
          if (doc.specialWidget === 'photo_spec') {
            expect(doc.photoSpecRef).toBeDefined();
          }
          if (doc.form && doc.form.type === 'DOWNLOADABLE') {
            expect(doc.form.downloadUrl).toBeDefined();
          }
        });
      });
    });
  });
});
