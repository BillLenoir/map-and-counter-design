# map-and-counter-design

Generates SVG hex maps and counters for tabletop wargames. Output files are
Inkscape-compatible for further editing.

## Prerequisites

- Node.js 18+
- npm

## Setup

```bash
npm install
```

## Usage

```bash
npm run generate -- --generate map [options]
```

### Options

| Option | Default | Description |
| -- | -- | -- |
| `--cols` | `28` | Number of hexes horizontally |
| `--rows` | `25` | Number of hexes vertically |
| `--hexSize` | `1` | Hex size in inches, flat-to-flat |
| `--hexColor` | `white` | Hex background color |
| `--dpi` | `96` | Dots per inch |

### Example

Generate a 20×16 map with 1.5-inch hexes on a light blue background:

```bash
npm run generate -- --generate map --cols 20 --rows 16 --hexSize 1.5 --hexColor lightblue
```

## Output

The generated SVG is written to `app/output-files/hex_map.svg`. Open it directly
in Inkscape to add terrain, labels, or other layers.

## Planned features

- Counter sheet generation (`--generate counters`)
