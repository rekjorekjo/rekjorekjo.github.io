import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { deployment } from './deployment.mjs';
import { existsSync, readFileSync } from 'node:fs';
const legacyFile = new URL('./legacy-redirects.json', import.meta.url);
const legacyRedirects = existsSync(legacyFile) ? JSON.parse(readFileSync(legacyFile, 'utf8')) : {};

export default defineConfig({
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
    shikiConfig: { theme: 'vesper', langAlias: { sage: 'python', sagemath: 'python', Solidity: 'solidity' }, wrap: false },
  },
});
