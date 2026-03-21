const fs = require('fs');
const h = fs.readFileSync('index.html', 'utf8');
console.log('phone wrapper:',  h.includes('<div class="phone">'));
console.log('di present:',     h.includes('<div class="di">'));
console.log('desktnav:',       h.includes('class="desktnav"'));
console.log('dn-links:',       h.includes('dn-links'));
console.log('end phone gone:', !h.includes('end phone'));
console.log('\nFirst 900 chars of body:\n', h.substring(h.indexOf('<body>'), h.indexOf('<body>') + 900));
