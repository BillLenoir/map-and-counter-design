import { HexMap } from '../src/generate-hexmap';

describe('HexMap', () => {
  describe('generateHexMapSvg', () => {
    it('generates one hex path per cell', () => {
      const svg = new HexMap({ cols: 3, rows: 4, dpi: 96, hexSize: 1, hexColor: 'white' }).generateHexMapSvg();
      expect((svg.match(/<path /g) ?? []).length).toBe(12);
    });
  });
});