# Implementation Plan: OpenSearch AgentOps OpenTelemetry-Focused Redesign

## Overview

This implementation plan breaks down the OpenTelemetry-focused redesign into discrete, incremental coding tasks. Each task builds on previous work, with testing integrated throughout. The website will be built using Astro 4.x with Tailwind CSS, React islands for interactivity, and Shiki for syntax highlighting.

## Tasks

- [x] 1. Project setup and configuration
  - Initialize Astro project with TypeScript support (or use existing project)
  - Configure Tailwind CSS with OTEL-focused color palette (cyan #00d4ff, dark backgrounds)
  - Install dependencies (shiki for syntax highlighting, lucide-react for icons)
  - Update Layout.astro with new meta tags for OTEL positioning
  - _Requirements: 13.1, 13.2_

- [ ]* 1.1 Write unit tests for project configuration
  - Test Tailwind config includes OTEL color palette
  - Test Layout.astro includes updated meta tags
  - _Requirements: 13.2_

- [x] 2. Implement Navigation component updates
  - [x] 2.1 Update Navigation.astro with new menu items
    - Update menu items to: Features, Integration, Why OTEL, Docs
    - Update CTAs to: Sign In (secondary), Get Started (primary)
    - Maintain fixed navigation with backdrop blur
    - _Requirements: 1.1, 1.2_

  - [ ]* 2.2 Write unit tests for updated Navigation
    - Test new menu items render correctly
    - Test updated CTA labels
    - _Requirements: 1.1_

- [x] 3. Implement Hero section redesign
  - [x] 3.1 Create new Hero.astro component
    - Build headline: "OpenTelemetry for AI Agents. Everything else follows."
    - Add gradient styling to "OpenTelemetry" text (cyan gradient)
    - Add subheadline about standards and speed
    - Create three CTAs with hierarchy: primary, secondary, tertiary
    - _Requirements: 2.1, 2.2, 2.3, 2.6, 2.7, 2.8_

  - [x] 3.2 Create terminal-style Dashboard preview
    - Build dashboard header with title and tabs (Traces, Metrics, Evals)
    - Create trace output section with indented hierarchy
    - Add trace lines with timestamps, spans, status icons, durations
    - Implement hover effect on trace lines (blue border, background tint)
    - Add metrics cards showing cost and latency with reduction percentages
    - _Requirements: 2.4, 2.5_

  - [ ]* 3.3 Write unit tests for Hero component
    - Test headline text includes "OpenTelemetry"
    - Test three CTAs render with correct hierarchy
    - Test dashboard preview displays trace lines
    - Test metrics cards display
    - _Requirements: 2.1, 2.3, 2.4, 2.5_

  - [ ]* 3.4 Write property test for CTA hierarchy
    - **Property 1: Hero CTAs have correct hierarchy**
    - **Validates: Requirements 2.3**

- [x] 4. Implement Quick Win section
  - [x] 4.1 Create QuickWin.astro component
    - Add section header: "5 Minutes to Production Observability"
    - Create two-column grid (code block left, live output right)
    - Build code block with Python instrumentation example
    - Add syntax highlighting using Shiki
    - Build live output with terminal-style success messages
    - Add "See Full Interactive Demo" CTA button
    - Implement responsive stacking for mobile
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 4.2 Write property test for syntax highlighting
    - **Property 2: Code blocks have syntax highlighting**
    - **Validates: Requirements 3.4**

  - [ ]* 4.3 Write unit tests for QuickWin component
    - Test section headline is correct
    - Test code block displays Python code
    - Test live output displays success messages
    - Test CTA button is present
    - _Requirements: 3.1, 3.2, 3.3, 3.6_

- [x] 5. Implement Integration Paths section
  - [x] 5.1 Create IntegrationPaths.astro with React island
    - Build section header: "Choose Your Integration Style"
    - Create tab buttons: Quickest (5 min), Standard (15 min), Custom OTEL
    - Implement tab state management with React useState
    - Build tab content for each integration path
    - Add code examples with syntax highlighting for each tab
    - Add benefits list with checkmark bullets for each tab
    - Implement fade-in animation on tab switch
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8_

  - [ ]* 5.2 Write property test for tab content matching
    - **Property 3: Tab content matches active tab**
    - **Validates: Requirements 4.2**

  - [ ]* 5.3 Write unit tests for IntegrationPaths component
    - Test three tab buttons render
    - Test clicking tab updates active state
    - Test each tab displays correct content
    - Test benefits lists display for each tab
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

- [x] 6. Checkpoint - Ensure all tests pass
  - Run all unit and property tests
  - Verify hero, quick win, and integration paths sections render correctly
  - Ask the user if questions arise

- [x] 7. Implement Why OTEL section
  - [x] 7.1 Create WhyOTEL.astro component
    - Add section header: "Why OpenTelemetry Matters"
    - Create six OTEL cards in responsive grid
    - Build cards: Industry Standard (CNCF), Your Data Your Rules, Future-Proof, No Vendor Lock-In, Language Agnostic, Community Driven
    - Add icon, title, description, and "Learn more" link to each card
    - Implement hover effects (border color change, lift)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

  - [ ]* 7.2 Write property test for OTEL card structure
    - **Property 4: OTEL cards contain all required elements**
    - **Validates: Requirements 5.2**

  - [ ]* 7.3 Write unit tests for WhyOTEL component
    - Test six cards render
    - Test each card has icon, title, description, link
    - Test hover effects apply
    - _Requirements: 5.1, 5.2, 5.3_

- [x] 8. Implement Features section with pain points
  - [x] 8.1 Create Features.astro component
    - Build six feature cards in responsive grid (2 columns desktop, 1 mobile)
    - Create cards: Auto-Instrumentation, Local-First Development, Standards-Based Evals, Real-Time Streaming, Cost Transparency, OTEL-Native
    - Add icon, title, pain point box (red theme), solution box (green theme) to each card
    - Add optional code examples to relevant cards
    - Implement hover effects (border color change, lift)
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.6_

  - [ ]* 8.2 Write property test for feature card structure
    - **Property 5: Feature cards have pain point and solution boxes**
    - **Validates: Requirements 6.2, 6.3, 6.4**

  - [ ]* 8.3 Write unit tests for Features component
    - Test six feature cards render
    - Test each card has pain point box with red styling
    - Test each card has solution box with green styling
    - Test solution bullets have arrow prefix
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

- [x] 9. Implement Developer Testimonials section
  - [x] 9.1 Create DeveloperTestimonials.astro with React island
    - Add section header: "Loved by Developers"
    - Create testimonial data structure with 5+ testimonials
    - Build filter buttons for categories (Speed Wins, OTEL Love, Local Development, Standards-First, Framework Support)
    - Implement filter state management with React useState
    - Create testimonial cards with quote, author info, highlight box
    - Add large quote mark decoration
    - Implement hover effects (border color change, glow)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 9.2 Write property tests for testimonial cards
    - **Property 6: Testimonial cards contain all required elements**
    - **Property 7: Filtered testimonials match category**
    - **Validates: Requirements 7.2, 7.3, 7.4, 7.6**

  - [ ]* 9.3 Write unit tests for DeveloperTestimonials component
    - Test minimum five testimonials render
    - Test filter buttons render
    - Test clicking filter updates displayed testimonials
    - Test highlight box displays for each testimonial
    - _Requirements: 7.1, 7.2, 7.4, 7.5, 7.6_

- [x] 10. Checkpoint - Ensure all tests pass
  - Run all unit and property tests
  - Verify Why OTEL, Features, and Testimonials sections render correctly
  - Ask the user if questions arise

- [ ] 11. Implement Pricing section
  - [ ] 11.1 Create Pricing.astro component
    - Add pricing section headline
    - Add description text about cost structure
    - Create primary CTA button
    - _Requirements: 8.1, 8.2_

  - [ ]* 11.2 Write unit tests for Pricing component
    - Test pricing section renders
    - Test CTA button is present
    - _Requirements: 8.1, 8.2_

- [x] 12. Implement Footer component
  - [x] 12.1 Create Footer.astro component
    - Build four-column layout (Product, Resources, Company, Legal)
    - Add Product links: Features, Pricing, Changelog, Roadmap
    - Add Resources links: Documentation, API Reference, Tutorials, Blog
    - Add Company links: About, Careers, Contact, Press
    - Add Legal links: Privacy, Terms, Security, GDPR
    - Add logo, copyright notice, and social media links
    - Implement responsive layout (4 columns desktop, 2 tablet, 1 mobile)
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

  - [ ]* 12.2 Write unit tests for Footer component
    - Test all four columns render
    - Test each column has correct links
    - Test logo and copyright display
    - Test social media links are present
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 13. Implement accessibility features
  - [ ] 13.1 Add ARIA labels and semantic HTML
    - Add aria-label to icon-only buttons
    - Use semantic HTML elements (nav, main, section, article, header, footer)
    - Add aria-selected to active tabs
    - Add aria-pressed to active filter buttons
    - Add skip to main content link
    - _Requirements: 11.3, 11.6, 13.1_

  - [ ] 13.2 Ensure proper heading hierarchy
    - Verify one h1 per page
    - Ensure headings don't skip levels
    - Add descriptive heading text
    - _Requirements: 13.6_

  - [ ] 13.3 Add alt text to all images
    - Add descriptive alt text to content images
    - Add empty alt text to decorative images
    - _Requirements: 11.5_

  - [ ] 13.4 Implement keyboard navigation
    - Ensure all interactive elements are keyboard accessible
    - Add visible focus indicators
    - Test tab order is logical
    - Add arrow key navigation for tabs
    - _Requirements: 11.2_

  - [ ] 13.5 Ensure color contrast compliance
    - Verify all text meets 4.5:1 contrast ratio
    - Adjust colors if needed (especially on colored backgrounds)
    - _Requirements: 11.4_

  - [ ] 13.6 Ensure touch target sizing
    - Verify all buttons, links, tabs, filters are at least 44px
    - Adjust padding if needed
    - _Requirements: 12.3_

  - [ ]* 13.7 Write property tests for accessibility
    - **Property 9: Keyboard navigation support**
    - **Property 10: Screen reader compatibility**
    - **Property 11: Color contrast compliance**
    - **Property 12: Image alt text presence**
    - **Property 13: Semantic HTML structure**
    - **Property 14: Touch target sizing**
    - **Property 15: Heading hierarchy**
    - **Validates: Requirements 11.2, 11.3, 11.4, 11.5, 11.6, 12.3, 13.1, 13.6**

- [x] 14. Implement performance optimizations
  - [x] 14.1 Optimize images
    - Use Astro Image component for all images
    - Convert images to WebP format
    - Add lazy loading to below-fold images
    - Implement responsive images with srcset
    - _Requirements: 10.5_

  - [ ]* 14.2 Write property test for lazy loading
    - **Property 8: Below-fold images are lazy-loaded**
    - **Validates: Requirements 10.5**

  - [x] 14.3 Optimize CSS and JavaScript
    - Configure Tailwind to purge unused classes
    - Use client:load for tabs and filters (React islands)
    - Minimize JavaScript bundle size
    - Use Shiki for build-time syntax highlighting (zero runtime JS)
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 15. Implement SEO features
  - [ ] 15.1 Add meta tags and structured data
    - Update title, description, and Open Graph meta tags for OTEL positioning
    - Implement JSON-LD structured data for SoftwareApplication
    - _Requirements: 13.2, 13.3_

  - [ ] 15.2 Create sitemap and robots.txt
    - Generate sitemap.xml file
    - Create robots.txt file
    - _Requirements: 13.4, 13.5_

  - [ ]* 15.3 Write unit tests for SEO features
    - Test meta tags are present in head
    - Test JSON-LD script tag exists
    - Test sitemap.xml file exists
    - Test robots.txt file exists
    - _Requirements: 13.2, 13.3, 13.4, 13.5_

- [ ] 16. Implement analytics tracking
  - [ ] 16.1 Add Google Analytics 4
    - Add GA4 script to Layout.astro
    - Configure GA4 with measurement ID
    - _Requirements: 14.1_

  - [ ] 16.2 Add event tracking
    - Add click tracking to all CTA buttons
    - Add scroll depth tracking (25%, 50%, 75%, 100%)
    - Add tab selection tracking in Integration Paths
    - Add filter selection tracking in Testimonials
    - Add external link click tracking
    - _Requirements: 14.2, 14.3, 14.4, 14.5, 14.6_

  - [ ]* 16.3 Write property tests for analytics tracking
    - **Property 16: CTA button analytics tracking**
    - **Property 17: Tab selection tracking**
    - **Property 18: Filter selection tracking**
    - **Property 19: External link tracking**
    - **Validates: Requirements 14.2, 14.4, 14.5, 14.6**

  - [ ]* 16.4 Write unit tests for analytics
    - Test GA4 script is present
    - Test scroll depth tracking is set up
    - Test tab click triggers analytics event
    - Test filter click triggers analytics event
    - _Requirements: 14.1, 14.3, 14.4, 14.5_

- [x] 17. Implement responsive design
  - [x] 17.1 Test and refine responsive layouts
    - Test all sections at 640px, 768px, 1024px, 1280px breakpoints
    - Ensure mobile-first approach is followed
    - Verify sections stack vertically on mobile
    - Test tablet layouts optimize for medium screens
    - Test Quick Win section stacks on mobile
    - Test OTEL cards grid adjusts (3→2→1 columns)
    - Test Features grid adjusts (2→1 columns)
    - Test Testimonials grid adjusts (3→2→1 columns)
    - _Requirements: 12.1, 12.2, 12.4, 12.5_

  - [ ]* 17.2 Write unit tests for responsive behavior
    - Test navigation shows hamburger menu on mobile
    - Test Quick Win section stacks vertically on mobile
    - Test grids adjust column count at breakpoints
    - _Requirements: 1.3, 3.7, 12.4_

- [x] 18. Implement animations and transitions
  - [x] 18.1 Add animations with reduced motion support
    - Implement fade-in animation for tab content switches
    - Add hover transition effects to cards
    - Add smooth transitions to filter changes
    - Implement prefers-reduced-motion media query
    - Disable/minimize animations when reduced motion is preferred
    - Use GPU-accelerated properties (transform, opacity)
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 18.2 Write property test for reduced motion
    - **Property 20: Animation respects reduced motion**
    - **Validates: Requirements 15.3**

  - [ ]* 18.3 Write unit tests for animations
    - Test tab switch triggers fade-in animation
    - Test card hover applies transition
    - Test reduced motion disables animations
    - _Requirements: 15.1, 15.2, 15.3_

- [x] 19. Final integration and polish
  - [x] 19.1 Wire all components together in index.astro
    - Import all new components
    - Arrange components in correct order
    - Ensure smooth scroll navigation works
    - Test all internal links
    - _Requirements: All_

  - [x] 19.2 Test cross-browser compatibility
    - Test in Chrome, Firefox, Safari
    - Fix any browser-specific issues
    - Ensure graceful degradation for older browsers
    - Test backdrop-filter fallback
    - _Requirements: 10.1, 10.2, 10.3_

- [-] 20. Final checkpoint - Ensure all tests pass
  - Run complete test suite (unit and property tests)
  - Run Lighthouse audit and verify performance score > 90
  - Run accessibility audit with axe-core
  - Verify all requirements are met
  - Test conversion tracking for all CTAs
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Focus on one task at a time - complete it fully before moving to the next
- React islands (tabs, filters) should use client:load directive for interactivity
- Syntax highlighting should use Shiki for zero runtime JavaScript
- All animations must respect prefers-reduced-motion
