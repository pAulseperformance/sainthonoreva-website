#!/usr/bin/env node

/**
 * build.js — Reads content/*.json and renders public/index.html from a template.
 * 
 * Usage: node build.js
 * 
 * This is the core of the Decap CMS pipeline:
 *   1. CMS edits → commits JSON to GitHub
 *   2. GitHub Action runs build.js → regenerates index.html
 *   3. wrangler deploy → pushes to Cloudflare
 */

const fs = require('fs');
const path = require('path');

// Read all content files
const contentDir = path.join(__dirname, 'content');
const site = JSON.parse(fs.readFileSync(path.join(contentDir, 'site.json'), 'utf8'));
const story = JSON.parse(fs.readFileSync(path.join(contentDir, 'story.json'), 'utf8'));
const menu = JSON.parse(fs.readFileSync(path.join(contentDir, 'menu.json'), 'utf8'));
const gallery = JSON.parse(fs.readFileSync(path.join(contentDir, 'gallery.json'), 'utf8'));

// Generate menu items HTML
const menuItemsHtml = menu.items.map(item => `
                <!-- Item -->
                <div class="flex justify-between items-baseline group" role="listitem">
                    <div class="flex-1 border-b border-outline/30 border-dotted mr-4 pb-1">
                        <h3 class="font-headline text-xl text-on-background">${item.name}</h3>
                        <p class="font-body text-sm text-on-surface-variant mt-1">${item.description}</p>
                    </div>
                    <span class="font-headline text-xl text-primary">${item.price}</span>
                </div>`).join('');

// Generate story paragraphs HTML
const storyParagraphsHtml = story.paragraphs.map((p, i) => 
  `            <p class="font-body text-on-surface-variant leading-relaxed opacity-90${i < story.paragraphs.length - 1 ? ' mb-6' : ''}">\n                ${p}\n            </p>`
).join('\n');

// Generate gallery items HTML
const galleryItemsHtml = gallery.items.map((item, i) => `
            <figure class="aspect-square bg-surface-container-high rounded-xl overflow-hidden relative group${i === 0 ? ' hidden lg:block' : ''}">
                <img alt="Menu Item: ${item.alt}" class="w-full h-full object-cover hover:scale-105 transition-transform duration-700" src="${item.image}" />
                <figcaption class="absolute bottom-4 left-4 right-4 bg-background/90 backdrop-blur-md px-3 py-2 text-xs font-label uppercase tracking-widest rounded text-center opacity-0 group-hover:opacity-100 transition-opacity">${item.caption}</figcaption>
            </figure>`).join('');

// Generate hours HTML
const hoursHtml = site.hours.map(h => 
  `            <span class="text-[#7f766a] dark:text-[#dbdad6] text-sm">${h.days}: ${h.time}</span>`
).join('\n');

// Read template
const template = fs.readFileSync(path.join(__dirname, 'templates', 'index.html.tmpl'), 'utf8');

// Replace placeholders
const html = template
  .replace(/\{\{site\.name\}\}/g, site.name)
  .replace(/\{\{site\.tagline\}\}/g, site.tagline)
  .replace(/\{\{site\.address\}\}/g, site.address)
  .replace(/\{\{site\.email\}\}/g, site.email)
  .replace(/\{\{site\.copyright\}\}/g, site.copyright)
  .replace('{{hours}}', hoursHtml)
  .replace('{{story.heading}}', story.heading)
  .replace('{{story.paragraphs}}', storyParagraphsHtml)
  .replace('{{story.image}}', story.image)
  .replace('{{story.image_alt}}', story.image_alt)
  .replace('{{menu.description}}', menu.description)
  .replace('{{menu.items}}', menuItemsHtml)
  .replace('{{gallery.items}}', galleryItemsHtml);

// Write output
const outputPath = path.join(__dirname, 'public', 'index.html');
fs.writeFileSync(outputPath, html, 'utf8');
console.log(`✅ Built ${outputPath} (${html.length} bytes)`);
