const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Find "phone" div location
const phoneIdx = html.indexOf('<div class="phone">');
console.log('phone div at index:', phoneIdx);
console.log('chars around it:', JSON.stringify(html.substring(phoneIdx - 5, phoneIdx + 50)));

const diIdx = html.indexOf('<div class="di">');
console.log('di div at index:', diIdx);
console.log('chars around di:', JSON.stringify(html.substring(diIdx - 5, diIdx + 40)));

// What's between phone and di?
console.log('between phone and di:', JSON.stringify(html.substring(phoneIdx + 19, diIdx + 16 + 10)));
