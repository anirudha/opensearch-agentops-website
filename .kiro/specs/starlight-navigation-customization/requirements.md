# Starlight Navigation Customization - Requirements

## Overview
Customize the Starlight Getting Started documentation site to match the main site's navigation and branding, ensuring a consistent user experience across both sites.

## User Stories

### 1. As a user, I want to see the same navigation bar on the Getting Started docs as the main site
**Acceptance Criteria:**
- Getting Started docs display the same header/navigation as the main site
- Navigation includes: Features, Integration, Why OTEL, Getting Started, Docs links
- Logo and branding match the main site (OpenSearch logo + AgentOps gradient text)
- GitHub button and Get Started CTA button are present
- Mobile menu works the same way as the main site

### 2. As a user, I want the "Docs" navigation item to link to the main docs section
**Acceptance Criteria:**
- "Docs" link in Getting Started navigation points to `/opensearch-agentops-website/docs/`
- Link opens in the same tab (not external)
- Active state shows when on Getting Started pages

### 3. As a user, I want consistent styling between main site and Getting Started docs
**Acceptance Criteria:**
- Header background, colors, and spacing match main site
- Font sizes and weights are consistent
- Hover states and transitions match
- Mobile responsive behavior is identical

## Technical Requirements

### Component Override
- Override Starlight's `Header` component with custom navigation
- Reuse the main site's `Navigation.astro` component or create adapted version
- Configure override in `starlight-docs/astro.config.mjs`

### Navigation Links
- All navigation links must use correct base paths
- Internal links: `/opensearch-agentops-website/[path]`
- Getting Started link: `/opensearch-agentops-website/getting-started/`
- Docs link: `/opensearch-agentops-website/docs/`

### Styling
- Ensure Tailwind CSS classes work in Starlight context
- Maintain dark theme consistency
- Preserve Starlight's content area styling

## Out of Scope
- Modifying the main site navigation
- Changing Starlight's sidebar navigation
- Customizing Starlight's footer (for now)

## Success Metrics
- Navigation appears identical on both sites
- All links work correctly
- No styling conflicts or broken layouts
- Mobile menu functions properly
