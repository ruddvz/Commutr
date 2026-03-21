const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Update <title> and add theme-color meta
html = html.replace(
  '<title>COMMUTR</title>',
  '<title>COMMUTR — Canada\'s Fee-Free Carpooling</title>\n<meta name="description" content="Find intercity carpooling rides across Canada. Zero booking fees, secure payments, verified drivers.">\n<meta name="theme-color" content="#050807">\n<meta name="color-scheme" content="dark">'
);

// 2. Insert global desktop nav + remove <div class="phone"> and <div class="di"></div>
//    The SVG defs block + phone div + di div need restructuring
const oldStart = `<div class="phone">
<div class="di"></div>`;

const desktopNav = `
<!-- ═══════════════════════════════════ GLOBAL DESKTOP NAV ══════════════════════════════════ -->
<nav class="desktnav" id="desktnav" role="navigation" aria-label="Main navigation">
  <div class="dn-left">
    <span class="wm" onclick="go('home')" style="cursor:pointer;">COMMUTR</span>
  </div>
  <div class="dn-links" id="dnav-links">
    <button class="dnb" data-screen="home"    onclick="go('home')">Home</button>
    <button class="dnb" data-screen="search"  onclick="go('search')">Search</button>
    <button class="dnb" data-screen="post"    onclick="go('post')">Post a Ride</button>
    <button class="dnb" data-screen="inbox"   onclick="go('inbox')">
      Messages
      <span class="dnbadge">3</span>
    </button>
    <button class="dnb" data-screen="profile" onclick="go('profile')">Profile</button>
  </div>
  <div class="dn-right">
    <button class="ib" onclick="go('notifs')" aria-label="Notifications" style="position:relative;">
      <svg width="17" height="17" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      <div class="ubadge" style="top:-2px;right:-2px;width:10px;height:10px;border:2px solid var(--bg);background:var(--r4);"></div>
    </button>
    <div class="av avg" style="width:34px;height:34px;font-size:12px;cursor:pointer;" onclick="go('profile')">RK</div>
  </div>
</nav>`;

html = html.replace(oldStart, desktopNav);

// 3. Remove the closing </div><!-- end phone --> and replace with just a comment
html = html.replace('\n</div><!-- end phone -->\n', '\n<!-- end app -->\n');

fs.writeFileSync('index.html', html, 'utf8');
console.log('HTML structural changes applied.');
