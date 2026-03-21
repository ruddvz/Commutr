const fs = require('fs');
const text = fs.readFileSync('index.html', 'utf8');

const s1 = text.indexOf('<style>');
const s2 = text.lastIndexOf('</style>');

const j1 = text.indexOf('<script>');
const j2 = text.lastIndexOf('</script>');

if (s1 !== -1 && s2 !== -1 && j1 !== -1 && j2 !== -1) {
  const css = text.substring(s1 + 7, s2).trim();
  const js = text.substring(j1 + 8, j2).trim();

  const newText = text.substring(0, s1) + 
                  '<link rel="stylesheet" href="style.css">\n' + 
                  text.substring(s2 + 8, j1) + 
                  '<script src="app.js"></script>\n' + 
                  text.substring(j2 + 9);

  fs.writeFileSync('style.css', css);
  fs.writeFileSync('app.js', js);
  fs.writeFileSync('index.html', newText);

  console.log('Successfully completed separating index.html into 3 files.');
} else {
  console.log('Could not find all style and script tags.');
}