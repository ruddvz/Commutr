const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');

const checks = {
  'No inline <style>': !html.includes('<style>'),
  'No inline <script>': !(html.includes('<script>') && !html.includes('<script src')),
  'Google Fonts Outfit': html.includes('Outfit'),
  'Google Fonts DM Mono': html.includes('DM+Mono'),
  'Links to style.css': html.includes('href="style.css"'),
  'Links to app.js': html.includes('src="app.js"'),
  'No history.go SPA bug': !html.includes('history.go'),
};

let pass = true;
for (const [name, result] of Object.entries(checks)) {
  const icon = result ? 'PASS' : 'FAIL';
  if (!result) pass = false;
  console.log(icon + '  ' + name);
}
console.log(pass ? '\nAll checks passed!' : '\nSome checks FAILED');
