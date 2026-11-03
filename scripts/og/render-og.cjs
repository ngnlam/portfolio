// Renders Open Graph images (1200 x 630) with Playwright from scripts/og/template.html.
// Not part of the Netlify build: run locally and commit the PNGs in public/og/.
//
//   node scripts/og/render-og.cjs                      -> public/og/default.png
//   node scripts/og/render-og.cjs --slug zalo-showroom --title "..." --label "Case study, VinFast, 2026"
//
// Also renders favicon.ico and apple-touch-icon.png from public/favicon.svg when run with --icons.
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const args = process.argv.slice(2);
const arg = (k, d) => {
  const i = args.indexOf(`--${k}`);
  return i >= 0 ? args[i + 1] : d;
};
const fontDir = (pkg) => path.join(root, 'node_modules', pkg, 'files');
const fontFace = (family, pkg, file) =>
  `@font-face{font-family:'${family}';src:url('file://${path.join(fontDir(pkg), file)}') format('woff2');font-weight:100 900;}`;

(async () => {
  const browser = await chromium.launch();
  if (args.includes('--icons')) {
    const svg = fs.readFileSync(path.join(root, 'public', 'favicon.svg'), 'utf8');
    const page = await browser.newPage({ viewport: { width: 180, height: 180 } });
    await page.setContent(`<html><body style="margin:0;background:#FFF8EC">${svg.replace('<svg ', '<svg width="180" height="180" ')}</body></html>`);
    await page.screenshot({ path: path.join(root, 'public', 'apple-touch-icon.png') });
    const p32 = await browser.newPage({ viewport: { width: 32, height: 32 } });
    await p32.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', '<svg width="32" height="32" ')}</body></html>`);
    await p32.screenshot({ path: path.join(root, 'scripts', 'og', 'favicon-32.png'), omitBackground: true });
    await browser.close();
    console.log('icons rendered; convert scripts/og/favicon-32.png to public/favicon.ico');
    return;
  }
  const slug = arg('slug', 'default');
  const title = arg('title', '');
  const label = arg('label', '');
  let html = fs.readFileSync(path.join(__dirname, 'template.html'), 'utf8');
  const fonts =
    fontFace('Bricolage', '@fontsource-variable/bricolage-grotesque', 'bricolage-grotesque-latin-wght-normal.woff2') +
    fontFace('Inter', '@fontsource-variable/inter', 'inter-latin-wght-normal.woff2') +
    fontFace('Mono', '@fontsource-variable/jetbrains-mono', 'jetbrains-mono-latin-wght-normal.woff2');
  const portrait = 'file://' + path.join(root, 'src', 'assets', 'images', 'brand', 'portrait.jpg');
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
  html = html
    .replace('/*FONTS*/', fonts)
    .replace('{{PORTRAIT}}', portrait)
    .replace('{{MODE}}', title ? 'case' : 'home')
    .replace('{{TITLE}}', esc(title))
    .replace('{{LABEL}}', esc(label));
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  // Load from a file:// URL so the local fonts and portrait are allowed to load.
  const tmp = path.join(__dirname, '.render.html');
  fs.writeFileSync(tmp, html);
  await page.goto('file://' + tmp, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const out = path.join(root, 'public', 'og', `${slug}.png`);
  await page.screenshot({ path: out });
  fs.unlinkSync(tmp);
  await browser.close();
  console.log('wrote', path.relative(root, out));
})();
