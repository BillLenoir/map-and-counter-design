import * as fs from 'fs';
import * as path from 'path';

const dpi = 96;
const flatSpacingIn = 1;
const hexWidth = flatSpacingIn * dpi; // 1 inch point-to-point
const hexRadius = hexWidth / 2;
const hexHeight = Math.sqrt(3) * hexRadius; // flat-to-flat vertical height

const cols = 25;
const rows = 28;

function generateHexGridSVG(): string {
  const hexSides: [number, number, number, number][] = [];

  let svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1"\n  xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape">\n';

  // Layer 1: Hexes
  svg += '  <g inkscape:groupmode="layer" inkscape:label="Hexes">\n';
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const { x: cx, y: cy } = hexCenter(col, row);
      const corners = hexCorners(cx, cy);
      const hexId = `hex_${(row + 1).toString().padStart(2, '0')}_${(col + 1).toString().padStart(2, '0')}`;
      const pathData = corners.map(([x, y], i) =>
        `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`,
      ).join(' ') + ' Z';

      svg += `    <path id="${hexId}" d="${pathData}" fill="orange" stroke="none" />\n`;

      for (let i = 0; i < 6; i++) {
        const [x1, y1] = corners[i];
        const [x2, y2] = corners[(i + 1) % 6];
        hexSides.push([x1, y1, x2, y2]);
      }
    }
  }
  svg += '  </g>\n';

  // Layer 2: Hex Sides
  svg += '  <g inkscape:groupmode="layer" inkscape:label="Hex sides">\n';
  hexSides.forEach(([x1, y1, x2, y2]) => {
    svg += `    <line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="#ccc" stroke-width="0.5"/>\n`;
  });
  svg += '  </g>\n</svg>\n';

  return svg;
}

function hexCenter(col: number, row: number): { x: number; y: number } {
  const x = col * hexWidth * 0.75 + hexRadius;
  const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
  return { x, y };
}

function hexCorners(cx: number, cy: number): [number, number][] {
  const corners: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i;
    const angleRad = (Math.PI / 180) * angleDeg;
    const x = cx + hexRadius * Math.cos(angleRad);
    const y = cy + hexRadius * Math.sin(angleRad);
    corners.push([x, y]);
  }
  return corners;
}

function saveSVGToFile(svgContent: string, filename: string = 'hex_map.svg') {
  const outputPath = path.resolve(__dirname, filename);
  try {
    fs.writeFileSync(outputPath, svgContent, 'utf-8');
  } catch (error) {
    throw new Error(`Problem writing SVG file: ${error}`);
  }
  console.log(`✅ SVG saved to ${outputPath}`);
}

// Generate and save
const svg = generateHexGridSVG();
saveSVGToFile(svg);
