# Design Document: OpenSearch AgentOps OpenTelemetry-Focused Redesign

## Overview

The OpenSearch AgentOps OpenTelemetry-focused redesign transforms the marketing website from a feature-comparison approach to a developer-first, standards-based positioning. The redesign emphasizes OpenTelemetry as the foundation, rapid integration paths, and zero vendor lock-in to achieve a 40% improvement in developer signup conversion rate.

### Design Philosophy

- **Standards-First**: OpenTelemetry as the core message, not an afterthought
- **Developer Velocity**: Show how fast developers can get started (2-5 minutes)
- **Pain Point → Solution**: Address specific developer frustrations directly
- **Trust Through Standards**: CNCF backing, community-driven, future-proof
- **Zero Lock-In**: Emphasize data portability and migration ease

### Technology Stack

- **Framework**: Astro 4.x
- **UI Components**: Astro components with optional React islands for interactivity (tabs, filters)
- **Styling**: Tailwind CSS v3.4+
- **Syntax Highlighting**: Shiki or Prism.js for code blocks
- **Icons**: Lucide (via astro-icon or direct SVG)
- **Animations**: CSS transitions and transforms with prefers-reduced-motion support
- **Analytics**: Google Analytics 4

## Architecture

### Component Hierarchy

```
src/
├── pages/
│   └── index.astro (Home page)
├── layouts/
│   └── Layout.astro (Base layout with head, scripts)
└── components/
    ├── Navigation.astro
    ├── Hero.astro
    ├── QuickWin.astro
    ├── IntegrationPaths.astro (with React island for tabs)
    ├── WhyOTEL.astro
    ├── Features.astro
    ├── DeveloperTestimonials.astro (with React island for filters)
    ├── Pricing.astro
    └── Footer.astro
```

### Routing Strategy

Single-page application with smooth scroll navigation. All sections on home page (index.astro) with anchor links. External links open in new tabs.

### State Management

Minimal state requirements:
- Navigation menu open/closed (mobile) - vanilla JS
- Integration tabs active tab - React state
- Testimonial filter active category - React state
- No complex state management needed

## Components and Interfaces

### Navigation Component

**Purpose**: Fixed header navigation with logo, menu items, and CTAs

**Props Interface**:
```typescript
interface Props {
  // No props needed - static content
}
```

**Behavior**:
- Fixed position with backdrop blur on scroll
- Mobile: hamburger menu with slide-out drawer
- Smooth scroll to sections on internal links

**Visual Design**:
- Background: `rgba(15, 23, 42, 0.8)` with `backdrop-filter: blur(16px)`
- Height: 64px
- Menu items: Features, Integration, Why OTEL, Pricing, Docs
- CTAs: Sign In (secondary), Get Started (primary)

### Hero Component

**Purpose**: Above-the-fold section with OpenTelemetry-focused headline and terminal-style dashboard preview

**Props Interface**:
```typescript
interface HeroProps {
  // No props needed - static content
}
```

**Elements**:
- Main headline with gradient "OpenTelemetry" text
- Subheadline emphasizing standards and speed
- Three CTAs (primary, secondary, tertiary)
- Terminal-style dashboard preview with traces
- Metric cards showing cost and latency improvements

**Visual Design**:
- Headline gradient: `linear-gradient(135deg, #00d4ff, #0099ff)` for "OpenTelemetry"
- Secondary text: `#e0e7ff`
- Dashboard preview: Dark terminal theme with Monaco font
- Trace lines: Indented hierarchy with timestamps, spans, status, duration
- Hover effect on trace lines: Blue left border and background tint

### QuickWin Component

**Purpose**: Demonstrate 5-minute setup with side-by-side code and output

**Props Interface**:
```typescript
interface QuickWinProps {
  // No props needed - static content
}
```

**Elements**:
- Section header with headline and description
- Code block (left) with Python instrumentation code
- Live output (right) with terminal-style success messages
- CTA button for interactive demo

**Visual Design**:
- Two-column grid (1 column on mobile)
- Code block: Dark background, syntax highlighting
- Live output: Terminal theme with success indicators (✓)
- Success lines in green (#68d391)

### IntegrationPaths Component

**Purpose**: Interactive tabbed interface showing three integration approaches

**Props Interface**:
```typescript
interface IntegrationPathsProps {
  // No props needed - static content, state managed internally
}
```

**Elements**:
- Tab buttons: Quickest (5 min), Standard (15 min), Custom OTEL
- Tab content: Title, description, code example, benefits list
- Each tab has icon, timing, and description

**Visual Design**:
- Tab buttons: Horizontal row with bottom border indicator
- Active tab: Cyan color (#00d4ff) with bottom border
- Tab content: Fade-in animation on switch
- Benefits list: Checkmark bullets in green
- Code examples: Syntax highlighted

**State Management**:
```typescript
const [activeTab, setActiveTab] = useState<'quick' | 'standard' | 'custom'>('quick');
```

### WhyOTEL Component

**Purpose**: Six-card grid explaining OpenTelemetry benefits

**Props Interface**:
```typescript
interface WhyOTELProps {
  // No props needed - static content
}
```

**Elements**:
- Six cards: Industry Standard, Your Data Your Rules, Future-Proof, No Vendor Lock-In, Language Agnostic, Community Driven
- Each card: Icon, title, description, "Learn more" link

**Visual Design**:
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Card background: Gradient with OTEL colors
- Hover: Border color change to cyan, lift effect
- Icons: Large emoji or SVG icons

### Features Component

**Purpose**: Six feature cards with pain point → solution format

**Props Interface**:
```typescript
interface FeaturesProps {
  // No props needed - static content
}
```

**Elements**:
- Six cards: Auto-Instrumentation, Local-First, Standards-Based Evals, Real-Time Streaming, Cost Transparency, OTEL-Native
- Each card: Icon, title, pain point box (red), solution box (green), optional code

**Visual Design**:
- Grid: 2 columns desktop, 1 mobile
- Pain point box: Red left border (#f56565), light red background
- Solution box: Green left border (#48bb78), light green background
- Solution bullets: Arrow (→) in green
- Hover: Cyan border, lift effect

### DeveloperTestimonials Component

**Purpose**: Filterable testimonial cards from developers

**Props Interface**:
```typescript
interface Testimonial {
  id: number;
  quote: string;
  category: string;
  author: string;
  role: string;
  company: string;
  image: string;
  company_logo: string;
  highlight: string;
}

interface DeveloperTestimonialsProps {
  testimonials: Testimonial[];
}
```

**Elements**:
- Filter buttons for categories
- Testimonial cards with quote, author info, highlight box
- Large quote mark decoration

**Visual Design**:
- Grid: 3 columns desktop, 2 tablet, 1 mobile
- Quote mark: Large, cyan, semi-transparent
- Highlight box: Cyan background, left border
- Hover: Cyan border, glow effect

**State Management**:
```typescript
const [activeFilter, setActiveFilter] = useState<string>('All');
const filteredTestimonials = testimonials.filter(t => 
  activeFilter === 'All' || t.category === activeFilter
);
```

### Pricing Component

**Purpose**: Display pricing information and CTA

**Props Interface**:
```typescript
interface PricingProps {
  ctaText: string;
  ctaLink: string;
  description: string;
}
```

**Visual Design**:
- Centered section with headline
- Description text
- Primary CTA button

### Footer Component

**Purpose**: Site footer with links and information

**Props Interface**:
```typescript
interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  columns: FooterColumn[];
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
}
```

**Visual Design**:
- Four columns on desktop, 2 on tablet, 1 on mobile
- Logo and copyright at bottom
- Social icons in a row
- Dark background with lighter text

## Data Models

### Site Configuration

```typescript
interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    twitter: string;
    discord: string;
    linkedin: string;
    docs: string;
    dockerSetup: string;
    otelDocs: string;
  };
}
```

### Testimonials Data

```typescript
const testimonials: Testimonial[] = [
  {
    id: 1,
    quote: "5-minute setup. Tracing production requests immediately...",
    category: "Speed Wins",
    author: "Sarah Chen",
    role: "Senior Backend Engineer",
    company: "TechCorp AI",
    image: "/testimonials/sarah.jpg",
    company_logo: "/logos/techcorp.svg",
    highlight: "5-minute setup vs 3-week integration"
  },
  // ... more testimonials
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Hero CTAs have correct hierarchy

*For any* hero section, the primary CTA should have the most prominent styling, secondary CTA should have medium prominence, and tertiary CTA should have the least prominence.

**Validates: Requirements 2.3**

### Property 2: Code blocks have syntax highlighting

*For any* code block element, the code should be syntax highlighted with appropriate language-specific styling.

**Validates: Requirements 3.4**

### Property 3: Tab content matches active tab

*For any* integration tabs component with an active tab selection, the displayed content should match the selected tab's content.

**Validates: Requirements 4.2**

### Property 4: OTEL cards contain all required elements

*For any* OTEL card data object, the rendered card should include an icon, title, description, and "Learn more" link.

**Validates: Requirements 5.2**

### Property 5: Feature cards have pain point and solution boxes

*For any* feature card, the card should include both a pain point box with red styling and a solution box with green styling.

**Validates: Requirements 6.2, 6.3, 6.4**

### Property 6: Testimonial cards contain all required elements

*For any* testimonial data object, the rendered card should include quote text, category, author name, role, company, company logo, and highlight.

**Validates: Requirements 7.2, 7.3, 7.4**

### Property 7: Filtered testimonials match category

*For any* testimonial filter selection, all displayed testimonials should match the selected category (or show all if "All" is selected).

**Validates: Requirements 7.6**

### Property 8: Below-fold images are lazy-loaded

*For any* image element that is not in the initial viewport (below the fold), the image should have the loading="lazy" attribute.

**Validates: Requirements 10.5**

### Property 9: Keyboard navigation support

*For any* interactive element (buttons, links, tabs, filters), the element should be keyboard accessible with proper focus indicators and tab order.

**Validates: Requirements 11.2**

### Property 10: Screen reader compatibility

*For any* interactive element or meaningful content, appropriate ARIA attributes (aria-label, aria-describedby, role) should be present to support screen readers.

**Validates: Requirements 11.3**

### Property 11: Color contrast compliance

*For any* text element, the color contrast ratio between text and background should be at least 4.5:1.

**Validates: Requirements 11.4**

### Property 12: Image alt text presence

*For any* image element, the element should have an alt attribute with descriptive text (or empty string for decorative images).

**Validates: Requirements 11.5**

### Property 13: Semantic HTML structure

*For any* page section, the HTML should use semantic elements (nav, main, section, article, header, footer) rather than generic div elements for structural content.

**Validates: Requirements 11.6, 13.1**

### Property 14: Touch target sizing

*For any* interactive element (buttons, links, tabs, filters), the element should have a minimum touch target size of 44px x 44px.

**Validates: Requirements 12.3**

### Property 15: Heading hierarchy

*For any* page, there should be exactly one h1 element, and heading levels should not skip (e.g., h2 should not be followed by h4).

**Validates: Requirements 13.6**

### Property 16: CTA button analytics tracking

*For any* CTA button element, the element should have analytics tracking attributes (data-analytics or onClick handler with tracking).

**Validates: Requirements 14.2**

### Property 17: Tab selection tracking

*For any* tab button in Integration_Tabs, clicking the tab should trigger an analytics event with the tab name.

**Validates: Requirements 14.4**

### Property 18: Filter selection tracking

*For any* filter button in testimonials, clicking the filter should trigger an analytics event with the category name.

**Validates: Requirements 14.5**

### Property 19: External link tracking

*For any* external link (links with target="_blank" or external domains), the link should have click tracking attributes.

**Validates: Requirements 14.6**

### Property 20: Animation respects reduced motion

*For any* animated element, when prefers-reduced-motion is enabled, the animation should be disabled or significantly reduced.

**Validates: Requirements 15.3**

## Error Handling

### Client-Side Errors

**Image Loading Failures**:
- Use fallback images or placeholder graphics
- Log errors to analytics for monitoring

**Navigation Errors**:
- Validate anchor links exist before scrolling
- Fallback to top of page if section not found

**Analytics Failures**:
- Wrap analytics calls in try-catch blocks
- Fail silently to not disrupt user experience

**Tab/Filter State Errors**:
- Default to first tab/filter if invalid state
- Validate state before rendering

### Performance Degradation

**Slow Network**:
- Implement loading states for images
- Show skeleton screens during content load
- Prioritize above-the-fold content

**JavaScript Disabled**:
- Ensure core content is accessible without JS
- Progressive enhancement approach
- Show all tabs/testimonials if JS disabled

### Browser Compatibility

**Older Browsers**:
- Polyfills for modern CSS features (backdrop-filter)
- Graceful degradation for animations
- Test on last 2 versions of major browsers

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples, edge cases, and component rendering using Vitest.

**Component Tests**:
- Test each component renders with required props
- Test interactive behaviors (clicks, tab switches, filter changes)
- Test responsive behavior at different viewport sizes
- Test error states and edge cases

**Example Unit Tests**:
- Navigation component renders all menu items
- Hero section displays correct headline with gradient text
- QuickWin section displays code block and live output
- Integration tabs render all three tabs
- OTEL cards render with all six cards
- Feature cards display pain point and solution boxes
- Testimonials filter correctly by category
- Footer displays all four columns with correct links

**Integration Tests**:
- Test smooth scroll navigation between sections
- Test tab switching updates content correctly
- Test testimonial filtering updates displayed cards
- Test analytics event firing on CTA clicks, tab switches, filter changes
- Test external links open in new tabs

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using fast-check library. Each test will run a minimum of 100 iterations.

**Test Configuration**:
```typescript
import fc from 'fast-check';

// Example property test
describe('Property Tests', () => {
  it('should display testimonials matching selected category', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.integer(),
          quote: fc.string(),
          category: fc.constantFrom('Speed Wins', 'OTEL Love', 'Local Development'),
          author: fc.string(),
          role: fc.string(),
          company: fc.string(),
        })),
        fc.constantFrom('Speed Wins', 'OTEL Love', 'Local Development', 'All'),
        (testimonials, filter) => {
          const filtered = filterTestimonials(testimonials, filter);
          if (filter === 'All') {
            expect(filtered).toEqual(testimonials);
          } else {
            expect(filtered.every(t => t.category === filter)).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Coverage**:
- Component rendering properties (Props 1-7)
- Accessibility properties (Props 8-15)
- Analytics tracking properties (Props 16-19)
- Animation properties (Prop 20)

**Generators**:
- Random testimonial data with varying categories
- Random tab selections
- Random filter selections
- Random OTEL card data
- Random feature card data with pain points and solutions
- Random image data with varying positions (above/below fold)
- Random interactive elements with varying types

### Accessibility Testing

**Automated Tools**:
- axe-core for automated accessibility checks
- Lighthouse CI for continuous accessibility monitoring
- eslint-plugin-jsx-a11y for linting

**Manual Testing**:
- Keyboard navigation testing (tabs, filters, links)
- Screen reader testing (NVDA, JAWS, VoiceOver)
- Color contrast verification
- Focus indicator visibility

### Performance Testing

**Lighthouse Audits**:
- Run Lighthouse in CI pipeline
- Set performance budget thresholds
- Monitor Core Web Vitals

**Load Testing**:
- Test with throttled network (3G, 4G)
- Test with disabled cache
- Measure bundle sizes

### Visual Regression Testing

**Tools**:
- Percy or Chromatic for visual diffs
- Test across browsers and viewport sizes
- Catch unintended UI changes

### End-to-End Testing

**Playwright Tests**:
- Full user journey from landing to sign-up
- Cross-browser testing (Chrome, Firefox, Safari)
- Mobile and desktop viewports

**Test Scenarios**:
- First-time visitor explores integration paths and signs up
- Visitor filters testimonials and reads developer feedback
- Visitor navigates to OTEL documentation
- Visitor explores features and contacts sales

### Testing Balance

- **Unit tests**: Focus on specific component behaviors and edge cases
- **Property tests**: Verify universal properties hold across all data variations
- **Integration tests**: Test component interactions and user flows
- **E2E tests**: Validate complete user journeys

Property-based tests handle comprehensive input coverage through randomization, so unit tests should focus on specific examples that demonstrate correct behavior and important edge cases.

## Implementation Notes

### Performance Optimization

**Image Optimization**:
- Use Astro's Image component for automatic optimization
- Serve WebP format with fallbacks
- Implement responsive images with srcset
- Lazy load below-the-fold images

**Code Splitting**:
- Astro automatically ships zero JavaScript by default
- Use client:load for tabs and filters (interactive components)
- Defer non-critical JavaScript

**CSS Optimization**:
- Purge unused Tailwind classes in production
- Inline critical CSS (Astro does this automatically)
- Use CSS containment for isolated components

**Syntax Highlighting**:
- Use Shiki for build-time syntax highlighting (zero runtime JS)
- Pre-render all code blocks at build time

### SEO Implementation

**Meta Tags**:
```astro
---
const title = 'OpenSearch AgentOps - OpenTelemetry for AI Agents';
const description = 'Built on industry standards. Ship production AI in minutes with unified observability, evaluation, and prompt management. Zero vendor lock-in.';
---
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="/og-image-otel.png" />
  <meta name="twitter:card" content="summary_large_image" />
</head>
```

**Structured Data**:
```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "OpenSearch AgentOps",
  "applicationCategory": "DeveloperApplication",
  "description": "OpenTelemetry-based AI observability platform",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

### Analytics Implementation

**Google Analytics 4**:
```typescript
// Track CTA clicks
const trackCTAClick = (ctaName: string) => {
  gtag('event', 'cta_click', {
    cta_name: ctaName,
    page_location: window.location.href,
  });
};

// Track tab selection
const trackTabSelection = (tabName: string) => {
  gtag('event', 'tab_selection', {
    tab_name: tabName,
  });
};

// Track filter selection
const trackFilterSelection = (category: string) => {
  gtag('event', 'filter_selection', {
    category: category,
  });
};
```

### Accessibility Implementation

**Focus Management**:
- Visible focus indicators with high contrast
- Skip to main content link
- Focus trap in mobile menu
- Keyboard navigation for tabs and filters

**ARIA Labels**:
- Descriptive labels for icon-only buttons
- aria-selected for active tabs
- aria-pressed for active filters
- Proper landmark roles

**Keyboard Shortcuts**:
- Escape to close mobile menu
- Arrow keys for tab navigation
- Enter/Space to activate buttons and tabs

### Animation Guidelines

**Performance**:
- Use transform and opacity for animations (GPU accelerated)
- Avoid animating layout properties
- Use will-change sparingly

**Accessibility**:
- Respect prefers-reduced-motion media query
- Disable animations for users who prefer reduced motion
- Keep animations subtle and purposeful

**Implementation**:
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Deployment Considerations

### Build Process

- Astro static site generation for optimal performance
- Environment variables for analytics IDs
- Automated builds on main branch commits

### Hosting

- Vercel, Netlify, or Cloudflare Pages for automatic deployments
- Custom domain configuration
- SSL/TLS certificates

### Monitoring

- Error tracking with Sentry
- Performance monitoring with web analytics
- Uptime monitoring
- Conversion tracking for CTAs

### CI/CD Pipeline

1. Lint and type check
2. Run unit tests
3. Run property-based tests
4. Run accessibility tests
5. Build production bundle
6. Run Lighthouse audit
7. Deploy to preview environment
8. Manual QA approval
9. Deploy to production

## Future Enhancements

- Interactive code playground for trying instrumentation
- Video testimonials from developers
- Live demo environment
- A/B testing for CTAs and messaging
- Personalized content based on visitor source
- Multi-language support
- Dark/light mode toggle (currently dark-only)
