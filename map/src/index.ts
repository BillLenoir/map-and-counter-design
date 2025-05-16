const dpi = 96;
const flatSpacingIn = 1;
const hexWidth = flatSpacingIn * dpi;
const hexHeight = Math.sqrt(3) / 2 * hexWidth;

const cols = 25;
const rows = 28;

function hexCenter(col: number, row: number): { x: number, y: number } {
  const x = col * (hexWidth * 0.75) + hexWidth / 2;
  const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);
  return { x, y };
}

function hexCorners(cx: number, cy: number): [number, number][] {
  const corners: [number, number][] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    const x = cx + (hexWidth / 2) * Math.cos(angle);
    const y = cy + (hexWidth / 2) * Math.sin(angle);
    corners.push([x, y]);
  }
  return corners;
}

function generateHexGridSVG(): string {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1">\n`;
  svg += `  <g inkscape:groupmode="layer" inkscape:label="Hexes">\n`;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const { x: cx, y: cy } = hexCenter(col, row);
      const corners = hexCorners(cx, cy);
      const hexId = `hex_${(row + 1).toString().padStart(2, '0')}_${(col + 1).toString().padStart(2, '0')}`;
      const pathData = corners.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + ' Z';

      svg += `    <path id="${hexId}" d="${pathData}" fill="white" stroke="none" />\n`;
    }
  }

  svg += `  </g>\n</svg>\n`;
  return svg;
}

// Example usage: output to console or inject into DOM
const svgContent = generateHexGridSVG();
console.log(svgContent);

// You can also inject it into a web page:
// document.body.innerHTML = svgContent;
