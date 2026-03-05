---
title: "Explore Logs"
description: "Investigate log data in Discover using PPL — search, filter, correlate, detect outliers, and compare time ranges"
---

Logs are the most granular signal in your observability stack. In OpenSearch, the Discover experience for logs uses Piped Processing Language (PPL) to search, filter, and analyze log events from your OTEL-instrumented services.

## Getting started in Discover

1. Open **Discover** from the left navigation
2. Select your log index pattern (e.g., `logs-otel-v1*`)
3. Set your time range using the date picker in the top bar
4. Enter a PPL query in the query bar and run it

Discover shows results as a table of log events. You can add or remove columns, expand individual events to see all fields, and build visualizations from your query results.

## Common fields in OTEL log data

| Field | Description |
|---|---|
| `@timestamp` | Ingestion timestamp |
| `body` | Raw log message |
| `severity.text` | Log level — INFO, WARN, ERROR, FATAL |
| `severity.number` | Numeric severity (1–24) |
| `traceId` | Distributed trace correlation ID |
| `spanId` | Span correlation ID |
| `instrumentationScope.name` | Instrumentation library name |
| `resource.attributes.*` | Resource-level attributes (service name, host, etc.) |

## Searching and filtering logs

### Filter by severity

```sql
source = logs-otel-v1*
| where severity.text = 'ERROR'
| fields @timestamp, body, instrumentationScope.name, traceId
| sort - @timestamp
| head 50
```

### Full-text search in log bodies

```sql
source = logs-otel-v1*
| where body LIKE '%timeout%'
| fields @timestamp, severity.text, body, instrumentationScope.name
| sort - @timestamp
```

### Filter by service and time

```sql
search earliest=-1h source = logs-otel-v1*
| where instrumentationScope.name = 'my-service'
| where severity.text IN ('ERROR', 'WARN')
| fields @timestamp, severity.text, body, traceId
| sort - @timestamp
```

## Extracting structure from unstructured logs

Log bodies often contain useful data buried in free text. Use REX to pull it out.

### Parse HTTP details from log messages

```sql
source = logs-otel-v1*
| where body LIKE '%HTTP%'
| rex field=body "(?<httpMethod>GET|POST|PUT|DELETE)\s+(?<httpPath>/\S+)\s+HTTP"
| rex field=body "HTTP/\d\.\d\"\s+(?<statusCode>\d{3})"
| fields @timestamp, httpMethod, httpPath, statusCode, severity.text
| sort - @timestamp
| head 30
```

### Extract exception class names

```sql
source = logs-otel-v1*
| where severity.text = 'ERROR' AND body LIKE '%Exception%'
| rex field=body "(?<exClass>[A-Za-z.]+Exception)"
| stats count() as occurrences by exClass
| sort - occurrences
```

### Parse JSON payloads with SPATH

When log bodies contain embedded JSON:

```sql
source = logs-otel-v1*
| where body LIKE '%"status"%'
| spath input=body path=status output=responseStatus
| spath input=body path=service output=serviceName
| fields @timestamp, serviceName, responseStatus, severity.text
| sort - @timestamp
```

## Aggregation and trending

### Error count by service

```sql
search earliest=-6h source = logs-otel-v1*
| where severity.text = 'ERROR'
| stats count() as errorCount by instrumentationScope.name
| sort - errorCount
```

### Log volume over time by severity

```sql
search earliest=-6h source = logs-otel-v1*
| timechart span=5m count() by severity.text
```

Pipe this into a stacked bar chart in Discover to see how severity distribution changes over time.

### Error rate per service

```sql
search earliest=-6h source = logs-otel-v1*
| eventstats count() as totalLogs,
              count(severity.text = 'ERROR') as errorCount
              by instrumentationScope.name
| eval errorRate = errorCount * 100.0 / totalLogs
| stats avg(errorRate) as avgErrorRate by instrumentationScope.name
| sort - avgErrorRate
```

## Correlating logs with traces

One of the most powerful aspects of OTEL-instrumented logs is the `traceId` field. When a log entry has a traceId, you can follow it across the entire request lifecycle.

### Find all logs for a specific trace

```sql
source = logs-otel-v1*
| where traceId = '<your-trace-id>'
| fields @timestamp, spanId, severity.text, body, instrumentationScope.name
| sort @timestamp
```

### Find all logs from traces that had errors

Use a subquery to first identify traces with errors, then pull all logs from those traces:

```sql
source = logs-otel-v1*
| where traceId in [
    source = logs-otel-v1*
    | where severity.text = 'ERROR'
    | fields traceId
  ]
| fields @timestamp, traceId, spanId, severity.text, body, instrumentationScope.name
| sort traceId, @timestamp
```

This gives you the full context around a failure — not just the error line, but the INFO and WARN entries leading up to it.

### Correlate log errors with trace latency

Join error logs with span data to see whether errors correlate with slow requests:

```sql
source = logs-otel-v1* as a
| where severity.text = 'ERROR'
| left join ON a.traceId = b.traceId
    [ source = otel-v1-apm-span-*
      | stats max(durationInNanos) as maxSpanDuration by traceId
    ] as b
| fields a.@timestamp, a.body, a.instrumentationScope.name, a.traceId, b.maxSpanDuration
| sort - b.maxSpanDuration
| head 20
```

### Cross-service error correlation

See which services produce errors together — a sign of cascading failures:

```sql
search earliest=-2h source = logs-otel-v1*
| where severity.text = 'ERROR'
| stats dc(instrumentationScope.name) as serviceCount,
        values(instrumentationScope.name) as services
        by traceId
| where serviceCount > 1
| sort - serviceCount
| head 20
```

Traces where multiple services logged errors are likely cascading failures. Expand the `services` field to see the chain.

## Identifying outliers

### Services with abnormal error rates

Use eventstats to compare each service's error rate against the overall average:

```sql
search earliest=-6h source = logs-otel-v1*
| eventstats count() as totalLogs,
              count(severity.text = 'ERROR') as errorCount
              by instrumentationScope.name
| eval errorRate = errorCount * 100.0 / totalLogs
| stats avg(errorRate) as avgErrorRate by instrumentationScope.name
| eventstats avg(avgErrorRate) as globalAvgRate, stddev(avgErrorRate) as stddevRate
| eval zScore = (avgErrorRate - globalAvgRate) / stddevRate
| where zScore > 2
| sort - zScore
```

Services with a z-score above 2 are producing errors at a rate significantly above the norm.

### Detect sudden log volume spikes

```sql
search earliest=-12h source = logs-otel-v1*
| timechart span=10m count() as logCount
| trendline sort + @timestamp sma(6, logCount) as movingAvg
| eval deviation = logCount - movingAvg
| eval spikeRatio = logCount / movingAvg
| where spikeRatio > 2.0
| fields @timestamp, logCount, movingAvg, spikeRatio
```

This flags 10-minute windows where log volume is more than double the moving average — a strong signal of something unusual happening.

### Severity distribution anomalies

```sql
search earliest=-6h source = logs-otel-v1*
| bin severity.number span=4
| stats count() as logCount by severity.number
| sort severity.number
```

OTEL severity numbers map to levels: 1–4 TRACE, 5–8 DEBUG, 9–12 INFO, 13–16 WARN, 17–20 ERROR, 21–24 FATAL. An unusual concentration in the higher ranges signals a problem.

### New error patterns

Find exception types that appeared recently but weren't present in the prior period:

```sql
search earliest=-1h source = logs-otel-v1*
| where severity.text = 'ERROR'
| rex field=body "(?<exClass>[A-Za-z.]+Exception)"
| stats count() as recentCount by exClass
| left join ON a.exClass = b.exClass
    [ search earliest=-24h latest=-1h source = logs-otel-v1*
      | where severity.text = 'ERROR'
      | rex field=body "(?<exClass>[A-Za-z.]+Exception)"
      | stats count() as priorCount by exClass
    ] as b
| where b.priorCount IS NULL
| sort - recentCount
```

Exception classes that appear in the last hour but not in the prior 23 hours are new failure modes worth investigating immediately.

## Comparing time ranges

### Compare error counts: now vs. previous period

```sql
search earliest=-1h source = logs-otel-v1*
| where severity.text = 'ERROR'
| stats count() as currentErrors by instrumentationScope.name
| left join ON a.instrumentationScope.name = b.instrumentationScope.name
    [ search earliest=-2h latest=-1h source = logs-otel-v1*
      | where severity.text = 'ERROR'
      | stats count() as previousErrors by instrumentationScope.name
    ] as b
| fillnull using currentErrors = 0, previousErrors = 0
| eval changePercent = ((currentErrors - b.previousErrors) * 100.0) / b.previousErrors
| fields instrumentationScope.name, currentErrors, b.previousErrors, changePercent
| sort - changePercent
```

### Log volume trend: hour-over-hour

```sql
search earliest=-24h source = logs-otel-v1*
| bin @timestamp span=1h
| stats count() as logCount by @timestamp
| trendline sort + @timestamp sma(3, logCount) as trend
| eval aboveTrend = logCount > trend
| fields @timestamp, logCount, trend, aboveTrend
| sort @timestamp
```

### Before and after a deployment

If you know a deployment happened at a specific time, compare the error profile before and after:

```sql
search earliest=-4h source = logs-otel-v1*
| where severity.text IN ('ERROR', 'WARN')
| eval period = if(@timestamp < TIMESTAMP('2025-03-04T14:00:00'), 'before', 'after')
| stats count() as logCount,
        dc(instrumentationScope.name) as affectedServices
        by period, severity.text
| sort period, severity.text
```

Replace the timestamp with your deployment time. A jump in error count or affected services after the deployment is a strong rollback signal.

## Building visualizations

After running any of these queries, you can build a visualization directly in Discover:

1. Run your query
2. Select a visualization type from the chart panel (line, bar, area, table, etc.)
3. Discover auto-recommends a chart type based on your result shape
4. Adjust axes, grouping, and formatting as needed
5. Select **Save** → **Save to dashboard** to persist it

Common visualization pairings for log investigation:

| Query pattern | Recommended visualization |
|---|---|
| `timechart` by severity | Stacked bar chart |
| `stats count() by service` | Horizontal bar chart |
| Error rate over time | Line chart |
| Severity distribution (`bin`) | Bar chart / histogram |
| Single error count | Metric value |

## Next steps

- [Explore Traces](/opensearch-agentops-website/docs/investigate/explore-traces/) — follow requests across services using span data
- [Explore Metrics](/opensearch-agentops-website/docs/investigate/explore-metrics/) — query time-series metrics with PromQL
