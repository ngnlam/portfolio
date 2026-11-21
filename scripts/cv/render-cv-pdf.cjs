// Prints the /cv page to public/leo-lam-nguyen-cv.pdf with Playwright.
// Not part of the Netlify build: run locally after `npm run build`, then commit the PDF.
//
//   npm run build && node scripts/cv/render-cv-pdf.cjs && npm run build
//
// The second build copies the new PDF into dist/. The script serves dist/ itself, so no preview
// server is needed. Page breaks follow the print rules in src/pages/cv.astro.
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const dist = path.join(root, 'dist');
const out = path.join(root, 'public', 'leo-lam-nguyen-cv.pdf');
const types = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.webp': 'image/webp', '.pdf': 'application/pdf',
};

if (!fs.existsSync(path.join(dist, 'cv.html'))) {
  console.error('dist/cv.html is missing: run `npm run build` first.');
  process.exit(1);
}

// Serves dist/ the way Netlify does: /cv -> cv.html.
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(dist, p);
  if (!path.extname(file)) file += '.html';
  if (!file.startsWith(dist) || !fs.existsSync(file)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

server.listen(0, async () => {
  const { port } = server.address();
  const browser = await chromium.launch().catch(() => chromium.launch({ channel: 'chrome' }));
  try {
    const page = await browser.newPage();
    await page.goto(`http://localhost:${port}/cv`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({
      path: out,
      preferCSSPageSize: true,
      printBackground: true,
      tagged: true,
      displayHeaderFooter: true,
      headerTemplate: '<span></span>',
      // Footer templates cannot load web fonts, so this one uses a system font.
      footerTemplate:
        '<div style="width:100%;padding:0 15mm;font:7pt Helvetica,Arial,sans-serif;color:#5E6168;text-align:right">' +
        'Leo Lam Nguyen | Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    });
    console.log(`Wrote ${path.relative(root, out)}`);
  } finally {
    await browser.close();
    server.close();
  }
});
