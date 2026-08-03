import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.resolve('public');

const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#9f1239"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>
  <rect width="512" height="512" rx="128" fill="url(#grad)"/>
  <circle cx="256" cy="256" r="170" fill="#be123c" opacity="0.5"/>
  <g filter="url(#shadow)">
    <!-- Stethoscope / Nursing Cross -->
    <path d="M256 120 v272 M120 256 h272" stroke="#ffffff" stroke-width="48" stroke-linecap="round"/>
    <circle cx="256" cy="256" r="32" fill="#fbbf24"/>
  </g>
</svg>
`;

const svgMaskable = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e11d48"/>
      <stop offset="100%" stop-color="#811030"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#grad)"/>
  <g transform="translate(51, 51) scale(0.8)">
    <path d="M256 120 v272 M120 256 h272" stroke="#ffffff" stroke-width="52" stroke-linecap="round"/>
    <circle cx="256" cy="256" r="36" fill="#fbbf24"/>
  </g>
</svg>
`;

async function generate() {
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  // Save SVGs
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgIcon.trim());
  fs.writeFileSync(path.join(publicDir, 'icon-maskable.svg'), svgMaskable.trim());

  // Generate PNGs
  const svgBuffer = Buffer.from(svgIcon);
  const maskableBuffer = Buffer.from(svgMaskable);

  await sharp(svgBuffer).resize(192, 192).toFile(path.join(publicDir, 'icon-192.png'));
  await sharp(svgBuffer).resize(512, 512).toFile(path.join(publicDir, 'icon-512.png'));
  await sharp(svgBuffer).resize(180, 180).toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(maskableBuffer).resize(192, 192).toFile(path.join(publicDir, 'icon-maskable-192.png'));
  await sharp(maskableBuffer).resize(512, 512).toFile(path.join(publicDir, 'icon-maskable-512.png'));

  console.log('PWA Icons generated successfully in /public!');
}

generate().catch(console.error);
