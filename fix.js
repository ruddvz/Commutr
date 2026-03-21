const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Replace inline <style>...</style> with font imports + external stylesheet
const styleStart = html.indexOf('<style>');
const styleEnd = html.indexOf('</style>') + '</style>'.length;

const fontUrl = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=DM+Mono:ital,wght@0,400;0,500&display=swap';
const newHead = [
  '<link rel="preconnect" href="https://fonts.googleapis.com">',
  '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
  '<link href="' + fontUrl + '" rel="stylesheet">',
  '<link rel="stylesheet" href="style.css">'
].join('\n');

html = html.substring(0, styleStart) + newHead + html.substring(styleEnd);

// 2. Replace inline <script>...</script> with external script reference
const scriptStart = html.lastIndexOf('<script>');
const scriptEnd = html.lastIndexOf('</script>') + '</script>'.length;
html = html.substring(0, scriptStart) + '<script src="app.js"></script>' + html.substring(scriptEnd);

// 3. Fix notifications back button (history.go breaks SPA navigation)
html = html.replace("onclick=\"history.go(-1)||go('home')\"", "onclick=\"go('home')\"");

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed successfully.');
console.log('  Style block removed: chars', styleStart, '-', styleEnd);
console.log('  Script block replaced at char', scriptStart);
