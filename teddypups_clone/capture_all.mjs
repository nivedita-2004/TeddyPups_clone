import { preview } from 'vite';
import { execFile } from 'child_process';
import path from 'path';

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = 'C:\\Users\\Abhinav Singh\\.gemini\\antigravity\\brain\\4db66ed0-3264-4115-b635-028ff2a6dfac';

const targets = [
  // Desktop 1440x900
  { url: 'http://127.0.0.1:4173/', size: '1440,900', name: 'preview_home_desktop.png' },
  { url: 'http://127.0.0.1:4173/puppies', size: '1440,900', name: 'preview_puppies_desktop.png' },
  { url: 'http://127.0.0.1:4173/happy-families', size: '1440,900', name: 'preview_families_desktop.png' },
  { url: 'http://127.0.0.1:4173/how-it-works', size: '1440,900', name: 'preview_how_desktop.png' },
  { url: 'http://127.0.0.1:4173/faq', size: '1440,900', name: 'preview_faq_desktop.png' },
  { url: 'http://127.0.0.1:4173/contact', size: '1440,900', name: 'preview_contact_desktop.png' },
  { url: 'http://127.0.0.1:4173/gone-home', size: '1440,900', name: 'preview_gone_desktop.png' },

  // Mobile 390x844
  { url: 'http://127.0.0.1:4173/', size: '390,844', name: 'preview_home_mobile.png' },
  { url: 'http://127.0.0.1:4173/puppies', size: '390,844', name: 'preview_puppies_mobile.png' },
  { url: 'http://127.0.0.1:4173/happy-families', size: '390,844', name: 'preview_families_mobile.png' },
  { url: 'http://127.0.0.1:4173/faq', size: '390,844', name: 'preview_faq_mobile.png' },
  { url: 'http://127.0.0.1:4173/contact', size: '390,844', name: 'preview_contact_mobile.png' },
  { url: 'http://127.0.0.1:4173/gone-home', size: '390,844', name: 'preview_gone_mobile.png' }
];

async function capture(url, size, outFile) {
  return new Promise((resolve) => {
    const [w, h] = size.split(',');
    const args = [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      `--window-size=${w},${h}`,
      '--hide-scrollbars',
      '--virtual-time-budget=3000',
      `--screenshot=${outFile}`,
      url
    ];
    execFile(chromePath, args, (err) => {
      if (err) console.error(`Error capturing ${url}:`, err.message);
      else console.log(`Captured ${path.basename(outFile)} (${size})`);
      resolve();
    });
  });
}

async function run() {
  console.log('Starting preview server on port 4173...');
  const server = await preview({
    preview: { host: '127.0.0.1', port: 4173 }
  });

  for (const t of targets) {
    const outFile = path.join(outDir, t.name);
    await capture(t.url, t.size, outFile);
  }

  await server.close();
  console.log('All screenshots captured successfully.');
}

run();

