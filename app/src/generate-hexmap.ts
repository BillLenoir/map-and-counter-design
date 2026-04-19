import { HEX_NUMBER_OFFSET, HEX_NUMBER_Y_OFFSET } from './utils/constants';

interface HexMapOptions {
  cols: number;
  rows: number;
  dpi: number;
  hexSize: number;
  hexColor: string;
}
export class HexMap {
  private cols: number;
  private rows: number;
  private dpi: number;
  private hexSize: number;
  private hexColor: string;
  private hexWidth: number;
  private hexRadius: number;
  private hexHeight: number;
  private uniqueHexSideTracker = new Set<string>();
  private hexSides: [number, number, number, number][] = [];
  private hexNumbering: [number, number, string][] = [];

  constructor(hexMapOptions: HexMapOptions) {
    this.cols = hexMapOptions.cols;
    this.rows = hexMapOptions.rows;
    this.dpi = hexMapOptions.dpi;
    this.hexSize = hexMapOptions.hexSize;
    this.hexColor = hexMapOptions.hexColor;
    this.hexWidth = this.hexSize * this.dpi; // 1 inch point-to-point
    this.hexRadius = this.hexWidth / 2;
    this.hexHeight = Math.sqrt(3) * this.hexRadius;
  }

  generateHexMapSvg(): string {
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"\n  id="hexMap">';

    svg += this.buildHexLayer();

    svg += this.buildHexSideLayer();

    svg += this.buildHexNumberLayer();

    svg += '</svg>\n';

    return svg;
  }

  private buildHexLayer() {
    let hexLayerSvg = '  <g inkscape:groupmode="layer" inkscape:label="Hexes" id="hexLayer">\n';
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        hexLayerSvg += this.buildHex({ col, row });
      }
    }
    hexLayerSvg += '  </g>\n';
    return hexLayerSvg;
  }

  private buildHex({ row, col }: { row: number; col: number }) {
    const { x: hexCenterX, y: hexCenterY } = this.calculateHexCenter({ row, col });
    const corners = this.calculateHexCorners({ hexCenterX, hexCenterY });
    const paddedRowNumber = (row + 1).toString().padStart(2, '0');
    const paddedColNumber = (col + 1).toString().padStart(2, '0');
    const hexId = `hex_${paddedRowNumber}_${paddedColNumber}`;
    const pathData = corners.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`,
    ).join(' ') + ' Z';

    const hexSvg = `    <path id="${hexId}" d="${pathData}" fill="${this.hexColor}" stroke="none" />\n`;

    for (let i = 0; i < 6; i++) {
      this.buildHexCorners(corners, i);
    }

    const printableHexNumber = `${paddedColNumber}${paddedRowNumber}`;
    this.hexNumbering.push([hexCenterX, hexCenterY + HEX_NUMBER_Y_OFFSET, printableHexNumber]);

    return hexSvg;
  }

  private calculateHexCenter({ row, col }: { row: number; col: number }): { x: number; y: number } {
    const x = col * this.hexWidth * 0.75 + this.hexRadius;
    const y = row * this.hexHeight + (col % 2 === 1 ? this.hexHeight / 2 : 0);
    return { x, y };
  }

  private calculateHexCorners({ hexCenterX, hexCenterY }: { hexCenterX: number; hexCenterY: number }): [number, number][] {
    const corners: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i;
      const angleRad = (Math.PI / 180) * angleDeg;
      const x = hexCenterX + this.hexRadius * Math.cos(angleRad);
      const y = hexCenterY + this.hexRadius * Math.sin(angleRad);
      corners.push([x, y]);
    }
    return corners;
  }

  private buildHexCorners(corners: [number, number][], i: number) {
    const [x1, y1] = corners[i];
    const [x2, y2] = corners[(i + 1) % 6];
    this.addHexSideOnlyIfUnique([x1, y1, x2, y2]);
  }

  private addHexSideOnlyIfUnique(hexSide: [number, number, number, number]) {
    const key = this.normalizeHexSide(hexSide);
    if (!this.uniqueHexSideTracker.has(key)) {
      this.uniqueHexSideTracker.add(key);
      this.hexSides.push(hexSide);
    }
  }

  private normalizeHexSide(line: [number, number, number, number]): string {
    const [x1, y1, x2, y2] = line;
    if (x1 < x2 || (x1 === x2 && y1 <= y2)) {
      return `${x1},${y1},${x2},${y2}`;
    } else {
      return `${x2},${y2},${x1},${y1}`;
    }
  }

  private buildHexSideLayer() {
    let hexSideLayerSvg = '  <g inkscape:groupmode="layer" inkscape:label="Hex sides" id="hexSideLayer">\n';
    this.hexSides.forEach(([x1, y1, x2, y2]) => {
      hexSideLayerSvg += `    <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#999" stroke-width="0.5"/>\n`;
    });
    hexSideLayerSvg += '  </g>\n';
    return hexSideLayerSvg;
  }

  private buildHexNumberLayer() {
    let hexNumberSvg = '  <g inkscape:groupmode="layer" inkscape:label="Hex Numbers" id="hexNumberLayer">\n';
    this.hexNumbering.forEach(([x, y, hexNumber]) => {
      const adjustedYCoordinate = y - this.hexRadius + HEX_NUMBER_OFFSET;
      hexNumberSvg += `    <text x="${x}" y="${adjustedYCoordinate}" style="text-align:center;text-anchor:middle;font-size:7.5pt" id="hex-number-${hexNumber}">${hexNumber}</text>\n`;
    });
    hexNumberSvg += '  </g>\n';
    return hexNumberSvg;
  }

}
