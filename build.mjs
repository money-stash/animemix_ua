import { transform } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ORDER = [
  'scripts/data.js',
  'components/tweaks-panel.jsx',
  'components/components.jsx',
  'components/home.jsx',
  'components/catalog.jsx',
  'components/details.jsx',
  'components/player.jsx',
  'components/profile-auth.jsx',
  'components/app.jsx',
];

const combined = ORDER.map(f => readFileSync(f, 'utf8')).join('\n');

const result = await transform(combined, {
  loader: 'jsx',
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  minify: true,
  target: 'es2020',
});

mkdirSync('dist', { recursive: true });
writeFileSync('dist/bundle.js', result.code);

const size = (result.code.length / 1024).toFixed(1);
console.log(`Built dist/bundle.js — ${size} KB`);
