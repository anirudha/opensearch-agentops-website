---
title: "SDKs & API"
description: "Client libraries for instrumenting LLM applications with OpenSearch AI Observability"
---

# SDKs & API

The OpenSearch AI Observability SDKs are OpenTelemetry-native libraries for tracing and evaluating
LLM applications. They wrap the OTEL pipeline into a simple one-line setup, provide decorators or
wrapper functions for tracing workflows, agents, and tools, and emit evaluation scores — all routed
to OpenSearch through a standard OTLP pipeline.

## Available SDKs

| SDK | Package | Status |
|---|---|---|
| [Python SDK](/opensearch-agentops-website/docs/sdks/python/) | [`opensearch-genai-sdk-py`](https://pypi.org/project/opensearch-genai-sdk-py/) | Available |
| [JavaScript / TypeScript SDK](/opensearch-agentops-website/docs/sdks/javascript/) | [`opensearch-genai-sdk`](https://www.npmjs.com/package/opensearch-genai-sdk) | Available |

## What the SDKs do

Both SDKs share the same design:

- **`register()`** — one call that configures a `TracerProvider`, sets up an OTLP exporter
  (with optional AWS SigV4 signing), and auto-discovers installed LLM instrumentor packages.
- **Trace wrappers** — decorators (Python) or higher-order functions (JavaScript) that wrap your
  application code as OTEL spans with [GenAI semantic convention](https://opentelemetry.io/docs/specs/semconv/gen-ai/) attributes.
- **`score()`** — submits evaluation metrics as OTEL spans at span, trace, or session level.
- **Auto-instrumentation** — discovers and activates installed instrumentor packages (OpenAI,
  Anthropic, Bedrock, LangChain, and more) with no code changes.

## Architecture

```
Your Application
  workflow → agent → tool     score()
      │          │       │        │
      └──────────┴───────┴────────┘
                     │
          opensearch-genai-sdk[-py]
  ┌─────────────────────────────────────┐
  │  register()                          │
  │  TracerProvider                      │
  │  ├── Resource (service.name)         │
  │  ├── BatchSpanProcessor              │
  │  │   └── OTLPSpanExporter (HTTP/gRPC)│
  │  │       └── SigV4 (AWS endpoints)   │
  │  └── Auto-instrumentation            │
  └──────────────┬──────────────────────┘
                 │ OTLP
                 ▼
        Data Prepper / OTEL Collector
                 │
                 ▼
            OpenSearch
            ├── traces
            └── scores
```

## Zero lock-in

Both SDKs are thin wrappers over standard OpenTelemetry. Remove a decorator or wrapper function
and your code works exactly as before — no proprietary SDK calls embedded in your logic.
