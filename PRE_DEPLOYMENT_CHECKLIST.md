# 🚀 Pre-Deployment Checklist

## ✅ Pre-Build Checks

### 1. Code Quality
- [x] No linter errors (`npm run lint`)
- [x] All imports resolved
- [x] No console errors in browser
- [x] TypeScript/JSX errors resolved

### 2. Environment Variables
Ensure these are set in your production environment:

```bash
NEXT_PUBLIC_HOST=https://fixtools.io
NEXT_PUBLIC_API_URL=https://salty-fjord-37519.herokuapp.com/api
```

### 3. Dependencies
- [x] All dependencies installed (`npm install`)
- [x] No missing packages
- [x] Package versions are stable

---

## 🔨 Build Process

### Step 1: Run Linting
```bash
npm run lint
```

If there are errors, fix them:
```bash
npm run lint:fix
```

### Step 2: Test Build Locally
```bash
# Build for production
npm run build

# Test production build locally
npm start
```

**Expected Output:**
- ✅ Build completes without errors
- ✅ No warnings about missing dependencies
- ✅ Production server starts on port 3000
- ✅ All pages load correctly

### Step 3: Verify Build Output
Check that `.next` folder contains:
- ✅ `static/` folder with assets
- ✅ `server/` folder with server-side code
- ✅ No build errors in terminal

---

## 🌐 Production Deployment

### Option 1: Vercel (Recommended for Next.js)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel --prod
   ```

3. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project Settings → Environment Variables
   - Add:
     - `NEXT_PUBLIC_HOST` = `https://fixtools.io`
     - `NEXT_PUBLIC_API_URL` = `https://salty-fjord-37519.herokuapp.com/api`

### Option 2: Netlify

1. **Install Netlify CLI:**
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

3. **Set Environment Variables in Netlify Dashboard**

### Option 3: Custom Server (Node.js)

1. **Build:**
   ```bash
   npm run build
   ```

2. **Start Production Server:**
   ```bash
   npm start
   ```

3. **Use PM2 for Process Management:**
   ```bash
   npm install -g pm2
   pm2 start npm --name "fixtools" -- start
   ```

---

## ✅ Post-Deployment Verification

### 1. Check Homepage
- [ ] Homepage loads correctly
- [ ] All 4 main sections visible (Tools, Learn, Back to School, Games)
- [ ] Navigation works
- [ ] Search functionality works

### 2. Check Tool Pages
- [ ] JSON tools load
- [ ] HTML tools load
- [ ] CSS tools load
- [ ] Image tools load
- [ ] SEO tools load
- [ ] Text tools load
- [ ] Utility tools load

### 3. Check SEO
- [ ] Meta tags present (view page source)
- [ ] Structured data present (use Google Rich Results Test)
- [ ] Canonical URLs correct
- [ ] Open Graph tags work (test with Facebook Debugger)

### 4. Performance
- [ ] Page load time < 3 seconds
- [ ] Images load correctly
- [ ] No console errors
- [ ] Mobile responsive

### 5. Security
- [ ] HTTPS enabled
- [ ] Security headers present (check with securityheaders.com)
- [ ] No exposed API keys

---

## 🐛 Common Build Issues & Fixes

### Issue: Build fails with "Module not found"
**Fix:**
```bash
rm -rf node_modules package-lock.json .next
npm install
npm run build
```

### Issue: Environment variables not working
**Fix:**
- Ensure variables start with `NEXT_PUBLIC_` for client-side
- Restart dev server after adding variables
- Check `.env.local` file exists

### Issue: Image optimization errors
**Fix:**
- Check `next.config.js` has correct image domains
- Ensure images are in `/public` folder
- Use Next.js `Image` component, not `<img>` tags

### Issue: Styled Components errors
**Fix:**
- Verify `next.config.js` has `compiler.styledComponents: true`
- Clear `.next` cache and rebuild

---

## 📊 Production Checklist Summary

- [ ] Code linted and formatted
- [ ] Build completes successfully
- [ ] Production server runs locally
- [ ] Environment variables configured
- [ ] All pages tested
- [ ] SEO verified
- [ ] Performance checked
- [ ] Security headers verified
- [ ] Deployed to production
- [ ] Post-deployment tests passed

---

## 🎯 Next Steps After Deployment

1. **Submit Sitemap to Google Search Console:**
   - URL: `https://fixtools.io/sitemap.xml`

2. **Monitor Performance:**
   - Set up Google Analytics
   - Monitor error logs
   - Track page load times

3. **SEO Monitoring:**
   - Submit to Google Search Console
   - Monitor search rankings
   - Check structured data with Rich Results Test

4. **Regular Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular backups

---

**Ready to deploy?** Run `npm run build` first to verify everything works! 🚀


