---
title: "Explore Traces"
description: "Investigate distributed traces in Discover using PPL — trace request flows, identify latency bottlenecks, correlate across signals, and detect anomalies"
---

Traces capture the journey of a request as it flows through your distributed system. Each trace is composed of spans — individual units of work performed by a service. In OpenSearch, the Discover experience for traces uses PPL to query span data, identify latency bottlenecks, and correlate failures across services.

## Getting started in Discover

1. Open **Discover** from the left navigation
2. Select your trace index pattern (e.g., `otel-v1-apm-span-*`)
3. Set your time range using the date picker
4. Enter a PPL query in the query bar and run it

Each row in the results represents a single span. Expand a row to see all span attributes including timing, status, and resource metadata.

## Common fields in OTEL span data

| Field | Description |
|---|---|
| `traceId` | Unique identifier for the entire trace |
| `spanId` | Unique identifier for this span |
| `parentSpanId` | The parent span (empty for root spans) |
| `serviceName` | Service that produced this span |
| `name` | The operation or endpoint name |
| `durationInNanos` | Span duration in nanoseconds |
| `status.code` | Span status — UNSET, OK, or ERROR |
| `kind` | Span kind — SERVER, CLIENT, INTERNAL, PRODUCER, CONSUMER |
| `resource.attributes.*` | Resource-level attributes |
| `span.attributes.*` | Span-level attributes (HTTP method, URL, status code, etc.) |

## Searching and filtering traces

### Find slow spans

```sql
source = otel-v1-apm-span-*
| where durationInNanos > 5000000000
| fields traceId, serviceName, name, durationInNanos, status.code
| sort - durationInNanos
| head 20
```

5,000,000,000 nanoseconds = 5 seconds. Adjust the threshold to match your SLOs.

### Filter by service and operation

```sql
search earliest=-1h source = otel-v1-apm-span-*
| where serviceName = 'frontend'
      AND name LIKE '%/api/%'
| fields traceId, name, durationInNanos, status.code
| sort - durationInNanos
```

### Find error spans

```sql
source = otel-v1-apm-span-*
| where status.code = 'ERROR'
| fields traceId, serviceName, name, durationInNanos
| sort - durationInNanos
| head 50
```

### Root spans only (entry points)

```sql
source = otel-v1-apm-span-*
| where parentSpanId = '' OR parentSpanId IS NULL
| fields traceId, serviceName, name, durationInNanos, status.code
| sort - durationInNanos
| head 30
```

Root spans represent the entry point of a request — typically the first service that received the call.

## Tracing a request flow

### Follow a single trace end-to-end

```sql
source = otel-v1-apm-span-*
| where traceId = '<your-trace-id>'
| fields serviceName, name, spanId, parentSpanId, durationInNanos, status.code
| sort - durationInNanos
```

This gives you the full span tree for a trace, ordered chronologically. Walk through it to see exactly which services were called, in what order, and how long each took.

### Service call chain for a trace

```sql
source = otel-v1-apm-span-*
| where traceId = '<your-trace-id>'
| stats count() as spanCount,
        sum(durationInNanos) as totalDuration,
        max(durationInNanos) as slowestSpan
        by serviceName
| sort - totalDuration
```

This shows which services contributed the most time to the trace.

## Latency analysis

### Latency distribution by service

```sql
search earliest=-6h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| stats avg(durationMs) as avgLatency,
        min(durationMs) as minLatency,
        max(durationMs) as maxLatency,
        count() as spanCount
        by serviceName
| sort - avgLatency
```

### Latency percentiles by operation

```sql
search earliest=-6h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| stats avg(durationMs) as p50,
        max(durationMs) as pMax,
        count() as spanCount
        by serviceName, name
| where spanCount > 10
| sort - p50
| head 20
```

### Latency over time

```sql
search earliest=-6h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| timechart span=5m avg(durationMs) by serviceName
```

Visualize this as a line chart to spot latency trends per service over time.

### Latency buckets (histogram)

```sql
search earliest=-6h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| bin durationMs span=100
| stats count() as spanCount by durationMs
| sort durationMs
```

This creates a histogram of span durations in 100ms buckets — useful for understanding the shape of your latency distribution and spotting bimodal patterns.

## Correlating traces with logs

The `traceId` field is the bridge between traces and logs. Use it to get the full picture of what happened during a request.

### Find logs for a slow trace

```sql
source = logs-otel-v1*
| where traceId = '<your-trace-id>'
| fields @timestamp, spanId, severity.text, body, `resource.attributes.service.name`
| sort @timestamp
```

### Traces with both span errors and log errors

```sql
source = otel-v1-apm-span-* as a
| where status.code = 'ERROR'
| left join ON a.traceId = b.traceId
    [ source = logs-otel-v1*
      | where severityNumber >= 17
      | stats count() as logErrorCount,
              values(`resource.attributes.service.name`) as errorServices
              by traceId
    ] as b
| where b.logErrorCount > 0
| fields a.traceId, a.serviceName, a.name, a.durationInNanos, b.logErrorCount, b.errorServices
| sort - b.logErrorCount
| head 20
```

This finds traces where both the span reported an error status and the logs contain error entries — the strongest signal of a real problem.

### Service dependency analysis

See which services call which other services based on span parent-child relationships:

```sql
source = otel-v1-apm-span-* as a
| where parentSpanId != '' AND parentSpanId IS NOT NULL
| left join ON a.parentSpanId = b.spanId
    [ source = otel-v1-apm-span-*
      | fields spanId, serviceName
    ] as b
| where b.serviceName IS NOT NULL AND a.serviceName != b.serviceName
| stats count() as callCount,
        avg(a.durationInNanos) as avgLatency
        by b.serviceName, a.serviceName
| sort - callCount
```

This maps caller → callee relationships with call frequency and average latency — a lightweight service dependency map built from trace data.

## Identifying outliers

### Abnormally slow spans

Use eventstats to compare each span's duration against its operation's average:

```sql
search earliest=-6h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| eventstats avg(durationMs) as avgDuration,
              stddev(durationMs) as stddevDuration
              by serviceName, name
| eval zScore = (durationMs - avgDuration) / stddevDuration
| where zScore > 3
| fields traceId, serviceName, name, durationMs, avgDuration, zScore
| sort - zScore
| head 20
```

Spans with a z-score above 3 are statistical outliers — they took significantly longer than normal for that operation.

### Services with abnormal error rates

```sql
search earliest=-6h source = otel-v1-apm-span-*
| eventstats count() as totalSpans,
              count(status.code = 'ERROR') as errorSpans
              by serviceName
| eval errorRate = errorSpans * 100.0 / totalSpans
| stats avg(errorRate) as serviceErrorRate by serviceName
| eventstats avg(serviceErrorRate) as globalAvgRate, stddev(serviceErrorRate) as stddevRate
| eval zScore = (serviceErrorRate - globalAvgRate) / stddevRate
| where zScore > 2
| sort - zScore
```

### Detect latency spikes over time

```sql
search earliest=-12h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| timechart span=10m avg(durationMs) as avgLatency
| trendline sort + @timestamp sma(6, avgLatency) as latencyTrend
| eval spikeRatio = avgLatency / latencyTrend
| where spikeRatio > 1.5
| fields @timestamp, avgLatency, latencyTrend, spikeRatio
```

Flags time windows where average latency is 50% or more above the moving average.

### Operations that suddenly started failing

```sql
search earliest=-1h source = otel-v1-apm-span-*
| where status.code = 'ERROR'
| stats count() as recentErrors by serviceName, name
| left join ON a.serviceName = b.serviceName AND a.name = b.name
    [ search earliest=-24h latest=-1h source = otel-v1-apm-span-*
      | where status.code = 'ERROR'
      | stats count() as priorErrors by serviceName, name
    ] as b
| where b.priorErrors IS NULL
| sort - recentErrors
```

Operations that have errors in the last hour but none in the prior 23 hours are new failure modes.

## Comparing time ranges

### Latency comparison: current vs. previous period

```sql
search earliest=-1h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| stats avg(durationMs) as currentAvgLatency,
        max(durationMs) as currentMaxLatency,
        count() as currentSpanCount
        by serviceName
| left join ON a.serviceName = b.serviceName
    [ search earliest=-2h latest=-1h source = otel-v1-apm-span-*
      | eval durationMs = durationInNanos / 1000000
      | stats avg(durationMs) as previousAvgLatency,
              max(durationMs) as previousMaxLatency,
              count() as previousSpanCount
              by serviceName
    ] as b
| eval latencyChange = ((currentAvgLatency - b.previousAvgLatency) * 100.0) / b.previousAvgLatency
| fields serviceName, currentAvgLatency, b.previousAvgLatency, latencyChange, currentSpanCount, b.previousSpanCount
| sort - latencyChange
```

### Error rate comparison over time

```sql
search earliest=-24h source = otel-v1-apm-span-*
| bin @timestamp span=1h
| eventstats count() as totalSpans,
              count(status.code = 'ERROR') as errorSpans
              by @timestamp
| eval errorRate = errorSpans * 100.0 / totalSpans
| stats avg(errorRate) as hourlyErrorRate by @timestamp
| trendline sort + @timestamp sma(3, hourlyErrorRate) as errorTrend
| fields @timestamp, hourlyErrorRate, errorTrend
| sort @timestamp
```

Visualize as a line chart with both `hourlyErrorRate` and `errorTrend` to see whether errors are trending up or down.

### Before and after a deployment

```sql
search earliest=-4h source = otel-v1-apm-span-*
| eval durationMs = durationInNanos / 1000000
| eval period = if(startTime < TIMESTAMP('2025-03-04T14:00:00'), 'before', 'after')
| stats avg(durationMs) as avgLatency,
        max(durationMs) as maxLatency,
        count() as spanCount,
        count(status.code = 'ERROR') as errorCount
        by period, serviceName
| eval errorRate = errorCount * 100.0 / spanCount
| sort period, - errorRate
```

Replace the timestamp with your deployment time. Compare latency, throughput, and error rates before and after to assess deployment impact.

### Throughput comparison

```sql
search earliest=-1h source = otel-v1-apm-span-*
| stats count() as currentThroughput by serviceName
| left join ON a.serviceName = b.serviceName
    [ search earliest=-2h latest=-1h source = otel-v1-apm-span-*
      | stats count() as previousThroughput by serviceName
    ] as b
| eval throughputChange = ((currentThroughput - b.previousThroughput) * 100.0) / b.previousThroughput
| fields serviceName, currentThroughput, b.previousThroughput, throughputChange
| sort - throughputChange
```

A sudden drop in throughput for a service can indicate upstream failures, load balancer issues, or deployment problems — even if error rates look normal.

## Building visualizations

After running trace queries, build visualizations in Discover:

| Query pattern | Recommended visualization |
|---|---|
| `timechart` avg latency by service | Line chart |
| Latency histogram (`bin`) | Bar chart |
| Error count by service | Horizontal bar chart |
| Span count over time | Area chart |
| Service call frequency | Data table |
| Single latency metric | Metric value |

## Next steps

- [Explore Logs](/opensearch-agentops-website/docs/investigate/explore-logs/) — investigate log events and correlate with traces
- [Explore Metrics](/opensearch-agentops-website/docs/investigate/explore-metrics/) — query time-series metrics with PromQL
