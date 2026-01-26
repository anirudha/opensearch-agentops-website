# Design Document: OpenSearch AgentOps Marketing Website

## Overview

The OpenSearch AgentOps marketing website is a modern, single-page application designed to convert visitors into users through compelling storytelling, clear value proposition, and strategic calls-to-action. The design emphasizes a dark, developer-focused aesthetic with gradient accents, smooth animations, and a clean information hierarchy.

### Design Philosophy

- **Developer-First**: Technical but accessible, with code examples and clear documentation
- **Trust Through Transparency**: Open-source emphasis, clear comparisons, honest pricing
- **Performance-Oriented**: Fast loading, smooth animations, optimized assets
- **Conversion-Focused**: Strategic CTA placement, clear value propositions, minimal friction

### Technology Stack

- **Framework**: Astro 4.x
- **UI Components**: Astro components with optional React islands for interactivity
- **Styling**: Tailwind CSS v3.4+
- **Icons**: Lucide (via astro-icon or direct SVG)
- **Animations**: CSS transitions and transforms (no heavy animation libraries)
- **Forms**: Native HTML forms with client-side validation
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
    ├── SocialProof.astro
    ├── ProblemSolution.astro
    ├── Features.astro
    ├── Comparison.astro
    ├── UseCases.astro
    ├── Testimonials.astro
    ├── Pricing.astro
    ├── Integrations.astro
    ├── OpenSource.astro
    ├── CTASection.astro
    └── Footer.astro
```

### Routing Strategy

Single-page application with smooth scroll navigation. All sections are on the home page (index.astro) with anchor links for navigation. External links open in new tabs (GitHub, documentation, social media).

### State Management

Minimal state requirements:
- Navigation menu open/closed state (mobile) - handled with Alpine.js or vanilla JS
- Testimonial carousel current index (if carousel is used) - handled with vanilla JS
- No complex state management needed - Astro's partial hydration keeps JavaScript minimal

## Components and Interfaces

### Navigation Component

**Purpose**: Fixed header navigation with logo, menu items, and CTAs

**Props Interface**:
```typescript
// Astro component props are defined with TypeScript interface
interface Props {
  // No props needed - static content
}
```

**Behavior**:
- Fixed position with backdrop blur on scroll (handled with CSS and minimal JS)
- Mobile: hamburger menu with slide-out drawer (vanilla JS or Alpine.js)
- Smooth scroll to sections on internal links
- Highlight active section in navigation

**Visual Design**:
- Background: `rgba(15, 23, 42, 0.8)` with `backdrop-filter: blur(16px)`
- Height: 64px
- Logo: Left-aligned
- Menu items: Center-aligned (desktop)
- CTAs: Right-aligned with primary/secondary styling

### Hero Component

**Purpose**: Above-the-fold section with headline, value proposition, and primary CTAs

**Props Interface**:
```typescript
interface HeroProps {
  // No props needed - static content
}
```

**Elements**:
- Announcement badge with "NEW" indicator
- Main headline with gradient text effect
- Subheadline (2-3 lines)
- Four trust badges in a grid
- Two CTAs (primary and secondary)
- Dashboard preview mockup
- Animated background orbs

**Visual Design**:
- Full viewport height (min-h-screen)
- Gradient text: `linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4)`
- Trust badges: Grid of 4, icon + text
- Background orbs: Absolute positioned, animated with floating effect

### SocialProof Component

**Purpose**: Display company logos to build credibility

**Props Interface**:
```typescript
interface SocialProofProps {
  companies: Array<{
    name: string;
    logo: string;
  }>;
}
```

**Visual Design**:
- Centered layout with "Trusted by AI teams at" label
- Logos in grayscale with hover effect to lighten
- Responsive wrap on mobile
- Spacing: 48px between logos

### ProblemSolution Component

**Purpose**: Present pain points and introduce the solution

**Props Interface**:
```typescript
interface ProblemCard {
  icon: string;
  title: string;
  description: string;
  theme: 'red' | 'orange' | 'yellow';
}

interface StatCard {
  value: string;
  label: string;
}

interface ProblemSolutionProps {
  problems: ProblemCard[];
  stats: StatCard[];
}
```

**Visual Design**:
- Problem cards: Grid of 3, each with icon, title, description
- Color themes: Red (#ef4444), Orange (#f97316), Yellow (#eab308)
- Solution block: Gradient border, centered
- Stat cards: Grid of 4, large value + small label

### Features Component

**Purpose**: Showcase four main features with visuals and details

**Props Interface**:
```typescript
interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  bullets: string[];
  visual: 'code' | 'mockup' | 'grid';
  visualContent: CodeSnippet | MockupData | GridData;
  imagePosition: 'left' | 'right';
}

interface CodeSnippet {
  language: string;
  code: string;
}

interface MockupData {
  type: 'prompt-card' | 'alert-card';
  content: any;
}

interface GridData {
  items: Array<{
    title: string;
    progress: number;
  }>;
}
```

**Visual Design**:
- Alternating layout: image left/right
- Each feature: 50/50 split on desktop, stacked on mobile
- Code snippets: Syntax highlighted with dark theme
- Mockups: Card-based UI previews
- Grid: 2x4 layout with progress bars

### Comparison Component

**Purpose**: Feature comparison table against competitors

**Props Interface**:
```typescript
interface ComparisonRow {
  feature: string;
  agentops: 'full' | 'partial' | 'none';
  braintrust: 'full' | 'partial' | 'none';
  langfuse: 'full' | 'partial' | 'none';
  arize: 'full' | 'partial' | 'none';
  note?: string;
}

interface ComparisonProps {
  rows: ComparisonRow[];
}
```

**Visual Design**:
- Table with sticky header
- Icons: Checkmark (green), Partial circle (yellow), X (red)
- Highlight AgentOps column with subtle background
- Mobile: Horizontal scroll with fixed first column
- Pricing row: Show actual ranges

### UseCases Component

**Purpose**: Display industry/role-specific use cases

**Props Interface**:
```typescript
interface UseCase {
  id: string;
  icon: string;
  title: string;
  description: string;
  link: string;
}

interface UseCasesProps {
  cases: UseCase[];
}
```

**Visual Design**:
- Grid layout: 3 columns on desktop, 2 on tablet, 1 on mobile
- Cards with hover lift effect
- Icon at top, title, description, "Learn more" link
- Consistent card height

### Testimonials Component

**Purpose**: Display customer quotes and success stories

**Props Interface**:
```typescript
interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
  companyLogo?: string;
  metrics?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}
```

**Visual Design**:
- Grid of 3 testimonials (or carousel if more than 3)
- Card with quote, author info, company logo
- Optional metrics badge
- Subtle border and shadow

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
- Optional secondary "Talk to Sales" CTA

### Integrations Component

**Purpose**: Show supported integrations and SDKs

**Props Interface**:
```typescript
interface Integration {
  name: string;
  logo: string;
  category: 'llm' | 'framework' | 'sdk';
}

interface IntegrationsProps {
  integrations: Integration[];
}
```

**Visual Design**:
- Grouped by category with labels
- Logo grid with hover effects
- Grayscale logos with color on hover
- Responsive grid: 6 columns desktop, 4 tablet, 3 mobile

### OpenSource Component

**Purpose**: Highlight open-source nature and GitHub stats

**Props Interface**:
```typescript
interface OpenSourceProps {
  githubUrl: string;
  stars: number;
  forks: number;
  contributors: number;
  license: string;
  docsUrl: string;
}
```

**Visual Design**:
- Centered layout with GitHub stats
- Large stat numbers with labels
- "View on GitHub" CTA
- License badge
- Link to self-hosting docs

### CTASection Component

**Purpose**: Final conversion section before footer

**Props Interface**:
```typescript
interface CTASectionProps {
  headline: string;
  subtext: string;
  primaryCTA: {
    text: string;
    href: string;
  };
  secondaryCTA: {
    text: string;
    href: string;
  };
  trustBadges: string[];
}
```

**Visual Design**:
- Full-width section with gradient background
- Centered content
- Large headline
- Two CTAs side by side
- Trust badges repeated below

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
  };
}
```

### Navigation Data

```typescript
const navigationItems: NavItem[] = [
  { label: 'Features', href: '#features', isExternal: false },
  { label: 'Compare', href: '#compare', isExternal: false },
  { label: 'Use Cases', href: '#use-cases', isExternal: false },
  { label: 'Pricing', href: '#pricing', isExternal: false },
  { label: 'Docs', href: 'https://docs.example.com', isExternal: true },
];
```

### Feature Data

```typescript
const features: Feature[] = [
  {
    id: 'tracing',
    icon: 'Activity',
    title: 'LLM Tracing',
    description: 'Complete visibility into every LLM call...',
    bullets: [
      'Auto instrumentation for popular frameworks',
      'Cost per request tracking',
      'Agent and RAG workflow tracking',
    ],
    visual: 'code',
    visualContent: {
      language: 'python',
      code: `from agentops import trace\n\n@trace\ndef my_llm_call():\n    ...`,
    },
    imagePosition: 'right',
  },
  // ... more features
];
```

### Comparison Data

```typescript
const comparisonRows: ComparisonRow[] = [
  {
    feature: 'LLM Tracing',
    agentops: 'full',
    braintrust: 'full',
    langfuse: 'full',
    arize: 'partial',
  },
  // ... more rows
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Comparison icons match support levels

*For any* comparison row data with support levels (full, partial, none), the rendered table cell should display the correct icon: checkmark (green) for full, partial circle (yellow) for partial, and X (red) for none.

**Validates: Requirements 6.3**

### Property 2: Use case cards contain all required elements

*For any* use case data object, the rendered card should include an icon, title, description, and "Learn more" link.

**Validates: Requirements 7.2**

### Property 3: Testimonial cards contain all required elements

*For any* testimonial data object, the rendered card should include quote text, author name, role, company, and company logo.

**Validates: Requirements 8.2**

### Property 4: Testimonial metrics display conditionally

*For any* testimonial data object with a metrics field, the rendered card should display the metrics; for testimonials without metrics, no metrics section should be rendered.

**Validates: Requirements 8.3**

### Property 5: Integration logos have hover effects

*For any* integration logo element, hovering should apply a visual effect (opacity or color change).

**Validates: Requirements 10.4**

### Property 6: Below-fold images are lazy-loaded

*For any* image element that is not in the initial viewport (below the fold), the image should have the loading="lazy" attribute.

**Validates: Requirements 14.5**

### Property 7: Keyboard navigation support

*For any* interactive element (buttons, links, form inputs), the element should be keyboard accessible with proper focus indicators and tab order.

**Validates: Requirements 15.2**

### Property 8: Screen reader compatibility

*For any* interactive element or meaningful content, appropriate ARIA attributes (aria-label, aria-describedby, role) should be present to support screen readers.

**Validates: Requirements 15.3**

### Property 9: Color contrast compliance

*For any* text element, the color contrast ratio between text and background should be at least 4.5:1.

**Validates: Requirements 15.4**

### Property 10: Image alt text presence

*For any* image element, the element should have an alt attribute with descriptive text (or empty string for decorative images).

**Validates: Requirements 15.5**

### Property 11: Semantic HTML structure

*For any* page section, the HTML should use semantic elements (nav, main, section, article, header, footer) rather than generic div elements for structural content.

**Validates: Requirements 15.6, 17.1**

### Property 12: Touch target sizing

*For any* interactive element (buttons, links, form inputs), the element should have a minimum touch target size of 44px x 44px.

**Validates: Requirements 16.3**

### Property 13: Heading hierarchy

*For any* page, there should be exactly one h1 element, and heading levels should not skip (e.g., h2 should not be followed by h4).

**Validates: Requirements 17.6**

### Property 14: CTA button analytics tracking

*For any* CTA button element, the element should have analytics tracking attributes (data-analytics or onClick handler with tracking).

**Validates: Requirements 18.2**

### Property 15: Form submission tracking

*For any* form element, the form should have submission tracking (onSubmit handler with analytics).

**Validates: Requirements 18.4**

### Property 16: External link tracking

*For any* external link (links with target="_blank" or external domains), the link should have click tracking attributes.

**Validates: Requirements 18.5**

## Error Handling

### Client-Side Errors

**Image Loading Failures**:
- Use fallback images or placeholder graphics
- Implement error boundaries for image components
- Log errors to analytics for monitoring

**Navigation Errors**:
- Validate anchor links exist before scrolling
- Fallback to top of page if section not found
- Handle smooth scroll polyfill for older browsers

**Analytics Failures**:
- Wrap analytics calls in try-catch blocks
- Fail silently to not disrupt user experience
- Queue events if analytics script hasn't loaded

**Form Validation**:
- Client-side validation with clear error messages
- Prevent submission until validation passes
- Show inline errors near relevant fields

### Performance Degradation

**Slow Network**:
- Implement loading states for images
- Show skeleton screens during content load
- Prioritize above-the-fold content

**JavaScript Disabled**:
- Ensure core content is accessible without JS
- Progressive enhancement approach
- Critical CSS inlined in HTML

### Browser Compatibility

**Older Browsers**:
- Polyfills for modern CSS features (backdrop-filter)
- Graceful degradation for animations
- Test on last 2 versions of major browsers

## Testing Strategy

### Unit Testing

Unit tests will verify specific examples, edge cases, and component rendering. We'll use Vitest for testing Astro components.

**Component Tests**:
- Test each component renders with required props
- Test interactive behaviors (clicks, hovers, form submissions)
- Test responsive behavior at different viewport sizes
- Test error states and edge cases

**Example Unit Tests**:
- Navigation component renders all menu items
- Hero section displays correct headline text
- Comparison table renders with correct number of rows
- Footer displays all four columns with correct links
- Mobile menu opens and closes on hamburger click

**Integration Tests**:
- Test smooth scroll navigation between sections
- Test form submission flow
- Test analytics event firing on CTA clicks
- Test external links open in new tabs

### Property-Based Testing

Property-based tests will verify universal properties across all inputs using fast-check library. Each test will run a minimum of 100 iterations to ensure comprehensive coverage.

**Test Configuration**:
```typescript
import fc from 'fast-check';

// Example property test
describe('Property Tests', () => {
  it('should render comparison icons correctly for all support levels', () => {
    fc.assert(
      fc.property(
        fc.record({
          feature: fc.string(),
          agentops: fc.constantFrom('full', 'partial', 'none'),
          braintrust: fc.constantFrom('full', 'partial', 'none'),
          langfuse: fc.constantFrom('full', 'partial', 'none'),
          arize: fc.constantFrom('full', 'partial', 'none'),
        }),
        (row) => {
          // Test implementation
          const rendered = renderComparisonRow(row);
          // Verify correct icons are rendered
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test Coverage**:
- Component rendering properties (Props 1-5)
- Accessibility properties (Props 6-13)
- Analytics tracking properties (Props 14-16)

**Generators**:
- Random comparison data with all support level combinations
- Random use case data with varying content lengths
- Random testimonial data with and without metrics
- Random integration data across categories
- Random image data with varying positions (above/below fold)
- Random interactive elements with varying types

### Accessibility Testing

**Automated Tools**:
- axe-core for automated accessibility checks
- Lighthouse CI for continuous accessibility monitoring
- eslint-plugin-jsx-a11y for linting

**Manual Testing**:
- Keyboard navigation testing
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
- First-time visitor explores features and signs up
- Visitor compares with competitors and contacts sales
- Visitor navigates to documentation
- Visitor explores use cases and testimonials

### Testing Balance

- **Unit tests**: Focus on specific component behaviors and edge cases
- **Property tests**: Verify universal properties hold across all data variations
- **Integration tests**: Test component interactions and user flows
- **E2E tests**: Validate complete user journeys

Property-based tests handle comprehensive input coverage through randomization, so unit tests should focus on specific examples that demonstrate correct behavior and important edge cases rather than exhaustive input testing.

## Implementation Notes

### Performance Optimization

**Image Optimization**:
- Use Astro's Image component for automatic optimization
- Serve WebP format with fallbacks
- Implement responsive images with srcset
- Lazy load below-the-fold images

**Code Splitting**:
- Astro automatically ships zero JavaScript by default
- Use client:load, client:visible, or client:idle directives for interactive components
- Defer non-critical JavaScript

**CSS Optimization**:
- Purge unused Tailwind classes in production
- Inline critical CSS (Astro does this automatically)
- Use CSS containment for isolated components

**Caching Strategy**:
- Static assets with long cache headers
- Service worker for offline support (optional)
- CDN for static assets

### SEO Implementation

**Meta Tags**:
```astro
---
// In Layout.astro or index.astro
const title = 'OpenSearch AgentOps - AI Observability & Evaluation Platform';
const description = 'The unified open-source platform for LLM evaluation, prompt management, and observability. Braintrust + Langfuse + Arize combined at 70% lower cost.';
---
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content="/og-image.png" />
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

// Track scroll depth
const trackScrollDepth = (depth: number) => {
  gtag('event', 'scroll_depth', {
    depth_percentage: depth,
  });
};
```

### Accessibility Implementation

**Focus Management**:
- Visible focus indicators with high contrast
- Skip to main content link
- Focus trap in mobile menu

**ARIA Labels**:
- Descriptive labels for icon-only buttons
- Live regions for dynamic content updates
- Proper landmark roles

**Keyboard Shortcuts**:
- Escape to close mobile menu
- Tab navigation through all interactive elements
- Enter/Space to activate buttons

### Animation Guidelines

**Performance**:
- Use transform and opacity for animations (GPU accelerated)
- Avoid animating layout properties (width, height, top, left)
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

- Interactive product demo
- Video testimonials
- Live chat support widget
- A/B testing for CTAs
- Personalized content based on visitor source
- Multi-language support
- Dark/light mode toggle
