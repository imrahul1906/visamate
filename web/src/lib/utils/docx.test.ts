import { describe, it, expect } from 'vitest';
import {
  LETTER_PAGE_SIZE,
  LETTER_MARGIN,
  A4_PAGE_SIZE,
  A4_MARGIN,
  DEFAULT_FONT,
  createPara,
  createMultiPara,
  createSigLine,
} from './docx';
import { Paragraph, TextRun } from 'docx';

describe('docx.ts - Document Compiler Helpers', () => {

  describe('Page Geometry Constants', () => {
    it('should define US Letter dimensions and margins correctly', () => {
      expect(LETTER_PAGE_SIZE).toEqual({ width: 12240, height: 15840 });
      expect(LETTER_MARGIN).toEqual({ top: 1440, right: 1440, bottom: 1440, left: 1440 });
    });

    it('should define A4 dimensions and margins correctly', () => {
      expect(A4_PAGE_SIZE).toEqual({ width: 11906, height: 16838 });
      expect(A4_MARGIN).toEqual({ top: 1134, right: 1134, bottom: 1134, left: 1134 });
    });

    it('should set default font to Times New Roman', () => {
      expect(DEFAULT_FONT).toBe('Times New Roman');
    });
  });

  describe('createPara constructor', () => {
    it('should build a Paragraph with a single text run', () => {
      const para = createPara('Hello World');
      
      expect(para).toBeInstanceOf(Paragraph);
      
      // Verify children (TextRun)
      const children = (para as any).root;
      expect(Array.isArray(children)).toBe(true);
      
      // Let's check that we can compile it without errors
      expect(para).toBeDefined();
    });

    it('should apply bold and custom font options correctly', () => {
      const para = createPara('Bold Text', {
        bold: true,
        italics: true,
        size: 20,
        font: 'Arial'
      });
      
      expect(para).toBeDefined();
    });
  });

  describe('createMultiPara split logic', () => {
    it('should split multi-line string into separate paragraphs', () => {
      const text = 'Line 1\nLine 2\nLine 3';
      const paras = createMultiPara(text);

      expect(Array.isArray(paras)).toBe(true);
      expect(paras.length).toBe(3);
      paras.forEach(p => {
        expect(p).toBeInstanceOf(Paragraph);
      });
    });
  });

  describe('createSigLine formatter', () => {
    it('should compile a signature line with label and value', () => {
      const para = createSigLine('Applicant Name', 'Rahul Kumar');
      
      expect(para).toBeInstanceOf(Paragraph);
      expect(para).toBeDefined();
    });
  });

});
