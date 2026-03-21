const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const desktopNav = `\r\n<!-- ═══════════════════════════════════ GLOBAL DESKTOP NAV ══════════════════════════════════ -->\r\n<nav class="desktnav" id="desktnav" role="navigation" aria-label="Main navigation">\r\n  <div class="dn-left">\r\n    <span class="wm" onclick="go('home')" style="cursor:pointer;">COMMUTR</span>\r\n  </div>\r\n  <div class="dn-links" id="dnav-links">\r\n    <button class="dnb" data-screen="home"    onclick="go('home')">Home</button>\r\n    <button class="dnb" data-screen="search"  onclick="go('search')">Search</button>\r\n    <button class="dnb" data-screen="post"    onclick="go('post')">Post a Ride</button>\r\n    <button class="dnb" data-screen="inbox"   onclick="go('inbox')">Messages<span class="dnbadge">3</span></button>\r\n    <button class="dnb" data-screen="profile" onclick="go('profile')">Profile</button>\r\n  </div>\r\n  <div class="dn-right">\r\n    <button class="ib" onclick="go('notifs')" aria-label="Notifications" style="position:relative;">\r\n      <svg width="17" height="17" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>\r\n      <div class="ubadge" style="top:-2px;right:-2px;width:10px;height:10px;border:2px solid var(--bg);background:var(--r4);"></div>\r\n    </button>\r\n    <div class="av avg" style="width:34px;height:34px;font-size:12px;cursor:pointer;" onclick="go('profile')">RK</div>\r\n  </div>\r\n</nav>`;

// 1. Remove <div class="phone">\r\n<div class="di"></div>
const phoneAndDi = '<div class="phone">\r\n<div class="di"></div>';
if (!html.includes(phoneAndDi)) {
  console.error('PHONE+DI string not found!');
  process.exit(1);
}
html = html.replace(phoneAndDi, desktopNav.trimStart());

// 2. Remove </div><!-- end phone -->
const endPhone = '</div><!-- end phone -->';
if (!html.includes(endPhone)) {
  console.error('END PHONE string not found!');
  process.exit(1);
}
html = html.replace(endPhone, '<!-- end app -->');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done!');
console.log('desktnav present after:', html.includes('class="desktnav"'));
console.log('phone div gone:', !html.includes('<div class="phone">'));
console.log('di gone:', !html.includes('<div class="di">'));
console.log('end phone gone:', !html.includes('end phone'));
