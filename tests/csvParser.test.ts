// Fix: Import Jest globals to resolve 'Cannot find name describe/it/expect' errors
import { describe, it, expect } from '@jest/globals';

// Mock of the parser logic from DataImport.tsx
const parseCSV = (text: string): any[] => {
  const lines = text.split('\n');
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(',').map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, i) => {
      obj[header] = values[i];
    });
    return obj;
  });
};

describe('CSV Parser', () => {
  it('should correctly map CSV rows to objects', () => {
    const csv = `Date,Description,Views,Impressions\n2025-01-01,Test Entry,100,1000`;
    const result = parseCSV(csv);
    
    expect(result).toHaveLength(1);
    expect(result[0].date).toBe('2025-01-01');
    expect(result[0].views).toBe('100');
  });

  it('should handle trailing empty lines', () => {
    const csv = `Date,Description\n2025-01-01,Entry\n\n`;
    const result = parseCSV(csv);
    expect(result).toHaveLength(1);
  });

  it('should return empty array for empty input', () => {
    expect(parseCSV('')).toHaveLength(0);
    expect(parseCSV('HeaderOnly')).toHaveLength(0);
  });
});