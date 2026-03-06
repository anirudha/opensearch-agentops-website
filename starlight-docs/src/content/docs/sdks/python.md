---
title: "Python SDK"
description: "OTEL-native tracing and scoring for LLM applications — opensearch-genai-sdk-py"
---

import { Tabs, TabItem, Aside, Badge } from '@astrojs/starlight/components';

# Python SDK

`opensearch-genai-sdk-py` is an OpenTelemetry-native SDK for tracing and evaluating LLM applications.
Instrument your AI workflows with standard OTEL spans, auto-trace popular LLM libraries, and submit
evaluation scores — all routed to OpenSearch through a single OTLP pipeline.

**Key properties:**
- **Zero lock-in** — remove a decorator and your code still works; everything is standard OpenTelemetry
- **One-line setup** — `register()` configures the full OTEL pipeline
- **Auto-instrumentation** — discovers and activates installed instrumentor packages automatically
- **AWS-ready** — built-in SigV4 signing for OpenSearch Ingestion (OSIS) and OpenSearch Service

---

## Installation

```bash
pip install opensearch-genai-sdk-py
```

Auto-instrumentation of LLM libraries is opt-in. Install extras for the providers you use:

```bash
# Single provider
pip install "opensearch-genai-sdk-py[openai]"
pip install "opensearch-genai-sdk-py[anthropic]"
pip install "opensearch-genai-sdk-py[bedrock]"
pip install "opensearch-genai-sdk-py[langchain]"

# Multiple providers
pip install "opensearch-genai-sdk-py[openai,anthropic]"

# All instrumentors at once
pip install "opensearch-genai-sdk-py[instrumentors]"

# AWS SigV4 signing for OpenSearch Ingestion / OpenSearch Service
pip install "opensearch-genai-sdk-py[aws]"

# Everything
pip install "opensearch-genai-sdk-py[all]"
```

**Available extras:** `openai`, `anthropic`, `cohere`, `mistral`, `groq`, `ollama`, `google`, `bedrock`, `langchain`, `llamaindex`, `instrumentors` (all of the above), `aws`, `all`

**Requirements:** Python 3.10, 3.11, 3.12, or 3.13 · OpenTelemetry SDK ≥1.20.0

---

## Quick Start

```python
from opensearch_genai_sdk_py import register, workflow, agent, tool, score

# 1. Initialize tracing (once at startup)
register(endpoint="http://localhost:4318/v1/traces", service_name="my-app")

# 2. Decorate your functions
@tool(name="get_weather")
def get_weather(city: str) -> dict:
    """Fetch current weather for a city."""
    return {"city": city, "temp": 22, "condition": "sunny"}

@agent(name="weather_assistant")
def assistant(query: str) -> str:
    data = get_weather("Paris")
    return f"{data['condition']}, {data['temp']}C"

@workflow(name="weather_query")
def run(query: str) -> str:
    return assistant(query)

result = run("What's the weather in Paris?")

# 3. Submit an evaluation score
score(name="relevance", value=0.95, trace_id="...", source="llm-judge")
```

---

## How It Works

```
Your Application
  @workflow → @agent → @tool     score()
       │           │        │        │
       └───────────┴────────┴────────┘
                       │
              opensearch-genai-sdk-py
  ┌─────────────────────────────────────┐
  │  register()                          │
  │  TracerProvider                      │
  │  ├── Resource (service.name)         │
  │  ├── BatchSpanProcessor              │
  │  │   └── OTLPSpanExporter            │
  │  │       └── SigV4 (AWS endpoints)   │
  │  └── Auto-instrumentation            │
  │      └── openai, anthropic, ...      │
  └──────────────┬──────────────────────┘
                 │ OTLP (HTTP or gRPC)
                 ▼
        Data Prepper / OTEL Collector
                 │
                 ▼
            OpenSearch
            ├── traces
            └── scores
```

---

## API Reference

### `register()`

Configures the OTEL tracing pipeline. Call once at application startup.

```python
from opensearch_genai_sdk_py import register

register(
    endpoint="https://pipeline.us-east-1.osis.amazonaws.com/v1/traces",
    service_name="my-app",
    auth="auto",           # "auto" | "sigv4" | "none"
    batch=True,            # BatchSpanProcessor (True) or SimpleSpanProcessor (False)
    auto_instrument=True,  # discover and activate installed instrumentor packages
)
```

**Parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `endpoint` | `str` | `http://localhost:21890/opentelemetry/v1/traces` | OTLP endpoint URL. Override with `OPENSEARCH_OTEL_ENDPOINT` env var. |
| `protocol` | `"http"` \| `"grpc"` | inferred from URL | Force HTTP or gRPC transport. |
| `service_name` | `str` | `"default"` | Service name attached to all spans. Also reads `OTEL_SERVICE_NAME`. |
| `project_name` | `str` | `"default"` | Alias for `service_name`. |
| `auth` | `str` | `"auto"` | Authentication mode (see below). |
| `region` | `str` | auto-detected | AWS region for SigV4. |
| `service` | `str` | `"osis"` | AWS service name for SigV4 signing (`"osis"` or `"es"`). |
| `batch` | `bool` | `True` | Use `BatchSpanProcessor` (`True`) or `SimpleSpanProcessor` (`False`). |
| `auto_instrument` | `bool` | `True` | Discover and activate installed instrumentor packages. |
| `exporter` | `SpanExporter` | `None` | Custom exporter — overrides endpoint/auth/protocol. |
| `headers` | `dict` | `None` | Additional HTTP headers for the exporter. |

**Endpoint URL schemes:**

| Scheme | Transport |
|---|---|
| `http://` / `https://` | HTTP (default) |
| `grpc://` | gRPC (insecure) |
| `grpcs://` | gRPC with TLS |

**Auth modes:**

- `"auto"` — auto-detects AWS endpoints (`*.amazonaws.com`) and enables SigV4; plain HTTP otherwise
- `"sigv4"` — always use AWS SigV4 (requires `pip install opensearch-genai-sdk-py[aws]`)
- `"none"` — always plain HTTP, no signing

<Aside type="note">
SigV4 + gRPC is not currently supported. Use HTTP (`https://`) for AWS endpoints.
</Aside>

**Examples:**

<Tabs>
<TabItem label="Self-hosted">
```python
# Defaults to http://localhost:21890/opentelemetry/v1/traces
register(service_name="my-app")
```
</TabItem>
<TabItem label="AWS OSIS">
```python
register(
    endpoint="https://pipeline.us-east-1.osis.amazonaws.com/v1/traces",
    service_name="my-app",
    auth="sigv4",
    region="us-east-1",
)
```
</TabItem>
<TabItem label="gRPC">
```python
# Insecure gRPC
register(endpoint="grpc://localhost:4317", service_name="my-app")

# gRPC with TLS
register(endpoint="grpcs://otel-collector:4317", service_name="my-app")
```
</TabItem>
<TabItem label="Custom Exporter">
```python
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter

register(
    service_name="my-app",
    exporter=OTLPSpanExporter(endpoint="http://localhost:4318/v1/traces"),
)
```
</TabItem>
</Tabs>

---

### Decorators

Four decorators for tracing application logic. Each wraps a function in an OTEL span with
[GenAI semantic convention](https://opentelemetry.io/docs/specs/semconv/gen-ai/) attributes.
Supports sync functions, async functions, generators, and async generators.

| Decorator | Use for | Default SpanKind | `gen_ai.operation.name` |
|---|---|---|---|
| `@workflow` | Top-level orchestration | `INTERNAL` | `invoke_agent` |
| `@task` | Units of work within a workflow | `INTERNAL` | `invoke_agent` |
| `@agent` | Autonomous agent / LLM invocation | `CLIENT` | `invoke_agent` |
| `@tool` | Tool / function calls invoked by agents | `INTERNAL` | `execute_tool` |

**Parameters (all decorators):**

| Parameter | Type | Description |
|---|---|---|
| `name` | `str` | Span / entity name. Defaults to the function's `__qualname__`. |
| `version` | `int` | Optional version number, stored as `gen_ai.agent.version`. |
| `kind` | `SpanKind` | Override the OTel SpanKind. Uses the default for the decorator type if omitted. |
| `name_from` | `str` | Name of a function parameter whose runtime value becomes the entity/span name. Useful for dispatchers where the name isn't known until call time. |

**Span attributes set automatically:**

| Attribute | Decorators |
|---|---|
| `gen_ai.operation.name` | all |
| `gen_ai.agent.name` | `@workflow`, `@task`, `@agent` |
| `gen_ai.tool.name` | `@tool` |
| `gen_ai.agent.version` | all (when `version` is set) |
| `gen_ai.input.messages` | `@workflow`, `@task`, `@agent` |
| `gen_ai.output.messages` | `@workflow`, `@task`, `@agent` |
| `gen_ai.tool.call.arguments` | `@tool` |
| `gen_ai.tool.call.result` | `@tool` |
| `gen_ai.tool.type` | `@tool` (always `"function"`) |
| `gen_ai.tool.description` | `@tool` (first line of docstring) |

Errors are captured as span status `ERROR` with an exception event.

<Aside type="tip">
If you set `gen_ai.output.messages` (or `gen_ai.tool.call.result`) inside the function body yourself,
the decorator won't overwrite it — your custom value is preserved.
</Aside>

**Examples:**

<Tabs>
<TabItem label="Basic">
```python
from opensearch_genai_sdk_py import workflow, task, agent, tool

@workflow(name="qa_pipeline")
def run_pipeline(query: str) -> str:
    plan = plan_steps(query)
    return execute(plan)

@task(name="plan_steps")
def plan_steps(query: str) -> list:
    return llm.generate(f"Plan steps for: {query}")

@agent(name="research_agent", version=2)
async def research(query: str) -> str:
    result = await search_tool(query)
    return summarize(result)

@tool(name="web_search")
def search_tool(query: str) -> list[dict]:
    """Search the web for relevant documents."""
    return search_api.query(query)
```
</TabItem>
<TabItem label="Async">
```python
@agent(name="async_agent")
async def run_agent(query: str) -> str:
    response = await openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": query}],
    )
    return response.choices[0].message.content
```
</TabItem>
<TabItem label="Streaming">
```python
@agent(name="streaming_agent")
def stream_response(query: str):
    """Generator functions are fully supported."""
    for chunk in openai_client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": query}],
        stream=True,
    ):
        yield chunk.choices[0].delta.content or ""
```
</TabItem>
<TabItem label="Dynamic name_from">
```python
# Dispatcher tool — actual tool name is a runtime argument
@tool(name_from="tool_name")
def execute_tool(self, tool_name: str, arguments: dict) -> dict:
    """Routes calls to the appropriate tool implementation."""
    return self._tools[tool_name](**arguments)
```
</TabItem>
</Tabs>

---

### `score()`

Submits evaluation scores as OTEL spans. Works with any evaluation framework — pass the results
through `score()` and they flow through the same OTLP pipeline as all other traces.

**Three scoring levels:**

```python
from opensearch_genai_sdk_py import score

# Span-level: score a specific LLM call or tool execution
score(
    name="accuracy",
    value=0.95,
    trace_id="abc123",
    span_id="def456",
    explanation="Answer matches ground truth",
    source="heuristic",
)

# Trace-level: score an entire workflow run
score(
    name="relevance",
    value=0.92,
    trace_id="abc123",
    explanation="Response addresses the user's query",
    source="llm-judge",
)

# Session-level: score across multiple traces in a conversation
score(
    name="user_satisfaction",
    value=0.88,
    conversation_id="session-123",
    label="satisfied",
    source="human",
)
```

**Parameters:**

| Parameter | Type | Description |
|---|---|---|
| `name` | `str` | Metric name (e.g., `"relevance"`, `"factuality"`) |
| `value` | `float` | Numeric score |
| `trace_id` | `str` | Trace being scored — stored as an attribute, not the span's own trace ID |
| `span_id` | `str` | Span being scored (span-level scoring) |
| `conversation_id` | `str` | Session/conversation ID (session-level scoring) |
| `label` | `str` | Human-readable label (e.g., `"pass"`, `"relevant"`) |
| `explanation` | `str` | Evaluator rationale — truncated to 500 characters |
| `response_id` | `str` | LLM completion ID for correlation |
| `source` | `str` | Score origin: `"sdk"`, `"human"`, `"llm-judge"`, `"heuristic"` |
| `metadata` | `dict` | Arbitrary key-value metadata |

Scores are emitted as `gen_ai.evaluation.result` spans with `gen_ai.evaluation.*` attributes.

---

### `AWSSigV4OTLPExporter`

A drop-in `OTLPSpanExporter` that signs every request with AWS SigV4. Used automatically by
`register()` when `auth="sigv4"` or when an `*.amazonaws.com` endpoint is detected with `auth="auto"`.

```python
from opensearch_genai_sdk_py import AWSSigV4OTLPExporter, register

exporter = AWSSigV4OTLPExporter(
    endpoint="https://pipeline.us-east-1.osis.amazonaws.com/v1/traces",
    service="osis",   # "osis" for OpenSearch Ingestion, "es" for OpenSearch Service
    region="us-east-1",
)

register(service_name="my-app", exporter=exporter)
```

Credentials are resolved automatically via the standard botocore credential chain:
environment variables → `~/.aws/credentials` → IAM role → IMDS.

---

## Auto-Instrumented Libraries

`register()` automatically discovers and activates any installed instrumentor packages via OTEL
entry points. Install the extras for the providers you use and their calls are traced with no
additional code changes.

| Category | Extras |
|---|---|
| LLM providers | `[openai]`, `[anthropic]`, `[cohere]`, `[mistral]`, `[groq]`, `[ollama]` |
| Cloud AI | `[bedrock]`, `[google]` (Vertex AI + Generative AI) |
| Frameworks | `[langchain]`, `[llamaindex]` |
| All of the above + more | `[instrumentors]` |

The `[instrumentors]` bundle also includes: Together, Replicate, Writer, Voyage AI, Aleph Alpha,
SageMaker, watsonx, Haystack, CrewAI, Agno, MCP, Transformers, ChromaDB, Pinecone, Qdrant,
Weaviate, Milvus, LanceDB, Marqo.

To disable auto-instrumentation:
```python
register(auto_instrument=False)
```

---

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `OPENSEARCH_OTEL_ENDPOINT` | OTLP endpoint URL | `http://localhost:21890/opentelemetry/v1/traces` |
| `OTEL_SERVICE_NAME` | Service name for all spans | `"default"` |
| `OPENSEARCH_PROJECT` | Project/service name (fallback) | `"default"` |
| `AWS_DEFAULT_REGION` | AWS region for SigV4 signing | auto-detected from botocore |
| `AWS_ACCESS_KEY_ID` | AWS access key | botocore credential chain |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key | botocore credential chain |

---

## Complete Example

The following example shows a multi-step agent workflow with OpenAI auto-instrumentation,
decorator-based tracing, and evaluation scoring.

```python
import os
from openai import OpenAI
from opensearch_genai_sdk_py import register, workflow, agent, tool, score

# Initialize — auto-detects OpenAI if opentelemetry-instrumentation-openai is installed
register(
    endpoint=os.environ.get("OPENSEARCH_OTEL_ENDPOINT", "http://localhost:4318/v1/traces"),
    service_name="weather-app",
)

client = OpenAI()

@tool(name="get_weather")
def get_weather(city: str) -> dict:
    """Fetch current weather conditions for a city."""
    # Real implementation would call a weather API
    return {"city": city, "temp": 22, "condition": "sunny", "humidity": 65}

@tool(name="format_response")
def format_response(weather: dict) -> str:
    """Format weather data into a human-readable string."""
    return f"{weather['city']}: {weather['condition']}, {weather['temp']}°C, {weather['humidity']}% humidity"

@agent(name="weather_agent")
def weather_agent(query: str) -> str:
    # LLM call is auto-traced by the OpenAI instrumentor
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "Extract the city from the user's weather query."},
            {"role": "user", "content": query},
        ],
    )
    city = response.choices[0].message.content.strip()
    weather = get_weather(city)
    return format_response(weather)

@workflow(name="weather_pipeline")
def run(query: str) -> str:
    return weather_agent(query)

# Run the pipeline
result = run("What's the weather like in Tokyo?")
print(result)

# Submit evaluation score
score(
    name="answer_quality",
    value=0.9,
    trace_id="<trace-id-from-span-context>",
    source="llm-judge",
    explanation="Response is accurate and well-formatted",
)
```
