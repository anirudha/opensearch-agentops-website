---
title: Quick Start
description: Get started with OpenSearch AgentOps in 5 minutes
---

Get your AI application instrumented with OpenTelemetry in just a few minutes.

## Prerequisites

- Node.js 18+ or Python 3.8+
- An OpenSearch AgentOps account (or self-hosted instance)
- An AI application to instrument

## Installation

### JavaScript/TypeScript

```bash
npm install @opensearch/agentops
```

### Python

```bash
pip install opensearch-agentops
```

## Quick Setup

### JavaScript

```javascript
import { AgentOps } from '@opensearch/agentops';

// Initialize once at app startup
const agentops = new AgentOps({
  apiKey: process.env.AGENTOPS_API_KEY,
  projectName: 'my-ai-app'
});

// Your existing AI code works automatically!
const response = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: "Hello!" }]
});
```

### Python

```python
from opensearch_agentops import AgentOps

# Initialize
agentops = AgentOps(
    api_key=os.environ['AGENTOPS_API_KEY'],
    project_name='my-ai-app'
)

# Your existing code works automatically!
response = openai.chat.completions.create(
    model="gpt-4",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## View Your Traces

Open your AgentOps dashboard to see traces, spans, and metrics in real-time.

## Next Steps

- Learn about [Installation](./installation) options
- Explore the full documentation
- Join our community
