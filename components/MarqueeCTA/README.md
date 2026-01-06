# MarqueeCTA Component

A reusable animated marquee-style Call-To-Action component for promoting learning resources and other key pages.

## Usage

### Basic Usage

```jsx
import MarqueeCTA from '@/components/MarqueeCTA';

// In your page component
<MarqueeCTA />
```

### Custom Props

```jsx
<MarqueeCTA
  href="/learn/json"
  title="Master JSON in 30 Minutes"
  description="Learn JSON syntax, best practices, and real-world examples with our interactive W3Schools-style tutorial."
  buttonText="Start JSON Tutorial"
  emoji="🎓"
  gradientFrom="blue"
  gradientTo="indigo"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `href` | string | `/learn` | Link destination |
| `title` | string | `Learn More` | CTA heading text |
| `description` | string | `Explore our interactive...` | Description text |
| `buttonText` | string | `Start Learning` | Button text |
| `emoji` | string | `📚` | Icon emoji |
| `gradientFrom` | string | `emerald` | Tailwind gradient start color |
| `gradientTo` | string | `green` | Tailwind gradient end color |

## Examples

### Learn JSON
```jsx
<MarqueeCTA
  href="/learn/json"
  title="Learn JSON - Free Interactive Tutorial"
  description="Master JSON syntax, data types, and best practices with our W3Schools-style interactive guide. Perfect for beginners and experienced developers."
  buttonText="Start Learning JSON"
  emoji="📚"
/>
```

### Tool Promotion
```jsx
<MarqueeCTA
  href="/json/json-validator"
  title="Validate Your JSON"
  description="Check your JSON for syntax errors and structural issues with our powerful validation tool."
  buttonText="Open Validator"
  emoji="✅"
  gradientFrom="purple"
  gradientTo="pink"
/>
```

### Category Page
```jsx
<MarqueeCTA
  href="/categories/developer-tools"
  title="50+ Developer Tools"
  description="Explore our complete suite of free online tools for JSON, HTML, CSS, and more."
  buttonText="Browse All Tools"
  emoji="🛠️"
  gradientFrom="slate"
  gradientTo="gray"
/>
```

## Features

- ✨ Animated background pattern
- 🎯 Pulsing icon with gradient
- 🌊 Flowing border animation
- 📱 Fully responsive
- ♿ Accessible
- 🎨 Customizable colors and content
- ⚡ Smooth hover effects
- 🔄 Reusable across all pages

## Animation Details

- Background pattern scrolls continuously
- Icon pulses gently
- Button scales on hover
- Decorative dots pulse
- Border has flowing gradient effect

## Browser Support

Works in all modern browsers that support:
- CSS Grid
- CSS Animations
- CSS Gradients
- Flexbox

## Performance

- Lightweight (~2KB gzipped)
- No external dependencies
- Pure CSS animations (GPU accelerated)
- Optimized for 60fps

## Accessibility

- Semantic HTML
- Proper link structure
- Keyboard navigable
- Screen reader friendly

## Where to Use

Perfect for:
- End of blog posts/tutorials
- Tool pages (promoting learning)
- Category pages
- Homepage sections
- Between major content sections


