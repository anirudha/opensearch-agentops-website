# OpenSearch AgentOps

[![CI](https://github.com/anirudha/opensearch-agentops-website/actions/workflows/ci.yml/badge.svg)](https://github.com/anirudha/opensearch-agentops-website/actions/workflows/ci.yml)
[![Deploy](https://github.com/anirudha/opensearch-agentops-website/actions/workflows/deploy.yml/badge.svg)](https://github.com/anirudha/opensearch-agentops-website/actions/workflows/deploy.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-success?logo=github)](https://anirudha.github.io/opensearch-agentops-website/)

**🌐 Live Site**: [https://anirudha.github.io/opensearch-agentops-website/](https://anirudha.github.io/opensearch-agentops-website/)

Marketing website and documentation for OpenSearch AgentOps - an OpenTelemetry-native observability platform for AI agents and LLM applications.

## About

This repository contains the public-facing website and comprehensive documentation for OpenSearch AgentOps. The site showcases the platform's capabilities for observing, evaluating, and deploying production AI applications with OpenTelemetry-based tracing.

## What's Included

### Marketing Website (`/`)
- Hero section with dynamic taglines highlighting key benefits
- Feature showcase for observability, evaluation, and deployment
- Integration paths for different use cases (Greenfield, Brownfield, Migration)
- Developer testimonials and social proof
- Pricing information and call-to-action sections

### Documentation Site (`/docs`)
- **Get Started**: Quickstart guides, core concepts, and example projects
- **Instrument**: OpenTelemetry setup, provider wrapping, and custom tracing
- **Observe**: Tracing, agent observability, and project management
- **Annotate**: Labeling queues, feedback, and data export
- **Evaluate**: Datasets, experiments, and CI/CD integration
- **Prompts**: Prompt hub and optimization
- **Deploy**: AI proxy, prompt deployment, and MCP
- **Integrations**: Model providers, cloud platforms, and frameworks
- **SDKs**: Python and JavaScript/TypeScript documentation
- **Platform**: Authentication, security, and self-hosting

### Getting Started Guide (`/getting-started`)
- Built with [Astro Starlight](https://starlight.astro.build/) for a polished documentation experience
- **Introduction**: Overview of OpenSearch AgentOps and its capabilities
- **Quick Start**: 5-minute setup guide to get started quickly
- **Installation**: Detailed installation instructions for different environments

## Project Structure

```text
/
├── public/              # Static assets (logos, icons, robots.txt)
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Hero.astro
│   │   ├── Features.astro
│   │   ├── DocsSidebar.astro
│   │   └── ...
│   ├── layouts/         # Page layouts
│   │   ├── Layout.astro      # Main layout
│   │   └── DocsLayout.astro  # Documentation layout
│   ├── pages/           # Routes and pages
│   │   ├── index.astro       # Landing page
│   │   └── docs/             # Documentation pages
│   └── styles/          # Global styles
├── starlight-docs/      # Starlight-based Getting Started guide
│   ├── src/content/docs/    # Getting Started documentation
│   └── astro.config.mjs     # Starlight configuration
├── scripts/             # Utility scripts
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build production site (main + Starlight docs)    |
| `npm run build:main`      | Build only the main site                         |
| `npm run build:starlight` | Build only the Starlight Getting Started docs    |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm test`                | Run test suite                                   |
| `npm run test:coverage`   | Run tests with coverage report                   |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).


## Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The site will be available at `http://localhost:4321`

### Available Commands

| Command           | Action                                      |
| :---------------- | :------------------------------------------ |
| `npm install`     | Install dependencies                        |
| `npm run dev`     | Start dev server at `localhost:4321`        |
| `npm run build`   | Build production site to `./dist/`          |
| `npm run preview` | Preview production build locally            |
| `npm test`        | Run test suite                              |

## Key Features

### Collapsible Documentation Navigation
The docs sidebar features smooth accordion-style navigation with:
- Collapsible main sections (Get Started, Instrument, Observe, etc.)
- Nested sub-navigation for detailed topics
- Auto-expansion of sections containing the current page
- Custom minimal scrollbar styling

### Responsive Design
Fully responsive across all devices with optimized layouts for mobile, tablet, and desktop.

### Performance Optimized
- Static site generation for fast page loads
- Optimized images and assets
- Minimal JavaScript footprint

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

See LICENSE file for details.
