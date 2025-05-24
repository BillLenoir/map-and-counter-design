import * as fs from 'fs';
import * as path from 'path';

export function saveToFile(svgContent: string, filename: string = 'hex_map.svg') {
  // Saving it to a directory relative to where the script is run,
  //   which should always be the project root.
  const outputDir = path.resolve(process.cwd(), './app/output-files');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputPath = path.join(outputDir, filename);
  try {
    fs.writeFileSync(outputPath, svgContent, 'utf-8');
  } catch (error) {
    throw new Error(`Problem writing SVG file: ${error}`);
  }
  console.log(`✅ SVG saved to ${outputDir}`);
}
