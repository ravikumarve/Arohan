# API Failure Runbook

## Severity Levels
- **P0 - Critical**: Complete API outage, all users affected
- **P1 - High**: Major functionality degraded, significant user impact
- **P2 - Medium**: Partial functionality degraded, limited user impact
- **P3 - Low**: Minor issues, minimal user impact

## Common API Failure Scenarios

### 1. Complete API Outage (P0)

**Symptoms:**
- All endpoints returning 503/502 errors
- Health check failing
- Prometheus showing `up{job="arohan-api"} == 0`

**Immediate Actions (0-5 minutes):**
1. Check Grafana dashboard for service status
2. Verify Docker container status: `docker ps -a | grep arohan`
3. Check API logs: `docker logs arohan-api-1 --tail 100`
4. Verify database connectivity: `docker exec -it arohan-db-1 pg_isready`

**Investigation Steps (5-15 minutes):**
1. Check system resources: `docker stats`
2. Review recent deployments or configuration changes
3. Check database connection pool status
4. Verify environment variables and secrets

**Resolution Steps:**
1. If container crashed: `docker restart arohan-api-1`
2. If database issue: Follow Database Failure Runbook
3. If resource exhaustion: Scale up resources or restart containers
4. If recent deployment caused issue: Rollback to previous version

**Verification:**
- Health check returns 200: `curl http://localhost:8000/health`
- Metrics endpoint accessible: `curl http://localhost:8000/metrics`
- Sample API call succeeds

**Prevention:**
- Implement circuit breakers for external dependencies
- Add horizontal pod autoscaling
- Regular load testing
- Monitor resource usage trends

---

### 2. High Error Rate (P1)

**Symptoms:**
- Error rate > 10% for >5 minutes
- Specific endpoints failing consistently
- Prometheus alert: `APIHighErrorRate`

**Immediate Actions (0-5 minutes):**
1. Identify failing endpoints from Grafana
2. Check error logs for patterns: `docker logs arohan-api-1 | grep ERROR`
3. Verify external service status (Twilio, Meta, Bhashini)

**Investigation Steps (5-15 minutes):**
1. Check if error rate is specific to certain endpoints
2. Review recent code changes
3. Test failing endpoints manually
4. Check for rate limiting or quota issues

**Resolution Steps:**
1. If external service down: Enable fallback mechanisms
2. If code bug: Deploy hotfix or rollback
3. If rate limiting: Implement retry logic with exponential backoff
4. If database issue: Follow Database Failure Runbook

**Verification:**
- Error rate returns to normal (<1%)
- Endpoints responding successfully
- No new errors in logs

**Prevention:**
- Implement comprehensive error handling
- Add integration tests for external services
- Monitor external service status
- Implement graceful degradation

---

### 3. High Latency (P1)

**Symptoms:**
- 95th percentile response time > 2 seconds
- Slow endpoint responses
- Prometheus alert: `APIHighLatency`

**Immediate Actions (0-5 minutes):**
1. Check current response times in Grafana
2. Identify slow endpoints
3. Check system resource usage

**Investigation Steps (5-15 minutes):**
1. Profile slow endpoints
2. Check database query performance
3. Review external API call times
4. Check for memory leaks or high CPU usage

**Resolution Steps:**
1. Optimize slow database queries
2. Add caching for frequently accessed data
3. Implement async processing for long-running tasks
4. Scale horizontally if needed

**Verification:**
- 95th percentile response time < 1 second
- Endpoints responding within SLA
- Resource usage normalized

**Prevention:**
- Regular performance testing
- Database query optimization
- Implement caching strategies
- Monitor performance trends

---

### 4. Database Connection Issues (P0)

**Symptoms:**
- Database connection errors
- Connection pool exhaustion
- Prometheus alert: `DatabaseConnectionPoolExhausted`

**Immediate Actions (0-5 minutes):**
1. Check database status: `docker exec -it arohan-db-1 pg_isready`
2. Check connection pool metrics
3. Review database logs

**Investigation Steps (5-15 minutes):**
1. Check for long-running queries
2. Review connection pool configuration
3. Check database resource usage
4. Verify network connectivity

**Resolution Steps:**
1. Kill long-running queries if blocking
2. Increase connection pool size
3. Restart API service to clear stale connections
4. Scale database resources if needed

**Verification:**
- Database accepting connections
- Connection pool metrics normal
- API endpoints responding

**Prevention:**
- Monitor connection pool usage
- Implement query timeouts
- Regular database maintenance
- Proper connection pool sizing

---

### 5. Redis Cache Failure (P1)

**Symptoms:**
- Cache-related errors
- Slow performance due to cache misses
- Session state issues

**Immediate Actions (0-5 minutes):**
1. Check Redis status: `docker exec -it arohan-redis-1 redis-cli ping`
2. Check Redis logs
3. Verify Redis memory usage

**Investigation Steps (5-15 minutes):**
1. Check for memory exhaustion
2. Review Redis configuration
3. Check for network issues
4. Verify Redis persistence

**Resolution Steps:**
1. Restart Redis if needed
2. Clear cache if corrupted
3. Increase Redis memory limit
4. Implement cache fallback to database

**Verification:**
- Redis responding to PING
- Cache operations working
- Session state functioning

**Prevention:**
- Monitor Redis memory usage
- Implement cache eviction policies
- Regular Redis backups
- Test cache failure scenarios

---

### 6. RabbitMQ Queue Issues (P1)

**Symptoms:**
- Queue backlog growing
- Tasks not processing
- Prometheus alert: `QueueBacklog`

**Immediate Actions (0-5 minutes):**
1. Check queue status in RabbitMQ management UI
2. Check Celery worker status
3. Review worker logs

**Investigation Steps (5-15 minutes):**
1. Check if workers are running
2. Review task failure rates
3. Check for stuck tasks
4. Verify worker resource usage

**Resolution Steps:**
1. Restart stuck workers
2. Scale up worker count
3. Clear dead-letter queue if needed
4. Fix failing task logic

**Verification:**
- Queue processing normally
- Workers healthy
- No task backlog

**Prevention:**
- Monitor queue lengths
- Implement worker autoscaling
- Add task retry logic
- Regular worker health checks

---

## Communication Protocol

### P0 - Critical
- **Time to notify**: 5 minutes
- **Channels**: PagerDuty, Slack #alerts-critical, phone call
- **Update frequency**: Every 15 minutes until resolved

### P1 - High
- **Time to notify**: 15 minutes
- **Channels**: Slack #alerts-warning, email
- **Update frequency**: Every 30 minutes until resolved

### P2 - Medium
- **Time to notify**: 1 hour
- **Channels**: Slack #alerts-warning
- **Update frequency**: Hourly until resolved

### P3 - Low
- **Time to notify**: Next business day
- **Channels**: Email, Slack #general
- **Update frequency**: Daily standup

## Post-Incident Process

1. **Incident Review Meeting**: Schedule within 24-48 hours
2. **Root Cause Analysis**: Document what happened and why
3. **Action Items**: Create specific tasks to prevent recurrence
4. **Documentation**: Update runbooks based on lessons learned
5. **Follow-up**: Track action items to completion

## Escalation Matrix

| Level | Trigger | Escalate To | Timeframe |
|-------|---------|-------------|-----------|
| L1 | Issue not resolved in 30 min | On-call engineer | Immediate |
| L2 | Issue not resolved in 1 hour | Tech lead | +30 min |
| L3 | Issue not resolved in 2 hours | Engineering manager | +1 hour |
| L4 | Issue not resolved in 4 hours | CTO | +2 hours |

## Contact Information

- **On-call Engineer**: [Phone number]
- **Tech Lead**: [Phone number]
- **Engineering Manager**: [Phone number]
- **CTO**: [Phone number]

## Related Runbooks
- Database Failure Runbook
- External Service Failure Runbook
- Deployment Failure Runbook
- Security Incident Runbook