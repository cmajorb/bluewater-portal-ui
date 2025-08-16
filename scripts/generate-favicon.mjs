import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import toIco from 'to-ico';
import { Resvg } from '@resvg/resvg-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgPath = resolve(root, 'public', 'bluewater-logo.svg');
const outPath = resolve(root, 'public', 'favicon.ico');

const svg = readFileSync(svgPath, 'utf8');

const sizes = [16, 32, 48, 64];
const pngBuffers = sizes.map((size) => {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size },
    background: 'transparent',
  });
  const png = resvg.render();
  return png.asPng();
});

const ico = await toIco(pngBuffers);
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, ico);
console.log(`Generated favicon.ico with sizes: ${sizes.join(', ')}`);

