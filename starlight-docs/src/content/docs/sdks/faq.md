---
title: "FAQ"
description: "Common questions about the OpenSearch AI Observability SDKs"
---

## Do I need to modify my LLM library calls to get traces?

No. `register()` auto-discovers installed instrumentor packages and activates them. Install the extra for your provider and its calls are traced with no code changes:

```bash
pip install "opensearch-genai-sdk-py[openai]"
```

The decorators (`@workflow`, `@agent`, `@tool`) are only for your own application logic — the orchestration code above the raw LLM calls.

## What happens if I remove a decorator?

Nothing breaks. The decorators call your original function and return its result unchanged. Remove `@tool` and the function is a plain function again. No SDK calls are embedded inside your logic.

## Can I use the SDK without sending data to AWS?

Yes. `auth="auto"` (the default) only enables SigV4 for `*.amazonaws.com` endpoints. For self-hosted OpenSearch or any non-AWS endpoint, no signing is applied:

```python
register(endpoint="http://my-collector:4318/v1/traces")
```

## What is the performance overhead?

Span creation takes microseconds. The `BatchSpanProcessor` (default) exports in the background, so your code is never blocked waiting on network I/O. Use `batch=False` only when debugging to see spans flush immediately.

## Why does `@agent` default to `SpanKind.CLIENT`?

Agent invocations typically represent a call out to an external LLM or service — the same semantic as an HTTP client call. `SpanKind.CLIENT` signals to backends that this span is an outbound call, which affects how distributed traces are stitched together.

Override it per-decorator if needed: `@agent(kind=SpanKind.INTERNAL)`.

## How do I trace a dispatcher where the tool name is dynamic? (Python)

Use `name_from` to resolve the span name from a runtime argument:

```python
@tool(name_from="tool_name")
def execute_tool(self, tool_name: str, arguments: dict) -> dict:
    return self._tools[tool_name](**arguments)
```

Each call creates a span named `execute_tool <actual_tool_name>`.

## How do I get the trace ID to pass to `score()`?

Read it from the active span context:

```python
from opentelemetry import trace

@workflow(name="my_pipeline")
def run(query: str) -> str:
    ctx = trace.get_current_span().get_span_context()
    trace_id = format(ctx.trace_id, "032x")
    result = do_work(query)
    return result
```

## Do scores appear in the same index as traces in OpenSearch?

Yes. Scores are standard OTEL spans (`gen_ai.evaluation.result`) and travel through the same OTLP pipeline. They land in the same index and can be queried alongside traces in OpenSearch Dashboards.

## Why do I get `403 SignatureDoesNotMatch` from AWS?

Check that:
- The `region` matches the endpoint's region
- Your credentials have `osis:Ingest` permission (or `es:ESHttpPost` for OpenSearch Service)
- You are using `https://` (HTTP), not `grpc://` — SigV4 + gRPC is not supported

## What `service` value should I use for SigV4?

| Destination | `service` value |
|---|---|
| OpenSearch Ingestion (OSIS) pipeline | `"osis"` (default) |
| OpenSearch Service domain | `"es"` |
