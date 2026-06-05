#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'node:fs'

const path = new URL('../index.html', import.meta.url)
let html = readFileSync(path, 'utf8')

const replacements = [
  [
    '<input class="inp" type="text" placeholder="Rudrakumar Patel" />',
    '<input id="signup-name" class="inp" type="text" placeholder="Rudrakumar Patel" autocomplete="name" />',
  ],
  [
    '<input class="inp" type="email" placeholder="you@email.com" />',
    '<input id="signup-email" class="inp" type="email" placeholder="you@email.com" autocomplete="email" />',
  ],
  [
    '<input class="inp" type="password" placeholder="At least 8 characters" />',
    '<input id="signup-password" class="inp" type="password" placeholder="At least 8 characters" autocomplete="new-password" />',
  ],
  [
    '<input class="inp" type="tel" placeholder="(519) 555-0123" style="flex: 1" />',
    '<input id="signup-phone" class="inp" type="tel" placeholder="(519) 555-0123" style="flex: 1" autocomplete="tel" />',
  ],
  [
    '<button class="btn" onclick="showOTP()">',
    '<button type="button" class="btn" data-action="signup-submit">',
  ],
  [
    'placeholder="From — city or address"\n                value="London, ON"',
    'id="search-origin" placeholder="From — city or address"\n                value="London, ON"',
  ],
  [
    'placeholder="To — destination"\n              />',
    'id="search-destination" placeholder="To — destination"\n              />',
  ],
  [
    '<label class="inpl">From</label><input class="inp" type="text" value="London, ON" />',
    '<label class="inpl">From</label><input id="post-origin" class="inp" type="text" value="London, ON" />',
  ],
  [
    '<label class="inpl">To</label\n            ><input class="inp" type="text" placeholder="Destination city" />',
    '<label class="inpl">To</label><input id="post-destination" class="inp" type="text" placeholder="Destination city" />',
  ],
  [
    '<label class="inpl">Date</label><input class="inp" type="date" value="2026-03-28" />',
    '<label class="inpl">Date</label><input id="post-date" class="inp" type="date" value="2026-03-28" />',
  ],
  [
    '<label class="inpl">Departure</label><input class="inp" type="time" value="08:00" />',
    '<label class="inpl">Departure</label><input id="post-departure" class="inp" type="time" value="08:00" />',
  ],
]

for (const [from, to] of replacements) {
  if (!html.includes(from) && to.includes('signup-submit')) {
    html = html.replace(
      '<button class="btn" data-action="show-otp">',
      '<button type="button" class="btn" data-action="signup-submit">',
    )
    continue
  }
  html = html.includes(from) ? html.replace(from, to) : html
}

if (!html.includes('id="search-results"')) {
  html = html.replace(
    '<div class="chipgroup" id="search-chips">',
    '<div id="search-results" class="px" style="padding-top:8px"></div>\n        <div style="padding:12px 16px"><button type="button" id="search-submit" class="btn" data-action="search-run">Search rides</button></div>\n        <div class="chipgroup" id="search-chips">',
  )
}

if (!html.includes('id="post-attestation"')) {
  html = html.replace(
    '<div class="px">',
    '<div class="px"><label class="fg" style="display:flex;gap:10px;align-items:flex-start;margin-bottom:12px"><input type="checkbox" id="post-attestation" /><span class="tb2">I am offering a trip I already intend to take. Seat contributions are for cost sharing only, not profit.</span></label>',
    1,
  )
}

if (!html.includes('id="post-seats"')) {
  html = html.replace(
    '<div class="sval">2</div>',
    '<input id="post-seats" class="inp" type="number" value="2" min="1" max="8" style="text-align:center;border:none;background:transparent" />',
  )
}

if (!html.includes('id="post-price"')) {
  html = html.replace(
    'type="number"\n                value="25"\n                min="0"',
    'id="post-price" type="number"\n                value="25"\n                min="0"',
  )
}

if (!html.includes('id="ride-detail-content"')) {
  html = html.replace(
    '<div class="scr" id="s-detail">',
    '<div class="scr" id="s-detail"><div id="ride-detail-content" class="px"></div>',
  )
}

if (!html.includes('data-action="post-submit"')) {
  html = html.replace(
    /(<div class="scr" id="s-post">[\s\S]*?<button class="btn[^"]*" )/,
    '$1data-action="post-submit" ',
  )
}

writeFileSync(path, html)
console.warn('Patched index.html form field ids')
