---
title: "Explore Metrics"
description: "Investigate time-series metrics in Discover using PromQL — query rates, latencies, resource usage, detect anomalies, and compare time ranges"
---

:::caution[Placeholder queries]
The PromQL queries on this page are representative examples based on standard OpenTelemetry metric names. Your environment may use different metric names, labels, or configurations. Treat these as starting points — adjust metric names and label selectors to match your actual data.
:::

Metrics provide a continuous, low-overhead view of system health. In OpenSearch, the Discover experience for metrics uses PromQL — the industry-standard query language for Prometheus-compatible time-series data. Use it to monitor request rates, latencies, error ratios, and resource consumption across your services.

## Getting started in Discover

1. Open **Discover** from the left navigation
2. Select the metrics view
3. Set your time range using the date picker
4. Enter a PromQL query in the query bar and run it

Results render as time-series graphs by default. You can switch between graph and table views depending on the query type.

## Common OTEL metrics

OpenTelemetry-instrumented services typically emit these metric families:

| Metric | Type | Description |
|---|---|---|
| `http_server_request_duration_seconds` | Histogram | HTTP request latency |
| `http_server_request_duration_seconds_count` | Counter | Total HTTP requests |
| `http_server_request_duration_seconds_bucket` | Histogram | Latency distribution buckets |
| `rpc_server_duration` | Histogram | RPC call duration |
| `process_cpu_seconds_total` | Counter | CPU time consumed |
| `process_resident_memory_bytes` | Gauge | Memory usage |
| `runtime_jvm_memory_usage` | Gauge | JVM heap usage (Java services) |
| `runtime_jvm_gc_duration` | Histogram | JVM garbage collection time |
| `db_client_operation_duration` | Histogram | Database query duration |
| `messaging_process_duration` | Histogram | Message processing time |

> Exact metric names depend on your instrumentation. Use the metrics explorer or autocomplete in Discover to browse available metrics in your environment.

## Request rate and throughput

### Overall request rate

```promql
rate(http_server_request_duration_seconds_count[5m])
```

Returns per-second request rate averaged over 5-minute windows. This is your primary throughput indicator.

### Request rate by service

```promql
sum by (service_name) (rate(http_server_request_duration_seconds_count[5m]))
```

### Request rate by HTTP method and status

```promql
sum by (http_request_method, http_response_status_code) (
  rate(http_server_request_duration_seconds_count[5m])
)
```

### Error rate (5xx responses)

```promql
sum(rate(http_server_request_duration_seconds_count{http_response_status_code=~"5.."}[5m]))
/
sum(rate(http_server_request_duration_seconds_count[5m]))
```

This gives you the fraction of requests returning 5xx errors. Multiply by 100 for a percentage.

### Error ratio by service

```promql
sum by (service_name) (
  rate(http_server_request_duration_seconds_count{http_response_status_code=~"5.."}[5m])
)
/
sum by (service_name) (
  rate(http_server_request_duration_seconds_count[5m])
)
```

## Latency analysis

### Average latency

```promql
rate(http_server_request_duration_seconds_sum[5m])
/
rate(http_server_request_duration_seconds_count[5m])
```

### 95th percentile latency

```promql
histogram_quantile(0.95, rate(http_server_request_duration_seconds_bucket[5m]))
```

### 99th percentile latency by service

```promql
histogram_quantile(0.99,
  sum by (service_name, le) (
    rate(http_server_request_duration_seconds_bucket[5m])
  )
)
```

### Latency comparison: p50 vs. p95 vs. p99

```promql
histogram_quantile(0.5, rate(http_server_request_duration_seconds_bucket[5m]))
```

Run this query three times with 0.5, 0.95, and 0.99 and overlay them on the same chart. A large gap between p50 and p99 indicates tail latency problems — most requests are fast but some are very slow.

## Resource utilization

### CPU usage by service

```promql
avg by (service_name) (rate(process_cpu_seconds_total[5m])) * 100
```

Returns CPU usage as a percentage. Values above 80% sustained may indicate a need to scale.

### Memory usage by service

```promql
avg by (service_name) (process_resident_memory_bytes) / 1024 / 1024
```

Returns memory in megabytes. Watch for steady upward trends that could indicate memory leaks.

### JVM heap usage (Java services)

```promql
avg by (service_name) (runtime_jvm_memory_usage{type="heap"})
/
avg by (service_name) (runtime_jvm_memory_limit{type="heap"})
```

Returns heap utilization as a ratio. Values consistently above 0.85 suggest the heap is undersized or there's a memory leak.

### JVM garbage collection time

```promql
rate(runtime_jvm_gc_duration_sum[5m])
```

High GC time correlates with latency spikes. If GC is consuming more than 5% of wall-clock time, investigate heap sizing and allocation patterns.

## Database and messaging

### Database query latency (p95)

```promql
histogram_quantile(0.95,
  sum by (db_system, le) (
    rate(db_client_operation_duration_bucket[5m])
  )
)
```

### Database query rate by operation

```promql
sum by (db_system, db_operation_name) (
  rate(db_client_operation_duration_count[5m])
)
```

### Message processing latency

```promql
histogram_quantile(0.95,
  sum by (messaging_system, le) (
    rate(messaging_process_duration_bucket[5m])
  )
)
```

## Correlating metrics with logs and traces

Metrics tell you *what* is happening; logs and traces tell you *why*. Use metrics to identify the time window and service, then pivot to logs or traces for root cause.

### Workflow: metric alert → trace investigation

1. A PromQL query shows p99 latency spiking for `checkout-service`:
   ```promql
   histogram_quantile(0.99,
     sum by (le) (
       rate(http_server_request_duration_seconds_bucket{service_name="checkout-service"}[5m])
     )
   )
   ```

2. Note the time range where the spike occurs

3. Switch to the traces Discover page and query for slow spans in that window:
   ```sql
   source = otel-v1-apm-span-*
   | where serviceName = 'checkout-service'
         AND durationInNanos > 5000000000
   | fields traceId, name, durationInNanos, status.code
   | sort - durationInNanos
   | head 10
   ```

4. Pick a traceId and follow it to see the full request flow (see [Explore Traces](/opensearch-agentops-website/docs/investigate/explore-traces/))

5. Check logs for that trace:
   ```sql
   source = logs-otel-v1*
   | where traceId = '<trace-id-from-step-3>'
   | sort @timestamp
   ```

This metric → trace → log workflow is the core investigation pattern for production incidents.

## Identifying outliers

### Services with abnormal latency

Compare each service's p95 latency against the fleet average:

```promql
histogram_quantile(0.95,
  sum by (service_name, le) (
    rate(http_server_request_duration_seconds_bucket[5m])
  )
)
> 2 *
avg(
  histogram_quantile(0.95,
    sum by (service_name, le) (
      rate(http_server_request_duration_seconds_bucket[5m])
    )
  )
)
```

This returns only services whose p95 latency is more than double the fleet average.

### Sudden throughput drops

```promql
sum by (service_name) (rate(http_server_request_duration_seconds_count[5m]))
< 0.5 *
sum by (service_name) (rate(http_server_request_duration_seconds_count[5m] offset 1h))
```

Flags services where current throughput is less than half of what it was an hour ago — a strong signal of upstream failures or routing issues.

### Error rate spikes

```promql
(
  sum by (service_name) (
    rate(http_server_request_duration_seconds_count{http_response_status_code=~"5.."}[5m])
  )
  /
  sum by (service_name) (
    rate(http_server_request_duration_seconds_count[5m])
  )
)
> 0.05
```

Returns services with an error rate above 5%. Adjust the threshold to match your SLOs.

### Memory leak detection

```promql
predict_linear(process_resident_memory_bytes[1h], 3600)
```

Projects memory usage 1 hour into the future based on the current trend. If the projected value exceeds your memory limit, you may have a leak.

## Comparing time ranges

### Current vs. previous period

PromQL's `offset` modifier lets you compare the same metric across time periods.

**Latency now vs. 1 hour ago:**

```promql
histogram_quantile(0.95, rate(http_server_request_duration_seconds_bucket[5m]))
/
histogram_quantile(0.95, rate(http_server_request_duration_seconds_bucket[5m] offset 1h))
```

A ratio above 1 means latency has increased. Below 1 means it improved.

**Request rate now vs. same time yesterday:**

```promql
sum(rate(http_server_request_duration_seconds_count[5m]))
/
sum(rate(http_server_request_duration_seconds_count[5m] offset 24h))
```

Useful for detecting traffic pattern changes — a ratio significantly below 1 at a time that's normally busy could indicate an upstream problem.

**Error rate now vs. 1 hour ago:**

```promql
(
  sum(rate(http_server_request_duration_seconds_count{http_response_status_code=~"5.."}[5m]))
  /
  sum(rate(http_server_request_duration_seconds_count[5m]))
)
-
(
  sum(rate(http_server_request_duration_seconds_count{http_response_status_code=~"5.."}[5m] offset 1h))
  /
  sum(rate(http_server_request_duration_seconds_count[5m] offset 1h))
)
```

A positive result means error rate has increased compared to an hour ago.

### Before and after a deployment

Use `offset` to compare a fixed window before and after a known deployment time:

```promql
histogram_quantile(0.95,
  sum by (service_name, le) (
    rate(http_server_request_duration_seconds_bucket[30m])
  )
)
```

Run this query twice:
1. Set the time range to the 30 minutes after the deployment
2. Set the time range to the 30 minutes before the deployment

Compare the results side by side. Significant latency increases after the deployment are a rollback signal.

### Week-over-week comparison

```promql
sum(rate(http_server_request_duration_seconds_count[1h]))
/
sum(rate(http_server_request_duration_seconds_count[1h] offset 7d))
```

Compares current hourly throughput against the same hour last week. Useful for capacity planning and detecting long-term trends.

## Building visualizations

PromQL results render as time-series graphs by default. Common visualization approaches:

| Query pattern | Recommended visualization |
|---|---|
| `rate()` over time | Line chart |
| `histogram_quantile()` percentiles | Line chart (overlay p50, p95, p99) |
| `sum by (service)` | Line chart with legend per service |
| Instant query (single value) | Metric value / gauge |
| Ratio queries (error rate) | Line chart with threshold line |
| `predict_linear()` | Line chart with projected trend |

## Next steps

- [Explore Logs](/opensearch-agentops-website/docs/investigate/explore-logs/) — investigate log events with PPL
- [Explore Traces](/opensearch-agentops-website/docs/investigate/explore-traces/) — follow requests across services
