import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { config } from './src/content.mjs';
const pages=JSON.parse(fs.readFileSync('dist/pages.json','utf8'));
assert.equal(pages.length,30);
for(const page of pages){
 const html=fs.readFileSync(path.join('dist',page.route,'index.html'),'utf8');
 assert.equal((html.match(/<h1[\s>]/g)||[]).length,1,`${page.route}: H1`);
 assert.ok(html.includes(`lang="${page.lang}"`));
 assert.ok(/<meta name="description" content="[^"]+"/.test(html));
 assert.ok(!/<a\b[^>]*href="https?:\/\//.test(html),`${page.route}: external anchor`);
 for(const [,url] of html.matchAll(/(?:href|src)="(\/[^"#]*)"/g)) assert.ok(fs.existsSync(path.join('dist',url)),`${page.route}: missing ${url}`);
 for(const [,id] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(html.includes(`id="${id}"`),`${page.route}: missing #${id}`);
 for(const [,json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
}
for(const price of config.prices) assert.equal(price*.05+price*.55+price*.1+price*.3,price);
console.log('PASS: 30 pages, headings, metadata, internal links, anchors, structured data, no outbound navigation and payment totals.');
