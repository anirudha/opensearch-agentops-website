---
title: "JavaScript / TypeScript SDK"
description: "OTEL-native tracing and scoring for LLM applications — opensearch-genai-sdk"
---

import { Tabs, TabItem, Aside } from '@astrojs/starlight/components';

# JavaScript / TypeScript SDK

`opensearch-genai-sdk` is an OpenTelemetry-native SDK for tracing and evaluating LLM applications
in Node.js. It wraps the OTEL pipeline into a one-line setup, provides higher-order functions for
tracing workflows, agents, and tools, and emits evaluation scores — all routed to OpenSearch through
a standard OTLP pipeline.

**Key properties:**
- **Zero lock-in** — remove a wrapper and your code works exactly as before
- **One-line setup** — `register()` configures the full OTEL pipeline
- **TypeScript-first** — full type definitions included
- **Sync and async** — wrapper functions support both sync and async functions

---

## Installation

```bash
npm install opensearch-genai-sdk
```

**Requirements:** Node.js 18+

---

## Quick Start

```typescript
import { register, traceWorkflow, traceAgent, traceTool, score } from "opensearch-genai-sdk";

// 1. Initialize tracing (once at startup)
register({ endpoint: "http://localhost:4318/v1/traces", projectName: "my-app" });

// 2. Wrap your functions
const getWeather = traceTool("get_weather", (city: string) => {
  return { city, temp: 22, condition: "sunny" };
}, { description: "Fetch current weather for a city" });

const assistant = traceAgent("weather_assistant", (query: string) => {
  const data = getWeather("Paris");
  return `${data.condition}, ${data.temp}C`;
});

const run = traceWorkflow("weather_query", (query: string) => {
  return assistant(query);
});

const result = run("What's the weather in Paris?");

// 3. Submit an evaluation score
score({ name: "relevance", value: 0.95, traceId: "...", source: "llm-judge" });
```

---

## API Reference

### `register()`

Configures the OTEL tracing pipeline. Call once at application startup.

```typescript
import { register } from "opensearch-genai-sdk";

register({
  endpoint: "https://pipeline.us-east-1.osis.amazonaws.com/v1/traces",
  projectName: "my-app",
  auth: "auto",          // "auto" | "sigv4" | "none"
  batch: true,           // BatchSpanProcessor (true) or SimpleSpanProcessor (false)
  autoInstrument: true,  // discover and activate installed instrumentor packages
});
```

**Options:**

| Option | Type | Default | Description |
|---|---|---|---|
| `endpoint` | `string` | `http://localhost:21890/opentelemetry/v1/traces` | OTLP endpoint URL. Override with `OPENSEARCH_OTEL_ENDPOINT` env var. |
| `projectName` | `string` | `"default"` | Service name attached to all spans. Also reads `OTEL_SERVICE_NAME`. |
| `auth` | `string` | `"auto"` | Authentication mode (see below). |
| `batch` | `boolean` | `true` | Use `BatchSpanProcessor` (`true`) or `SimpleSpanProcessor` (`false`). |
| `autoInstrument` | `boolean` | `true` | Discover and activate installed instrumentor packages. |
| `exporter` | `SpanExporter` | — | Custom exporter — overrides endpoint/auth. |

**Auth modes:**
- `"auto"` — auto-detects AWS endpoints (`*.amazonaws.com`) and enables SigV4; plain HTTP otherwise
- `"sigv4"` — always use AWS SigV4 signing
- `"none"` — always plain HTTP, no signing

<Tabs>
<TabItem label="Self-hosted">
```typescript
register({ projectName: "my-app" });
// Defaults to http://localhost:21890/opentelemetry/v1/traces
```
</TabItem>
<TabItem label="AWS OSIS">
```typescript
register({
  endpoint: "https://pipeline.us-east-1.osis.amazonaws.com/v1/traces",
  projectName: "my-app",
  auth: "sigv4",
});
```
</TabItem>
<TabItem label="Custom Exporter">
```typescript
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

register({
  projectName: "my-app",
  exporter: new OTLPTraceExporter({ url: "http://localhost:4318/v1/traces" }),
});
```
</TabItem>
</Tabs>

---

### Trace Wrappers

Four higher-order functions for tracing application logic. Each wraps a function and returns a
traced version with [GenAI semantic convention](https://opentelemetry.io/docs/specs/semconv/gen-ai/) attributes on its spans.

```typescript
traceWorkflow(name, fn, options?)
traceTask(name, fn, options?)
traceAgent(name, fn, options?)
traceTool(name, fn, options?)
```

| Wrapper | Use for | `gen_ai.operation.name` | Span name |
|---|---|---|---|
| `traceWorkflow` | Top-level orchestration | `workflow` | `name` |
| `traceTask` | Units of work within a workflow | `task` | `name` |
| `traceAgent` | Autonomous agent / LLM invocation | `invoke_agent` | `invoke_agent name` |
| `traceTool` | Tool / function calls invoked by agents | `execute_tool` | `execute_tool name` |

**Options:**

| Option | Type | Description |
|---|---|---|
| `version` | `number` | Version number, stored as `gen_ai.agent.version` or `gen_ai.entity.version`. |
| `description` | `string` | Tool description, stored as `gen_ai.tool.description` (`traceTool` only). |

**Span attributes set automatically:**

| Attribute | Set by |
|---|---|
| `gen_ai.operation.name` | all wrappers |
| `gen_ai.agent.name` | `traceWorkflow`, `traceTask`, `traceAgent` |
| `gen_ai.tool.name` | `traceTool` |
| `gen_ai.entity.input` / `gen_ai.entity.output` | `traceWorkflow`, `traceTask` |
| `gen_ai.tool.call.arguments` / `gen_ai.tool.call.result` | `traceTool` |
| `gen_ai.tool.type` | `traceTool` (always `"function"`) |
| `gen_ai.tool.description` | `traceTool` (from `options.description`) |
| `gen_ai.agent.version` / `gen_ai.entity.version` | all wrappers (when `version` is set) |

Errors are captured as span status `ERROR` with an exception event and re-thrown.

**Examples:**

<Tabs>
<TabItem label="Basic">
```typescript
import { traceWorkflow, traceTask, traceAgent, traceTool } from "opensearch-genai-sdk";

const runPipeline = traceWorkflow("qa_pipeline", (query: string) => {
  const plan = planSteps(query);
  return execute(plan);
});

const planSteps = traceTask("plan_steps", (query: string) => {
  return llm.generate(`Plan steps for: ${query}`);
});

const research = traceAgent("research_agent", async (query: string) => {
  const result = await searchTool(query);
  return summarize(result);
}, { version: 2 });

const searchTool = traceTool("web_search", (query: string) => {
  return searchApi.query(query);
}, { description: "Search the web for relevant documents" });
```
</TabItem>
<TabItem label="Async">
```typescript
import OpenAI from "openai";
const client = new OpenAI();

const runAgent = traceAgent("openai_agent", async (query: string) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: query }],
  });
  return response.choices[0].message.content ?? "";
});
```
</TabItem>
</Tabs>

---

### `score()`

Submits evaluation scores as OTEL spans. Works with any evaluation framework — pass the results
through `score()` and they flow through the same OTLP pipeline as all other traces.

**Three scoring levels:**

```typescript
import { score } from "opensearch-genai-sdk";

// Span-level: score a specific LLM call or tool execution
score({
  name: "accuracy",
  value: 0.95,
  traceId: "abc123",
  spanId: "def456",
  explanation: "Answer matches ground truth",
  source: "heuristic",
});

// Trace-level: score an entire workflow run
score({
  name: "relevance",
  value: 0.92,
  traceId: "abc123",
  explanation: "Response addresses the user's query",
  source: "llm-judge",
});

// Session-level: score across multiple traces in a conversation
score({
  name: "user_satisfaction",
  value: 0.88,
  conversationId: "session-123",
  label: "satisfied",
  source: "human",
});
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Metric name (e.g., `"relevance"`, `"factuality"`) |
| `value` | `number` | Numeric score |
| `traceId` | `string` | Trace being scored |
| `spanId` | `string` | Span being scored (span-level) |
| `conversationId` | `string` | Session ID (session-level) |
| `label` | `string` | Human-readable label (e.g., `"pass"`, `"relevant"`) |
| `explanation` | `string` | Evaluator rationale — truncated to 500 characters |
| `responseId` | `string` | LLM completion ID for correlation |
| `source` | `string` | Score origin: `"sdk"`, `"human"`, `"llm-judge"`, `"heuristic"` |
| `metadata` | `Record<string, unknown>` | Arbitrary key-value metadata |

---

## Auto-Instrumented Libraries

`register()` attempts to discover and activate any installed OTEL instrumentor packages. Install
the relevant package and LLM calls are traced automatically with no code changes.

| Library | Package |
|---|---|
| OpenAI | `@traceloop/instrumentation-openai` |
| Anthropic | `@traceloop/instrumentation-anthropic` |
| LangChain | `@traceloop/instrumentation-langchain` |
| HTTP calls | `@opentelemetry/instrumentation-http` |
| Fetch API | `@opentelemetry/instrumentation-fetch` |

To disable auto-instrumentation:
```typescript
register({ autoInstrument: false });
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `OPENSEARCH_OTEL_ENDPOINT` | OTLP endpoint URL | `http://localhost:21890/opentelemetry/v1/traces` |
| `OTEL_SERVICE_NAME` | Service name for all spans | `"default"` |
| `OPENSEARCH_PROJECT` | Project/service name (fallback) | `"default"` |

---

## Complete Example

```typescript
import OpenAI from "openai";
import { register, traceWorkflow, traceAgent, traceTool, score } from "opensearch-genai-sdk";

register({
  endpoint: process.env.OPENSEARCH_OTEL_ENDPOINT ?? "http://localhost:4318/v1/traces",
  projectName: "weather-app",
});

const client = new OpenAI();

const getWeather = traceTool(
  "get_weather",
  (city: string) => {
    // Real implementation would call a weather API
    return { city, temp: 22, condition: "sunny", humidity: 65 };
  },
  { description: "Fetch current weather conditions for a city" }
);

const formatResponse = traceTool(
  "format_response",
  (weather: { city: string; temp: number; condition: string; humidity: number }) => {
    return `${weather.city}: ${weather.condition}, ${weather.temp}°C, ${weather.humidity}% humidity`;
  },
  { description: "Format weather data into a human-readable string" }
);

const weatherAgent = traceAgent("weather_agent", async (query: string) => {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "Extract the city from the user's weather query." },
      { role: "user", content: query },
    ],
  });
  const city = response.choices[0].message.content?.trim() ?? "London";
  const weather = getWeather(city);
  return formatResponse(weather);
});

const runPipeline = traceWorkflow("weather_pipeline", async (query: string) => {
  return weatherAgent(query);
});

const result = await runPipeline("What's the weather like in Tokyo?");
console.log(result);

score({
  name: "answer_quality",
  value: 0.9,
  traceId: "<trace-id>",
  source: "llm-judge",
  explanation: "Response is accurate and well-formatted",
});
```
