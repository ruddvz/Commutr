// Generates PWA icons using HTML Canvas via Node.js + canvas package,
// or creates simple SVG-based PNGs as fallback using pure Buffer writes.
// Uses the built-in approach: write an SVG, then note that browsers/GH Pages
// serve SVG icons fine when referenced as PNG-fallback in manifest.
// Actually we'll create minimal valid PNG files using a pure JS approach.

const fs = require('fs');
const path = require('path');

// Minimal 1x1 transparent PNG base (we'll make proper colored ones)
// We create a Node.js Canvas-free PNG by using a very small helper.
// Since we don't have canvas, let's generate SVG icons instead and
// also create a simple PNG using raw bytes for the required sizes.

// SVG template for COMMUTR icon
function makeSVG(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a7f45"/>
      <stop offset="100%" stop-color="#30C263"/>
    </linearGradient>
    <linearGradient id="stripe" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#30C263"/>
      <stop offset="100%" stop-color="#E56E1E"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${size}" height="${size}" rx="${size * 0.22}" fill="#050807"/>
  <!-- Green glow bg -->
  <circle cx="${size*0.18}" cy="${size*0.22}" r="${size*0.35}" fill="rgba(48,194,99,0.14)"/>
  <!-- C letter mark -->
  <text x="${size*0.5}" y="${size*0.62}" 
        font-family="'Outfit',system-ui,sans-serif" 
        font-weight="900" 
        font-size="${size*0.5}" 
        fill="url(#stripe)" 
        text-anchor="middle" 
        letter-spacing="-0.04em">C</text>
  <!-- Accent dot -->
  <circle cx="${size*0.73}" cy="${size*0.34}" r="${size*0.06}" fill="#46d47a"/>
</svg>`;
}

// Write SVG files (used as icons in some browsers)
fs.writeFileSync(path.join('icons','icon-192.svg'), makeSVG(192));
fs.writeFileSync(path.join('icons','icon-512.svg'), makeSVG(512));

// Also create an apple-touch-icon SVG
fs.writeFileSync(path.join('icons','apple-touch-icon.svg'), makeSVG(180));

// Update manifest.json to point to SVG icons (modern browsers support SVG icons in manifests)
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
manifest.icons = [
  { src: 'icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml', purpose: 'any maskable' },
  { src: 'icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'any maskable' }
];
// Remove screenshots (we don't have them yet)
delete manifest.screenshots;
fs.writeFileSync('manifest.json', JSON.stringify(manifest, null, 2));

console.log('Icons created: icons/icon-192.svg, icons/icon-512.svg, icons/apple-touch-icon.svg');
console.log('manifest.json updated to reference SVG icons');
