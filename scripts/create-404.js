import { copyFileSync, existsSync } from 'node:fs';
const src = 'dist/index.html';
const dest = 'dist/404.html';
if (existsSync(src)) {
  copyFileSync(src, dest);
  console.log('404.html created.');
} else {
  console.error('index.html not found, skip 404 copy.');
  process.exit(1);
}