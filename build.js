const fs = require('fs');
const babel = require('@babel/core');

const html = fs.readFileSync('index.html', 'utf8');

// Extract JSX content from <script type="text/babel">
const match = html.match(/<script[^>]*type="text\/babel"[^>]*>([\s\S]*?)<\/script>\s*<\/body>/);
if (!match) { console.error('Babel script block not found'); process.exit(1); }

const jsxContent = match[1];

// Compile JSX → JS (only transform JSX, keep modern JS as-is for modern browsers)
const compiled = babel.transformSync(jsxContent, {
  presets: [['@babel/preset-react', { runtime: 'classic' }]],
  compact: false,
});

if (!fs.existsSync('dist')) fs.mkdirSync('dist');

fs.writeFileSync('dist/app.js', compiled.code);

// Build dist/index.html:
// 1. Remove babel standalone CDN script
// 2. Replace <script type="text/babel">...</script> with <script src="app.js"></script>
const newHtml = html
  .replace(/<script[^>]*babel\.min\.js[^>]*><\/script>\n?/, '')
  .replace(/<script[^>]*type="text\/babel"[^>]*>[\s\S]*?<\/script>(\s*<\/body>)/, '<script src="app.js"></script>$1');

fs.writeFileSync('dist/index.html', newHtml);

console.log('Build complete → dist/index.html + dist/app.js');
