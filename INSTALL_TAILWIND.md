# Install Tailwind CSS v4 PostCSS Plugin

## Current Status
- **Temporary Solution**: Tailwind CSS CDN is active in `_document.js` (this is render-blocking but works immediately)
- **Proper Solution**: Install `@tailwindcss/postcss` and use PostCSS (better performance, non-blocking)

## Why Switch to PostCSS?

The Tailwind CDN (currently active) is **render-blocking** and adds ~770ms to initial page load. Using PostCSS will:
- Remove render-blocking requests (550ms savings)
- Improve LCP (Largest Contentful Paint)
- Better caching and optimization
- Production-ready setup

## To Switch to Proper Tailwind CSS Setup (Recommended):

### Step 1: Install the PostCSS Plugin
```bash
npm install @tailwindcss/postcss
```

### Step 2: Uncomment the PostCSS Plugin
Edit `postcss.config.js` and uncomment the line:
```js
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},  // Uncomment this line
    autoprefixer: {},
  },
};
```

### Step 3: Uncomment Tailwind Directives
Edit `styles/globals.css` and uncomment the Tailwind directives:
```css
/* Tailwind CSS directives */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Step 4: Remove Tailwind CDN from _document.js
After PostCSS is working, remove the Tailwind CDN script from `pages/_document.js`:
- Remove the `<script src="https://cdn.tailwindcss.com"></script>` line
- Remove the `tailwind.config` script block
- Keep only the preconnect/dns-prefetch hints

### Step 5: Restart Dev Server
```bash
rm -rf .next
npm run dev
```

## Current Setup (Temporary - Works Now)

The Tailwind CDN is currently active in `_document.js`, so your styling works immediately. However, this is render-blocking and should be replaced with the PostCSS setup above for better performance.

## Alternative: Use Tailwind v3 (More Stable)

If you prefer the stable version that works better with Next.js 14:

```bash
npm uninstall tailwindcss @tailwindcss/postcss
npm install -D tailwindcss@^3.4.1 postcss autoprefixer
```

Then update `postcss.config.js`:
```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

And update `tailwind.config.js` to use v3 format (already compatible).

Then uncomment the Tailwind directives in `styles/globals.css` and restart.

