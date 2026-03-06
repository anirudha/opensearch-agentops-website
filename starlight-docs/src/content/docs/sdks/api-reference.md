---
title: "API Reference"
description: "Complete API reference for opensearch-genai-sdk-py and opensearch-genai-sdk"
---

import { Tabs, TabItem } from '@astrojs/starlight/components';

# API Reference

Complete reference for all public functions and classes in the OpenSearch AI Observability SDKs.

---

## `register()`

Configures the OTEL tracing pipeline. Call once at application startup before any tracing occurs.

<Tabs>
<TabItem label="Python">
```python
from opensearch_genai_sdk_py import register

provider = register(
    endpoint="http://localhost:4318/v1/traces",
    service_name="my-app",
    auth="auto",
    region=None,
    service="osis",
    batch=True,
    auto_instrument=True,
    exporter=None,
    set_global=True,
    headers=None,
)
```

**Returns:** `opentelemetry.sdk.trace.TracerProvider`

| Parameter | Type | Default | Description |
|---|---|---|---|
| `endpoint` | `str` | `http://localhost:21890/opentelemetry/v1/traces` | OTLP endpoint. Also reads `OPENSEARCH_OTEL_ENDPOINT`. |
| `protocol` | `"http"` \| `"grpc"` | inferred | Force HTTP or gRPC transport. Inferred from URL scheme if omitted (`grpc://` → gRPC, else HTTP). |
| `service_name` | `str` | `"default"` | Service name on all spans. Also reads `OTEL_SERVICE_NAME`. |
| `project_name` | `str` | `"default"` | Alias for `service_name`. |
| `auth` | `str` | `"auto"` | `"auto"` / `"sigv4"` / `"none"` — see Auth section below. |
| `region` | `str` | auto | AWS region for SigV4. Auto-detected from botocore if not set. |
| `service` | `str` | `"osis"` | AWS service name for signing. `"osis"` for OpenSearch Ingestion, `"es"` for OpenSearch Service. |
| `batch` | `bool` | `True` | `True` → `BatchSpanProcessor`. `False` → `SimpleSpanProcessor` (useful for debugging). |
| `auto_instrument` | `bool` | `True` | Discover and activate installed OTEL instrumentor packages. |
| `exporter` | `SpanExporter` | `None` | Custom exporter — bypasses endpoint/auth/protocol. |
| `set_global` | `bool` | `True` | Register as the global `TracerProvider`. |
| `headers` | `dict` | `None` | Additional HTTP headers for the exporter. |
</TabItem>
<TabItem label="JavaScript">
```typescript
import { register } from "opensearch-genai-sdk";

register({
  endpoint: "http://localhost:4318/v1/traces",
  projectName: "my-app",
  auth: "auto",
  batch: true,
  autoInstrument: true,
});
```

| Option | Type | Default | Description |
|---|---|---|---|
| `endpoint` | `string` | `http://localhost:21890/opentelemetry/v1/traces` | OTLP endpoint. Also reads `OPENSEARCH_OTEL_ENDPOINT`. |
| `projectName` | `string` | `"default"` | Service name on all spans. Also reads `OTEL_SERVICE_NAME`. |
| `auth` | `string` | `"auto"` | `"auto"` / `"sigv4"` / `"none"`. |
| `batch` | `boolean` | `true` | `true` → `BatchSpanProcessor`. `false` → `SimpleSpanProcessor`. |
| `autoInstrument` | `boolean` | `true` | Discover and activate installed OTEL instrumentor packages. |
| `exporter` | `SpanExporter` | — | Custom exporter — bypasses endpoint/auth. |
</TabItem>
</Tabs>

**Auth modes:**

| Value | Behavior |
|---|---|
| `"auto"` | Auto-detects `*.amazonaws.com` endpoints and enables SigV4; plain HTTP for everything else. |
| `"sigv4"` | Always use AWS SigV4. Python requires `pip install opensearch-genai-sdk-py[aws]`. |
| `"none"` | Always plain HTTP, no signing. |

**URL scheme → protocol mapping (Python only):**

| Scheme | Transport |
|---|---|
| `http://` / `https://` | HTTP |
| `grpc://` | gRPC (insecure) |
| `grpcs://` | gRPC with TLS |

---

## Trace Wrappers / Decorators

### `@workflow` / `traceWorkflow`

Traces a top-level orchestration function.

<Tabs>
<TabItem label="Python">
```python
from opensearch_genai_sdk_py import workflow

@workflow(name="pipeline", version=1)
def run_pipeline(query: str) -> str:
    ...
```
</TabItem>
<TabItem label="JavaScript">
```typescript
import { traceWorkflow } from "opensearch-genai-sdk";

const runPipeline = traceWorkflow("pipeline", (query: string) => {
  // ...
}, { version: 1 });
```
</TabItem>
</Tabs>

### `@task` / `traceTask`

Traces a unit of work within a workflow.

<Tabs>
<TabItem label="Python">
```python
from opensearch_genai_sdk_py import task

@task(name="summarize")
def summarize_text(text: str) -> str:
    ...
```
</TabItem>
<TabItem label="JavaScript">
```typescript
import { traceTask } from "opensearch-genai-sdk";

const summarize = traceTask("summarize", (text: string) => {
  // ...
});
```
</TabItem>
</Tabs>

### `@agent` / `traceAgent`

Traces autonomous agent logic. Defaults to `SpanKind.CLIENT` (Python) because agent invocations typically represent a call out to an external LLM or service.

<Tabs>
<TabItem label="Python">
```python
from opensearch_genai_sdk_py import agent

@agent(name="research_agent", version=2)
async def research(query: str) -> str:
    ...
```
</TabItem>
<TabItem label="JavaScript">
```typescript
import { traceAgent } from "opensearch-genai-sdk";

const research = traceAgent("research_agent", async (query: string) => {
  // ...
}, { version: 2 });
```
</TabItem>
</Tabs>

### `@tool` / `traceTool`

Traces a tool or function call invoked by an agent.

<Tabs>
<TabItem label="Python">
```python
from opensearch_genai_sdk_py import tool

@tool(name="web_search")
def search(query: str) -> list[dict]:
    """Search the web for documents."""
    ...

# Dynamic name from a runtime argument (dispatcher pattern)
@tool(name_from="tool_name")
def execute_tool(self, tool_name: str, arguments: dict) -> dict:
    ...
```
</TabItem>
<TabItem label="JavaScript">
```typescript
import { traceTool } from "opensearch-genai-sdk";

const search = traceTool("web_search", (query: string) => {
  // ...
}, { description: "Search the web for documents" });
```
</TabItem>
</Tabs>

**Decorator / wrapper parameters:**

| Parameter | Python | JavaScript | Description |
|---|---|---|---|
| `name` | `name=` | first arg | Span / entity name. Defaults to function name. |
| `version` | `version=` | `options.version` | Version number → `gen_ai.agent.version` or `gen_ai.entity.version`. |
| `kind` | `kind=` | — | Override OTel `SpanKind`. Python only. |
| `name_from` | `name_from=` | — | Resolve name from a runtime argument. Python only. |
| `description` | — | `options.description` | Tool description → `gen_ai.tool.description`. JavaScript only. |

**Span attributes:**

| Attribute | Set by |
|---|---|
| `gen_ai.operation.name` | all |
| `gen_ai.agent.name` | `workflow`, `task`, `agent` |
| `gen_ai.tool.name` | `tool` |
| `gen_ai.agent.version` / `gen_ai.entity.version` | all (when `version` set) |
| `gen_ai.input.messages` / `gen_ai.entity.input` | `workflow`, `task`, `agent` |
| `gen_ai.output.messages` / `gen_ai.entity.output` | `workflow`, `task`, `agent` |
| `gen_ai.tool.call.arguments` | `tool` |
| `gen_ai.tool.call.result` | `tool` |
| `gen_ai.tool.type` | `tool` (always `"function"`) |
| `gen_ai.tool.description` | `tool` (from docstring/options) |

---

## `score()`

Submits an evaluation score as an OTEL span.

<Tabs>
<TabItem label="Python">
```python
from opensearch_genai_sdk_py import score

score(
    name="relevance",
    value=0.92,
    trace_id="abc123",
    span_id="def456",
    conversation_id=None,
    label="relevant",
    explanation="Addresses the user's question",
    response_id=None,
    source="llm-judge",
    metadata={"model": "gpt-4o"},
)
```

| Parameter | Type | Description |
|---|---|---|
| `name` | `str` | Metric name. |
| `value` | `float` | Numeric score. |
| `trace_id` | `str` | Trace being scored (span/trace-level). |
| `span_id` | `str` | Span being scored (span-level). |
| `conversation_id` | `str` | Session ID (session-level). |
| `label` | `str` | Human-readable label. |
| `explanation` | `str` | Evaluator rationale (max 500 chars). |
| `response_id` | `str` | LLM completion ID. |
| `source` | `str` | `"sdk"` / `"human"` / `"llm-judge"` / `"heuristic"`. |
| `metadata` | `dict` | Arbitrary key-value metadata. |
</TabItem>
<TabItem label="JavaScript">
```typescript
import { score } from "opensearch-genai-sdk";

score({
  name: "relevance",
  value: 0.92,
  traceId: "abc123",
  spanId: "def456",
  conversationId: undefined,
  label: "relevant",
  explanation: "Addresses the user's question",
  responseId: undefined,
  source: "llm-judge",
  metadata: { model: "gpt-4o" },
});
```

| Parameter | Type | Description |
|---|---|---|
| `name` | `string` | Metric name. |
| `value` | `number` | Numeric score. |
| `traceId` | `string` | Trace being scored. |
| `spanId` | `string` | Span being scored (span-level). |
| `conversationId` | `string` | Session ID (session-level). |
| `label` | `string` | Human-readable label. |
| `explanation` | `string` | Evaluator rationale (max 500 chars). |
| `responseId` | `string` | LLM completion ID. |
| `source` | `string` | `"sdk"` / `"human"` / `"llm-judge"` / `"heuristic"`. |
| `metadata` | `Record<string, unknown>` | Arbitrary key-value metadata. |
</TabItem>
</Tabs>

Scores emit a `gen_ai.evaluation.result` span with `gen_ai.evaluation.*` attributes.

---

## `AWSSigV4OTLPExporter` (Python only)

A drop-in replacement for `OTLPSpanExporter` that signs every request with AWS SigV4.
Used automatically by `register()` when `auth="sigv4"` or when an AWS endpoint is auto-detected.

```python
from opensearch_genai_sdk_py import AWSSigV4OTLPExporter, register

exporter = AWSSigV4OTLPExporter(
    endpoint="https://pipeline.us-east-1.osis.amazonaws.com/v1/traces",
    service="osis",       # "osis" for OpenSearch Ingestion, "es" for OpenSearch Service
    region="us-east-1",   # auto-detected from botocore if omitted
)

register(service_name="my-app", exporter=exporter)
```

| Parameter | Type | Default | Description |
|---|---|---|---|
| `endpoint` | `str` | — | OTLP endpoint URL. |
| `service` | `str` | `"osis"` | AWS service name for signing. |
| `region` | `str` | auto | AWS region. Auto-detected from botocore if not provided. |

Requires `pip install opensearch-genai-sdk-py[aws]`. Credentials are resolved via the standard
botocore chain: env vars → `~/.aws/credentials` → IAM role → IMDS.

---

## Environment Variables

| Variable | SDKs | Description | Default |
|---|---|---|---|
| `OPENSEARCH_OTEL_ENDPOINT` | both | OTLP endpoint URL | `http://localhost:21890/opentelemetry/v1/traces` |
| `OTEL_SERVICE_NAME` | both | Service name for all spans | `"default"` |
| `OPENSEARCH_PROJECT` | both | Project/service name (fallback to `OTEL_SERVICE_NAME`) | `"default"` |
| `AWS_DEFAULT_REGION` | Python | AWS region for SigV4 | auto-detected |
| `AWS_ACCESS_KEY_ID` | Python | AWS access key | botocore credential chain |
| `AWS_SECRET_ACCESS_KEY` | Python | AWS secret key | botocore credential chain |
