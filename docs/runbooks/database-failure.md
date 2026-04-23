# Database Failure Runbook

## Overview
This runbook covers failures with the PostgreSQL database that AROHAN uses for:
- Candidate data storage
- Requisition management
- Scorecard persistence
- Audit trail
- User authentication

## Severity Levels
- **P0 - Critical**: Complete database outage, all operations blocked
- **P1 - High**: Major degradation, significant impact on operations
- **P2 - Medium**: Partial degradation, limited user impact
- **P3 - Low**: Minor issues, minimal user impact

## Common Database Failure Scenarios

### 1. Complete Database Outage (P0)

**Symptoms:**
- All database queries failing
- Connection refused errors
- Health check failing
- Prometheus alert: `DatabaseDown`

**Immediate Actions (0-5 minutes):**
1. Check database container status: `docker ps -a | grep postgres`
2. Verify database is accepting connections: `docker exec -it arohan-db-1 pg_isready`
3. Check database logs: `docker logs arohan-db-1 --tail 100`
4. Verify system resources: `docker stats arohan-db-1`

**Investigation Steps (5-15 minutes):**
1. Check disk space: `docker exec -it arohan-db-1 df -h`
2. Review PostgreSQL error logs
3. Check for corrupted data files
4. Verify network connectivity

**Resolution Steps:**
1. If container stopped: `docker start arohan-db-1`
2. If disk full: Free up space or expand storage
3. If corrupted data: Restore from backup
4. If network issue: Fix network configuration

**Emergency Recovery:**
1. Stop all application services
2. Identify last good backup
3. Restore database from backup
4. Verify data integrity
5. Restart application services

**Verification:**
- Database accepting connections
- Basic queries working
- Application connecting successfully
- No errors in logs

**Prevention:**
- Regular database backups
- Monitor disk space usage
- Implement connection pooling
- Regular health checks

---

### 2. Connection Pool Exhaustion (P1)

**Symptoms:**
- Connection timeout errors
- Slow query performance
- Prometheus alert: `DatabaseConnectionPoolExhausted`
- High active connection count

**Immediate Actions (0-5 minutes):**
1. Check active connections:
   ```sql
   SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
   ```
2. Identify long-running queries:
   ```sql
   SELECT pid, now() - pg_stat_activity.query_start AS duration, query
   FROM pg_stat_activity WHERE state = 'active' ORDER BY duration DESC;
   ```
3. Check connection pool configuration
4. Review application logs

**Investigation Steps (5-15 minutes):**
1. Identify blocking queries
2. Check for connection leaks
3. Review connection pool settings
4. Analyze query patterns

**Resolution Steps:**
1. Kill long-running queries if necessary:
   ```sql
   SELECT pg_terminate_backend(pid);
   ```
2. Increase connection pool size
3. Restart application to clear stale connections
4. Optimize slow queries

**Verification:**
- Connection count within limits
- No connection timeouts
- Query performance improved
- Application responding normally

**Prevention:**
- Implement query timeouts
- Monitor connection usage
- Regular query optimization
- Proper connection pool sizing

---

### 3. Slow Query Performance (P1)

**Symptoms:**
- High response times
- Database CPU usage high
- Prometheus alert: `DatabaseSlowQueries`
- User complaints about slowness

**Immediate Actions (0-5 minutes):**
1. Check current query performance:
   ```sql
   SELECT query, mean_exec_time, calls
   FROM pg_stat_statements
   ORDER BY mean_exec_time DESC LIMIT 10;
   ```
2. Check database resource usage
3. Review recent schema changes
4. Check for missing indexes

**Investigation Steps (5-15 minutes):**
1. Analyze slow query log
2. Check query execution plans
3. Review index usage
4. Identify table locks

**Resolution Steps:**
1. Add missing indexes
2. Optimize slow queries
3. Update table statistics
4. Consider partitioning for large tables

**Query Optimization Examples:**
```sql
-- Create index for common query patterns
CREATE INDEX idx_candidates_phone ON candidates(phone_number);
CREATE INDEX idx_sessions_created ON interview_sessions(created_at);

-- Update table statistics
ANALYZE candidates;
ANALYZE interview_sessions;

-- Check query execution plan
EXPLAIN ANALYZE SELECT * FROM candidates WHERE phone_number = '+919876543210';
```

**Verification:**
- Query times improved
- CPU usage normalized
- No slow query alerts
- User feedback positive

**Prevention:**
- Regular query performance monitoring
- Index usage analysis
- Query optimization reviews
- Load testing before deployments

---

### 4. Disk Space Issues (P0)

**Symptoms:**
- Database write failures
- Vacuum operations failing
- Prometheus alert: `DiskSpaceLow`
- Error messages about disk space

**Immediate Actions (0-5 minutes):**
1. Check disk space: `docker exec -it arohan-db-1 df -h`
2. Identify large tables:
   ```sql
   SELECT
     schemaname,
     tablename,
     pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
   FROM pg_tables
   ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
   ```
3. Check for bloated tables
4. Review retention policies

**Investigation Steps (5-15 minutes):**
1. Identify space-consuming data
2. Check for table bloat
3. Review WAL file size
4. Analyze growth patterns

**Resolution Steps:**
1. Clean up old data based on retention policy
2. Vacuum full on bloated tables
3. Compress large tables
4. Expand disk storage if needed

**Data Cleanup Examples:**
```sql
-- Delete old audit logs (older than 90 days)
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '90 days';

-- Vacuum and analyze
VACUUM FULL audit_logs;
ANALYZE audit_logs;

-- Archive old data to separate table
CREATE TABLE interview_sessions_archive AS
SELECT * FROM interview_sessions WHERE created_at < NOW() - INTERVAL '180 days';
DELETE FROM interview_sessions WHERE created_at < NOW() - INTERVAL '180 days';
```

**Verification:**
- Disk space available (>20% free)
- Database operations normal
- No space-related errors
- Growth rate acceptable

**Prevention:**
- Implement data retention policies
- Regular vacuum and analyze
- Monitor disk space trends
- Set up space alerts

---

### 5. Replication Lag (P1)

**Symptoms:**
- Read replicas out of sync
- Stale data in queries
- High replication lag metrics

**Immediate Actions (0-5 minutes):**
1. Check replication status:
   ```sql
   SELECT * FROM pg_stat_replication;
   ```
2. Check lag on replica
3. Review network connectivity
4. Check replica resource usage

**Investigation Steps (5-15 minutes):**
1. Identify cause of lag
2. Check for long-running transactions
3. Review network bandwidth
4. Analyze write patterns

**Resolution Steps:**
1. Optimize long-running transactions
2. Increase network bandwidth
3. Scale replica resources
4. Consider synchronous replication for critical data

**Verification:**
- Replication lag minimal (<1 second)
- Replicas in sync
- No stale data issues
- Performance acceptable

**Prevention:**
- Monitor replication lag
- Optimize write patterns
- Regular replica health checks
- Adequate network capacity

---

### 6. Data Corruption (P0)

**Symptoms:**
- Query errors about corrupted data
- Inconsistent results
- Database crashes
- Error messages about data integrity

**Immediate Actions (0-5 minutes):**
1. Stop all write operations
2. Check database logs for corruption errors
3. Verify data integrity
4. Assess scope of corruption

**Investigation Steps (5-15 minutes):**
1. Identify corrupted tables/data
2. Check for hardware issues
3. Review recent operations
4. Determine recovery options

**Resolution Steps:**
1. Restore from last good backup
2. Reapply transactions from WAL logs
3. Verify data integrity
4. Restart application services

**Data Integrity Checks:**
```sql
-- Check for corrupted tables
SELECT * FROM pg_class WHERE relkind = 'r' AND relpages = 0;

-- Verify table integrity
VACUUM VERBOSE tablename;

-- Check for orphaned rows
SELECT count(*) FROM candidates WHERE NOT EXISTS (SELECT 1 FROM interview_sessions WHERE candidate_id = candidates.id);
```

**Verification:**
- No corruption errors
- Data integrity verified
- Queries returning correct results
- Application functioning normally

**Prevention:**
- Regular database backups
- Hardware monitoring
- Data integrity checks
- Proper shutdown procedures

---

## Backup and Recovery

### Backup Strategy
- **Full backups**: Daily at 2 AM UTC
- **WAL archiving**: Continuous
- **Retention**: 30 days
- **Offsite**: Weekly to cloud storage

### Recovery Procedures

#### Point-in-Time Recovery
1. Identify recovery point
2. Restore from latest full backup
3. Replay WAL logs to recovery point
4. Verify data integrity
5. Switch to recovered database

#### Emergency Recovery
1. Stop all application services
2. Promote standby replica if available
3. Update application configuration
4. Verify functionality
5. Rebuild failed primary

### Backup Verification
- **Daily**: Backup completion check
- **Weekly**: Restore test
- **Monthly**: Full disaster recovery drill

## Monitoring and Alerting

### Key Metrics
- Database uptime
- Connection pool usage
- Query performance
- Disk space usage
- Replication lag

### Alert Thresholds
- **Critical**: Database down, disk space < 10%
- **Warning**: Connection pool > 80%, slow queries > 1s
- **Info**: Replication lag > 5s

## Maintenance Procedures

### Regular Maintenance
- **Daily**: Vacuum analyze, backup verification
- **Weekly**: Index rebuild, statistics update
- **Monthly**: Table partitioning, archive old data
- **Quarterly**: Performance tuning, capacity planning

### Maintenance Windows
- **Scheduled**: Sunday 2-4 AM UTC
- **Emergency**: As needed with proper notification
- **Rollback**: Plan documented and tested

## Security Considerations

### Access Control
- Principle of least privilege
- Regular access reviews
- Audit logging enabled
- Encryption at rest and in transit

### Data Protection
- Regular backups
- Encryption enabled
- Access logging
- Compliance monitoring

## Documentation

### Schema Documentation
- Table definitions
- Index usage
- Relationships
- Constraints

### Operational Documentation
- Connection strings
- Configuration parameters
- Performance tuning
- Troubleshooting guides

## Related Runbooks
- API Failure Runbook
- External Service Failure Runbook
- Network Failure Runbook
- Security Incident Runbook