import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { deployment } from './deployment.mjs';
import { existsSync, readFileSync } from 'node:fs';
const legacyFile = new URL('./legacy-redirects.json', import.meta.url);
const legacyRedirects = existsSync(legacyFile) ? JSON.parse(readFileSync(legacyFile, 'utf8')) : {};

export default defineConfig({
  // Keep real and regression content stores isolated when dependencies are shared.
  cacheDir: './.astro/cache/',
  ...deployment(),
  redirects: legacyRedirects,
  trailingSlash: 'always',
  output: 'static',
  devToolbar: { enabled: false },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [[rehypeKatex, { strict: 'warn', throwOnError: true }]],
    }),
    shikiConfig: { theme: 'vesper', langAlias: { sage: 'python', sagemath: 'python', plaintext: 'text', output: 'text', log: 'text', shell: 'bash', Solidity: 'solidity' }, wrap: false },
  },
});
