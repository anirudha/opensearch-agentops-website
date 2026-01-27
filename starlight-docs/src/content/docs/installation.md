---
title: Installation
description: Detailed installation instructions for OpenSearch AgentOps
---

Complete installation guide for OpenSearch AgentOps.

## System Requirements

- **Node.js**: 18.0.0 or higher
- **Python**: 3.8 or higher
- **Memory**: 512MB minimum
- **Disk Space**: 100MB

## Installation Methods

### NPM (JavaScript/TypeScript)

```bash
npm install @opensearch/agentops
```

### Yarn

```bash
yarn add @opensearch/agentops
```

### PNPM

```bash
pnpm add @opensearch/agentops
```

### Python (pip)

```bash
pip install opensearch-agentops
```

### Python (poetry)

```bash
poetry add opensearch-agentops
```

## Configuration

### Environment Variables

Create a `.env` file in your project root:

```bash
AGENTOPS_API_KEY=your_api_key_here
AGENTOPS_PROJECT_NAME=my-project
AGENTOPS_ENVIRONMENT=production
```

### Configuration File

Create `agentops.config.js`:

```javascript
export default {
  apiKey: process.env.AGENTOPS_API_KEY,
  projectName: 'my-ai-app',
  environment: 'production',
  sampling: {
    rate: 1.0 // Sample 100% of traces
  }
};
```

## Verification

Verify your installation:

```bash
# JavaScript
node -e "console.log(require('@opensearch/agentops'))"

# Python
python -c "import opensearch_agentops; print(opensearch_agentops.__version__)"
```

## Troubleshooting

### Common Issues

**Module not found**
- Ensure you've installed the package
- Check your Node.js/Python version

**API Key errors**
- Verify your API key is correct
- Check environment variables are loaded

## Next Steps

- Return to [Quick Start](./quickstart)
- Explore the full documentation
