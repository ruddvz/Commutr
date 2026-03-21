const fs = require('fs');
const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('style.css','utf8');
const js = fs.readFileSync('app.js','utf8');

const checks = [
  ['desktnav in HTML', html.includes('class="desktnav"')],
  ['phone div gone', !html.includes('<div class="phone">')],
  ['di div gone', !html.includes('<div class="di">')],
  ['end phone gone', !html.includes('end phone')],
  ['link to style.css', html.includes('href="style.css"')],
  ['script src app.js', html.includes('src="app.js"')],
  ['body display:block', css.includes('display: block')],
  ['scr position:fixed', css.includes('position: fixed')],
  ['desktnav CSS', css.includes('.desktnav {')],
  ['desktop media query', css.includes('@media (min-width: 1024px)')],
  ['mobile media query', css.includes('@media (max-width: 767px)')],
  ['card hover lift', css.includes('.rc:hover,')],
  ['scroll morph CSS', css.includes('.desktnav.scrolled')],
  ['dnb button CSS', css.includes('.dnb {')],
  ['dnb.on active', css.includes('.dnb.on {')],
  ['desktop nav JS sync', js.includes('data-screen')],
  ['scroll morph JS', js.includes('bindScrollMorph')],
  ['dnav-links in HTML', html.includes('id="dnav-links"')],
];

let allPass = true;
checks.forEach(function([label, result]) {
  const prefix = result ? 'PASS' : 'FAIL';
  console.log(prefix + '  ' + label);
  if (!result) allPass = false;
});
console.log('');
console.log(allPass ? 'ALL CHECKS PASS' : 'SOME CHECKS FAILED');
