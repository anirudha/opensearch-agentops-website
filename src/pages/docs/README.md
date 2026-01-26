# Documentation Site Structure

This directory contains the complete documentation site for AgentOps, an OpenTelemetry-based AI observability platform.

## Structure

The documentation follows a hierarchical structure with 10 main sections:

### 🚀 Get Started
- Overview, Quickstart, Core Concepts, Example Project, Ask AI
- Quickstart includes: First Traces, First Eval, Prompt Management

### 🔧 Instrument
- OpenTelemetry Setup (Collector, Auto/Manual Instrumentation)
- Wrap AI Providers, Integrate Frameworks, Custom Tracing
- Advanced Tracing Patterns (Distributed, Trace IDs, Sampling, Batching)
- User Feedback, Attachments

### 👁️ Observe
- Tracing (Manage, Search, Sessions, URLs, Multi-Modality)
- Agent Observability (Graph, Tool Calls, Reasoning, MCP)
- Projects (Environments, Tags, Releases, Metrics)

### 🏷️ Annotate
- Labeling Queues, Annotation Configs, Human Feedback
- Labels & Corrections, Comments, Export

### 📊 Evaluate
- Datasets (Create, Update, Get, Auto-Add)
- Experiments (SDK, UI, Compare, CI/CD)

### 📝 Prompts
- Prompt Hub, Optimization, Troubleshooting

### 🚀 Deploy
- AI Proxy, Deploy Prompts, Monitor Deployments, MCP

### 🔌 Integrations
- Model Providers, Cloud Providers, Agent Frameworks, Custom

### 📦 SDKs
- Python SDK, JavaScript/TypeScript SDK, Troubleshooting

### 🔐 Platform & Administration
- Authentication & Access, Security, API & Data Platform, Self-Hosting

## Components

- **DocsLayout.astro**: Main layout with header and sidebar
- **DocsSidebar.astro**: Navigation sidebar with all sections and pages
- **scripts/generate-docs.js**: Script to generate page structure

## Navigation

The docs are linked from the main site navigation. The "Docs" link in the header navigates to `/docs`.

## Adding New Pages

To add new documentation pages:

1. Add the page definition to `scripts/generate-docs.js`
2. Run `node scripts/generate-docs.js` to generate the page
3. Edit the generated `.astro` file to add content

## Total Pages

- 83 pages total (including index and all section pages)
- Organized in a clear hierarchy following the OTel-first, agent-focused approach
