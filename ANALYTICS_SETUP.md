# Google Analytics Setup Guide

## ✅ What's Been Configured

1. **Analytics Library Created** (`lib/analytics.js`)
   - Page view tracking
   - Event tracking
   - Tool usage tracking
   - Error tracking
   - Custom events

2. **Integrated in \_app.js**
   - Google Analytics script loaded
   - Auto page view tracking on route changes
   - Proper loading strategy (afterInteractive)

3. **Environment Variable Added**
   - `NEXT_PUBLIC_GA_ID` in `.env.example`
   - Added to `.env.local`

## 🔧 Setup Steps

### 1. Get Your Google Analytics ID

1. Go to https://analytics.google.com/
2. Create account or use existing
3. Create a new GA4 property
4. Get your Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Add to Environment Variables

Edit `.env.local`:

```bash
NEXT_PUBLIC_GA_ID=G-YOUR-ACTUAL-ID
```

### 3. Restart Dev Server

```bash
npm run dev
```

### 4. Verify It's Working

1. Open your site
2. Open Chrome DevTools
3. Go to Network tab
4. Filter by "collect"
5. You should see GA requests

Or use **Google Analytics Debugger** Chrome extension

## 📊 Available Tracking Functions

### Import the library:

```javascript
import * as analytics from '@/lib/analytics';
```

### Track Tool Usage:

```javascript
analytics.trackToolUsage('JSON Formatter', 'JSON Tools');
```

### Track Copy Actions:

```javascript
analytics.trackCopy('JSON Formatter', 'formatted_json');
```

### Track Search:

```javascript
analytics.trackSearch('json formatter', 5);
```

### Track Downloads:

```javascript
analytics.trackDownload('JSON Formatter', 'json');
```

### Track Errors:

```javascript
analytics.trackError('Failed to parse JSON', 'JSON Formatter');
```

### Track Time on Tool:

```javascript
// When user leaves tool
analytics.trackTimeOnTool('JSON Formatter', 120); // 120 seconds
```

### Custom Events:

```javascript
analytics.event({
  action: 'button_click',
  category: 'engagement',
  label: 'subscribe_newsletter',
  value: 1,
});
```

## 🎯 Recommended Tracking Points

### Add to Tool Pages:

```javascript
// When tool loads
useEffect(() => {
  analytics.trackToolUsage(toolName, categoryName);
}, []);

// When user copies result
const handleCopy = () => {
  navigator.clipboard.writeText(result);
  analytics.trackCopy(toolName, 'result');
  toast.success('Copied!');
};

// Track time on page
useEffect(() => {
  const startTime = Date.now();
  return () => {
    const timeSpent = (Date.now() - startTime) / 1000;
    if (timeSpent > 5) {
      // Only track if spent more than 5s
      analytics.trackTimeOnTool(toolName, timeSpent);
    }
  };
}, []);
```

## 📈 Key Metrics to Monitor

Once set up, monitor these in GA4:

1. **Page Views**
   - Which pages get most traffic
   - Landing pages
   - Exit pages

2. **Events**
   - tool_used (which tools are popular)
   - copy_result (engagement metric)
   - search (what users search for)
   - download (conversion metric)

3. **User Behavior**
   - Time on site
   - Pages per session
   - Bounce rate

4. **Conversions**
   - Tool completions
   - Newsletter signups (if added)
   - Downloads

## 🎨 Custom Dashboards

Create these in GA4:

1. **Tool Performance**
   - Most used tools
   - Tool categories
   - Average time per tool

2. **User Engagement**
   - Copy actions per visit
   - Search usage
   - Return visitor rate

3. **Conversion Funnel**
   - Homepage → Category → Tool → Result → Copy

## 🚀 Next Steps

1. Add tracking to popular tools first
2. Set up custom events in GA4
3. Create conversion goals
4. Set up alerts for drops in traffic
5. Weekly review of metrics

## ⚠️ Privacy Compliance

Current setup:

- ✅ No PII collected
- ✅ IP anonymization (GA4 default)
- ⚠️ Need cookie consent banner (coming next)

## 🔗 Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/reference/events)
- [Best Practices](https://support.google.com/analytics/answer/9267735)

---

**Status:** ✅ Ready to use (just add your GA ID!)
