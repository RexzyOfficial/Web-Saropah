# Kopi Saropah Website

A premium, static website for Kopi Saropah, showcasing a "Pay As You Wish" coffee experience.

## 🌟 Features
- **Premium Design**: Custom dark/gold color scheme, modern typography.
- **Responsive**: Fully optimized for Mobile, Tablet, and Desktop.
- **Interactive**: Scroll animations, mobile menu, gallery lightbox, testimonial carousel.
- **SEO-ready**: sitemap.xml, robots.txt, Open Graph & Twitter meta tags.
- **Security**: Content-Security-Policy applied consistently on every page (via meta tag and Vercel headers).

## 📂 Structure
- `index.html`: Home page
- `about.html`: About / founder story / timeline
- `coffee-basic.html`, `coffee-signature.html`, `milkshake.html`, `tea.html`, `food.html`: Menu pages (rendered dynamically from `assets/data/menu.json` via `assets/js/menu-renderer.js`)
- `visit.html`: Location, hours, gallery, Google Maps embed
- `contact.html`: Contact form (Formspree) + FAQ
- `assets/css/style.css`: Single global stylesheet (also contains the WhatsApp floating widget styles)
- `assets/js/main.js`: Navigation, mobile menu, scroll animations, testimonial carousel, lightbox
- `assets/js/menu-renderer.js`: Renders menu items from JSON per page (based on `data-category` on `<body>`)
- `assets/js/whatsapp-widget.js`: Floating WhatsApp chat button

## 🚀 Deployment
This is a pure static site (HTML/CSS/JS). **No build step, no npm install required** — just deploy the folder as-is.

**To Deploy on Vercel (current setup):**
1. Upload this entire folder to Vercel.
2. `vercel.json` already configures clean URLs (e.g. `/about` → `about.html`), security headers (CSP, X-Frame-Options, etc.), and long-term caching for `/assets/*`.
3. Update the domain in `sitemap.xml`, `robots.txt`, and the Open Graph / Twitter meta tags in every `.html` file once you have a final production domain.

> `netlify.toml` is also included in case you ever migrate to Netlify instead, but it is not used by the current Vercel deployment.

## ⚠️ Before going live — please replace
- **Images**: Hero, menu, gallery, and founder images currently load from **Unsplash** and **Catbox.moe** (a free file-sharing host, not meant for production). Replace all of these with real photos hosted in `assets/images/` so the site doesn't break if those external links ever go down.
- **Testimonials**: The 3 testimonials on the homepage are placeholder text. Swap in real customer reviews.
- **Menu item photos**: `assets/data/menu.json` has no `image` field per item, so every dynamically-rendered menu item currently falls back to the logo. Add an `image` field per item (and matching files in `assets/images/`) for real product photos.
- **Analytics**: `whatsapp-widget.js` calls `gtag(...)` for click tracking, but no Google Analytics/GA4 script is loaded anywhere. Add your GA4 snippet (and update the CSP `connect-src`/`script-src` if needed) if you want this tracking to actually fire.

## 🛠 Customization
- **Colors / spacing / fonts**: Edit the `:root` variables in `assets/css/style.css`.
- **Content**: Edit the `.html` files directly.
- **Menu items & prices**: Edit `assets/data/menu.json` — no HTML changes needed.

---
© 2026 Kopi Saropah
