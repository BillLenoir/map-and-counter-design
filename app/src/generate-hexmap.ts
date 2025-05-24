interface HexMapOptions {
  cols: number;
  rows: number;
  dpi: number;
  hexSize: number;
  hexColor: string;
}
export class HexMap {
  cols: number;
  rows: number;
  dpi: number;
  hexSize: number;
  hexColor: string;
  hexWidth: number;
  hexRadius: number;
  hexHeight: number;
  hexSides: [number, number, number, number][] = [];
  hexNumbering: [number, number, string][] = [];

  constructor(hexMapOptions: HexMapOptions) {
    this.cols = hexMapOptions.cols;
    this.rows = hexMapOptions.rows;
    this.dpi = hexMapOptions.dpi;
    this.hexSize = hexMapOptions.hexSize;
    this.hexColor = hexMapOptions.hexColor;
    this.hexWidth = this.hexSize * this.dpi; // 1 inch point-to-point
    this.hexRadius = this.hexWidth / 2;
    this.hexHeight = Math.sqrt(3) * this.hexRadius; // flat-to-flat vertical height
    this.hexSides = [];
    this.hexNumbering = [];
  }

  generateHexMapSvg(): string {
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape">\n  id="hexMap"';

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
        hexLayerSvg += this.buildHex(col, row);
      }
    }
    hexLayerSvg += '  </g>\n';
    return hexLayerSvg;
  }

  private buildHex(col: number, row: number) {
    const { x: hexCenterX, y: hexCenterY } = this.calculateHexCenter(col, row);
    const corners = this.calculateHexCorners(hexCenterX, hexCenterY);
    const paddedRowNumber = (row + 1).toString().padStart(2, '0');
    const paddedColNumber = (col + 1).toString().padStart(2, '0');
    const hexId = `hex_${paddedRowNumber}_${paddedColNumber}`;
    const pathData = corners.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`,
    ).join(' ') + ' Z';

    const hexSvg = `    <path id="${hexId}" d="${pathData}" fill="${this.hexColor}" stroke="none" />\n`;

    for (let i = 0; i < 6; i++) {
      this.buildHexCorners(corners, i);
    }

    const printableHexNumber = `${paddedRowNumber}${paddedColNumber}`;
    this.hexNumbering.push([hexCenterX, hexCenterY + 5, printableHexNumber]);

    return hexSvg;
  }

  private buildHexCorners(corners: [number, number][], i: number) {
    const [x1, y1] = corners[i];
    const [x2, y2] = corners[(i + 1) % 6];
    this.hexSides.push([x1, y1, x2, y2]);
  }

  private calculateHexCenter(col: number, row: number): { x: number; y: number } {
    const x = col * this.hexWidth * 0.75 + this.hexRadius;
    const y = row * this.hexHeight + (col % 2 === 1 ? this.hexHeight / 2 : 0);
    return { x, y };
  }

  private calculateHexCorners(cx: number, cy: number): [number, number][] {
    const corners: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i;
      const angleRad = (Math.PI / 180) * angleDeg;
      const x = cx + this.hexRadius * Math.cos(angleRad);
      const y = cy + this.hexRadius * Math.sin(angleRad);
      corners.push([x, y]);
    }
    return corners;
  }

  private buildHexSideLayer() {
    let hexSideLayerSvg = '  <g inkscape:groupmode="layer" inkscape:label="Hex sides" id="hexSideLayer">\n';
    this.hexSides.forEach(([x1, y1, x2, y2]) => {
      hexSideLayerSvg += `    <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#ccc" stroke-width="0.5"/>\n`;
    });
    hexSideLayerSvg += '  </g>\n';
    return hexSideLayerSvg;
  }

  private buildHexNumberLayer() {
    let hexNumberSvg = '  <g inkscape:groupmode="layer" inkscape:label="Hex Numbers" id="hexNumberLayer">\n';
    this.hexNumbering.forEach(([x, y, hexNumber]) => {
      const adjustedYCoordinate = y - this.hexRadius + 12;
      hexNumberSvg += `    <text x="${x}" y="${adjustedYCoordinate}" style="text-align:center;text-anchor:middle;font-size:7.5pt" id="hex-number-${hexNumber}">${hexNumber}</text>\n`;
    });
    hexNumberSvg += '  </g>\n';
    return hexNumberSvg;
  }

}
