const { execSync } = require('child_process');
const { deploy, merchants } = require('./merchants.config');
const fs = require('fs');
const path = require('path');

const merchant = merchants[deploy];

if (!merchant || !merchant.name) {
  console.error(`❌ Merchant "${deploy}" not found in merchants.config.js`);
  process.exit(1);
}

const repoUrl = `git@github.com:landolabrum/${merchant.name}.git`;
const outDir = path.join(__dirname, 'out');

// Clean up old build
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}

// Build
console.log(`📦 Building site for merchant: ${merchant.name}`);
execSync('npm run build', { stdio: 'inherit' });

// Create .nojekyll and CNAME if needed
fs.writeFileSync(path.join(outDir, '.nojekyll'), '');

let deployedLink = `https://landolabrum.github.io/${merchant.name}`;
let echoLine = '';

if (merchant.url) {
  try {
    const hostname = new URL(merchant.url).hostname;
    fs.writeFileSync(path.join(outDir, 'CNAME'), hostname);
    echoLine = `📡 PUBLISHING WITH CNAME: ${hostname}`;
    deployedLink = `https://${hostname}`;
  } catch {
    echoLine = `⚠️ Invalid merchant URL, falling back to GitHub Pages`;
  }
} else {
  echoLine = `📡 PUBLISHING TO DEFAULT GH-PAGES (NO CNAME)`;
}

console.log(echoLine);

// Deploy
execSync(`npx gh-pages -d out --repo ${repoUrl}`, { stdio: 'inherit' });


// Done
console.log(`\n✅ [ ${merchant.name} ] deployed successfully!`);
console.log(`🌐 Visit: \x1b[1;34m${deployedLink}\x1b[0m\n`);
