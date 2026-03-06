---
title: "FAQ"
description: "Frequently asked questions about the OpenSearch AI Observability SDKs"
---

import { Aside } from '@astrojs/starlight/components';

# FAQ

## General

### Do I need to modify my LLM library calls to get traces?

No. `register()` auto-discovers and activates installed instrumentor packages via OTEL entry
points. Install the extra for your LLM provider and its calls are traced automatically:

```bash
# Python
pip install "opensearch-genai-sdk-py[openai]"
pip install "opensearch-genai-sdk-py[anthropic]"

# JavaScript — install the instrumentor directly
npm install @traceloop/instrumentation-openai
```

You only need the decorators (`@workflow`, `@agent`, `@tool`, etc.) for your own application
code — the orchestration logic that sits above the raw LLM calls.

---

### What happens if I remove a decorator?

Nothing breaks. The decorators are pure wrappers — they call your original function and return
its result unchanged. Removing `@tool` from a function makes it a plain function again.
There are no SDK calls embedded inside your application logic.

---

### Does the SDK work with async functions?

Yes. The Python SDK handles sync functions, async functions (`async def`), sync generators, and
async generators. The JavaScript SDK handles both sync and async functions.

---

### Can I use the SDK without sending data to AWS?

Yes. `register()` defaults to `auth="auto"`, which only enables SigV4 for `*.amazonaws.com`
endpoints. For self-hosted OpenSearch or any non-AWS endpoint, no signing is applied:

```python
# Self-hosted — plain HTTP, no signing needed
register(endpoint="http://my-collector:4318/v1/traces")
```

---

### What is the performance overhead?

Span creation is synchronous and fast (microseconds). The `BatchSpanProcessor` (default) exports
spans in the background on a separate thread/async task, so your application code is not blocked
waiting for network I/O. Set `batch=False` only when debugging to see spans exported immediately.

---

## Python SDK

### Why does `@agent` default to `SpanKind.CLIENT` instead of `INTERNAL`?

Agent invocations typically represent a call out to an external LLM or agent service — the same
semantic as an HTTP client call. `SpanKind.CLIENT` correctly signals to backends that this span
is an outbound call, which affects how distributed traces are stitched together.

You can override this per-decorator: `@agent(kind=SpanKind.INTERNAL)`.

---

### How do I trace a dispatcher method where the tool name is dynamic?

Use `name_from` to resolve the span name from a runtime argument:

```python
@tool(name_from="tool_name")
def execute_tool(self, tool_name: str, arguments: dict) -> dict:
    """Routes to the appropriate tool implementation."""
    return self._tools[tool_name](**arguments)
```

Each call to `execute_tool` creates a span named `execute_tool <actual_tool_name>`.

---

### Why does `gen_ai.tool.description` only show the first line of the docstring?

The full docstring can be many lines and verbose. The `gen_ai.tool.description` semantic
convention attribute is intended to be a short description of what the tool does. Using only
the first non-empty line of the docstring keeps traces readable in OpenSearch Dashboards.

---

### Can I set span attributes inside my function?

Yes. Use `opentelemetry.trace.get_current_span()` inside your decorated function:

```python
from opentelemetry import trace

@agent(name="my_agent")
def my_agent(query: str) -> str:
    span = trace.get_current_span()
    span.set_attribute("my.custom.attribute", "value")
    result = do_work(query)
    # Setting gen_ai.output.messages here prevents the decorator from overwriting it
    span.set_attribute("gen_ai.output.messages", json.dumps([{"role": "assistant", "content": result}]))
    return result
```

The `_set_output` helper checks whether you've already set the output attribute and skips
overwriting if so, preserving your custom formatting.

---

### How do I use gRPC instead of HTTP?

Prefix the endpoint URL with `grpc://` (insecure) or `grpcs://` (TLS):

```python
register(endpoint="grpc://localhost:4317")
register(endpoint="grpcs://otel-collector:4317")
```

<Aside type="caution">
SigV4 + gRPC is not currently supported. Use HTTPS for AWS endpoints.
</Aside>

---

### What Python versions are supported?

Python 3.10, 3.11, 3.12, and 3.13.

---

## JavaScript SDK

### What Node.js version is required?

Node.js 18 or later.

---

### How are auto-instrumented libraries discovered in JavaScript?

The SDK attempts to dynamically require known instrumentor packages at startup. If a package is
installed, it is activated; if not, it is silently skipped. There is no entry-point discovery
mechanism like Python's `opentelemetry_instrumentor` group — you need to install the specific
packages you want.

---

### Does the JavaScript SDK support streaming responses?

The `traceAgent` and `traceWorkflow` wrappers support async functions but not async generators
(streaming). For streaming, call `register()` to enable auto-instrumentation of the underlying
LLM client, which handles streaming spans natively.

---

## Scoring

### What is the difference between span-level, trace-level, and session-level scoring?

| Level | What to pass | Use for |
|---|---|---|
| Span-level | `trace_id` + `span_id` / `traceId` + `spanId` | Scoring a specific LLM call or tool execution |
| Trace-level | `trace_id` / `traceId` only | Scoring an entire workflow run end-to-end |
| Session-level | `conversation_id` / `conversationId` | Scoring across multiple traces in a conversation |

---

### Where do I get the trace ID from?

From the span context of the currently active span:

```python
from opentelemetry import trace

@workflow(name="my_pipeline")
def run(query: str) -> str:
    ctx = trace.get_current_span().get_span_context()
    trace_id = format(ctx.trace_id, "032x")
    result = do_work(query)
    # Now score with this trace_id after the workflow completes
    return result
```

---

### Do scores appear in the same index as traces in OpenSearch?

Yes. Scores are emitted as standard OTEL spans (`gen_ai.evaluation.result`) through the same
OTLP pipeline. They land in the same index as all other spans and can be queried together in
OpenSearch Dashboards.

---

## AWS / SigV4

### What AWS credentials does `AWSSigV4OTLPExporter` use?

It resolves credentials via the standard botocore credential chain, in order:

1. `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` environment variables
2. `~/.aws/credentials` file
3. `~/.aws/config` file
4. IAM role attached to the instance / container (IMDS / ECS task role)

---

### What `service` value should I use for SigV4?

| Destination | `service` value |
|---|---|
| OpenSearch Ingestion (OSIS) pipeline | `"osis"` (default) |
| OpenSearch Service domain direct ingest | `"es"` |

---

### Why do I get `403 SignatureDoesNotMatch`?

The most common cause is a body-hash mismatch. The Python SDK signs over the actual serialized
protobuf body (not an empty body), so this should not happen with `AWSSigV4OTLPExporter`.
If you see this error, check:
- The region matches the endpoint region
- The credentials have `osis:Ingest` (or `es:ESHttpPost`) permission
- You are not using a custom `session=` that modifies the body after signing
