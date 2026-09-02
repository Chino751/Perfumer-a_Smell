import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist/assets', { recursive: true });
await cp('assets', 'dist/assets', { recursive: true, force: true });
await cp('data', 'dist/data', { recursive: true, force: true });
