# AROHAN Production Deployment Procedures

## Overview
This document provides comprehensive procedures for deploying AROHAN to production environments, including prerequisites, deployment steps, verification procedures, and rollback strategies.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Deployment Procedures](#deployment-procedures)
4. [Post-Deployment Verification](#post-deployment-verification)
5. [Rollback Procedures](#rollback-procedures)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Hardware Requirements

**Minimum Production Configuration:**
- **CPU**: 4 cores
- **RAM**: 8 GB
- **Storage**: 50 GB SSD
- **Network**: 1 Gbps

**Recommended Production Configuration:**
- **CPU**: 8 cores
- **RAM**: 16 GB
- **Storage**: 100 GB SSD
- **Network**: 1 Gbps

### Software Requirements

- **Operating System**: Ubuntu 22.04 LTS or later
- **Docker**: 24.0 or later
- **Docker Compose**: 2.20 or later
- **Python**: 3.12 (included in Docker image)
- **Git**: 2.40 or later

### External Services

- **Twilio Account**: IVR and SMS services
- **Meta Business Account**: WhatsApp Business API
- **Bhashini API Key**: Speech-to-text service
- **OpenAI API Key**: Whisper fallback and embeddings
- **Pinecone Account**: Vector database for trait scoring

### Network Requirements

- **Outbound Ports**: 443 (HTTPS), 587 (SMTP)
- **Inbound Ports**: 80 (HTTP), 443 (HTTPS), 8000 (API)
- **DNS**: Valid domain name configured
- **SSL/TLS**: Valid SSL certificate

---

## Environment Setup

### 1. System Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### 2. Directory Structure

```bash
# Create application directory
sudo mkdir -p /opt/arohan
cd /opt/arohan

# Create subdirectories
mkdir -p logs data backups config
```

### 3. Clone Repository

```bash
# Clone repository (replace with your repository URL)
git clone https://github.com/your-org/arohan.git .
git checkout production  # or appropriate branch

# Set proper permissions
sudo chown -R $USER:$USER /opt/arohan
chmod -R 755 /opt/arohan
```

### 4. Environment Configuration

```bash
# Copy environment template
cp config/.env.template config/.env

# Edit environment variables
nano config/.env
```

**Critical Environment Variables:**

```bash
# Application
ENVIRONMENT=production
DEBUG=false
API_HOST=0.0.0.0
API_PORT=8000
WORKERS=4
LOG_LEVEL=INFO

# Database
DATABASE_URL=postgresql://arohan:secure_password@db:5432/arohan

# Redis
REDIS_URL=redis://redis:6379/0

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672/

# Twilio
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_twilio_number

# Meta (WhatsApp)
META_APP_ID=your_app_id
META_APP_SECRET=your_app_secret
META_PHONE_NUMBER_ID=your_phone_number_id
META_ACCESS_TOKEN=your_access_token
META_WEBHOOK_VERIFY_TOKEN=your_verify_token

# Bhashini
BHASHINI_API_KEY=your_bhashini_api_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Pinecone
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=arohan_traits
PINECONE_ENVIRONMENT=production

# Security
SECRET_KEY=your_secret_key_min_32_chars
JWT_SECRET_KEY=your_jwt_secret_key
JWT_ALGORITHM=RS256

# Monitoring
ENABLE_METRICS=true
PROMETHEUS_RETENTION_DAYS=30
```

### 5. SSL/TLS Configuration

```bash
# Install Certbot for Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot certonly --standalone -d api.yourdomain.com

# Create SSL directory
mkdir -p /opt/arohan/ssl

# Copy certificates
sudo cp /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem /opt/arohan/ssl/
sudo cp /etc/letsencrypt/live/api.yourdomain.com/privkey.pem /opt/arohan/ssl/

# Set permissions
sudo chmod 644 /opt/arohan/ssl/fullchain.pem
sudo chmod 600 /opt/arohan/ssl/privkey.pem
```

---

## Deployment Procedures

### 1. Initial Deployment

#### Step 1: Build Docker Images

```bash
cd /opt/arohan

# Build all services
docker-compose build

# Verify images were built
docker images | grep arohan
```

#### Step 2: Initialize Database

```bash
# Run database migrations
docker-compose run --rm api alembic upgrade head

# Verify database schema
docker-compose exec db psql -U arohan -d arohan -c "\dt"
```

#### Step 3: Start Services

```bash
# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps
```

#### Step 4: Verify Health

```bash
# Check API health
curl http://localhost:8000/health

# Check detailed health
curl http://localhost:8000/health/detailed

# Check dependencies
curl http://localhost:8000/health/dependencies
```

#### Step 5: Configure Monitoring

```bash
# Access Grafana
# URL: http://your-server:3000
# Default credentials: admin/admin

# Access Prometheus
# URL: http://your-server:9090

# Access Alertmanager
# URL: http://your-server:9093
```

### 2. Zero-Downtime Deployment

#### Step 1: Prepare New Version

```bash
# Pull latest code
git fetch origin
git checkout production
git pull origin production

# Build new images
docker-compose build
```

#### Step 2: Backup Current State

```bash
# Database backup
docker-compose exec db pg_dump -U arohan arohan > backups/db_backup_$(date +%Y%m%d_%H%M%S).sql

# Redis backup
docker-compose exec redis redis-cli --rdb /data/dump_$(date +%Y%m%d_%H%M%S).rdb
docker cp arohan-redis-1:/data/dump_$(date +%Y%m%d_%H%M%S).rdb backups/
```

#### Step 3: Deploy New Version

```bash
# Rolling update for API
docker-compose up -d --no-deps --build api

# Wait for health check
sleep 30

# Update workers
docker-compose up -d --no-deps --build celery-worker celery-beat

# Verify deployment
curl http://localhost:8000/health
```

#### Step 4: Clean Up

```bash
# Remove old images
docker image prune -f

# Remove old containers
docker container prune -f
```

### 3. Blue-Green Deployment

#### Step 1: Set Up Blue Environment

```bash
# Deploy blue environment
docker-compose -f docker-compose.yml -f docker-compose.blue.yml up -d
```

#### Step 2: Set Up Green Environment

```bash
# Deploy green environment
docker-compose -f docker-compose.yml -f docker-compose.green.yml up -d
```

#### Step 3: Switch Traffic

```bash
# Update load balancer to point to green environment
# (Implementation depends on your load balancer)
```

#### Step 4: Verify and Clean Up

```bash
# Monitor green environment
curl http://localhost:8001/health  # Green environment

# If successful, remove blue environment
docker-compose -f docker-compose.blue.yml down
```

---

## Post-Deployment Verification

### 1. Health Checks

```bash
# Basic health check
curl -f http://localhost:8000/health || echo "Health check failed"

# Detailed health check
curl -f http://localhost:8000/health/detailed | jq .

# Dependency health
curl -f http://localhost:8000/health/dependencies | jq .
```

### 2. Service Verification

```bash
# Check all services
docker-compose ps

# Check service logs
docker-compose logs --tail=100 api
docker-compose logs --tail=100 celery-worker
docker-compose logs --tail=100 db

# Check resource usage
docker stats
```

### 3. Database Verification

```bash
# Check database connections
docker-compose exec db psql -U arohan -d arohan -c "SELECT count(*) FROM pg_stat_activity;"

# Check table counts
docker-compose exec db psql -U arohan -d arohan -c "\dt"

# Run test query
docker-compose exec db psql -U arohan -d arohan -c "SELECT 1;"
```

### 4. Integration Testing

```bash
# Run integration tests
docker-compose run --rm api pytest tests/integration/ -v

# Run drop-off recovery tests
docker-compose run --rm api pytest tests/recovery/ -v

# Run production validation tests
docker-compose run --rm api pytest tests/production/ -v
```

### 5. Monitoring Verification

```bash
# Check Prometheus targets
curl http://localhost:9090/api/v1/targets | jq .

# Check Grafana dashboards
# Access: http://localhost:3000
# Verify dashboards are loading data

# Check alert rules
curl http://localhost:9090/api/v1/rules | jq .
```

### 6. Performance Verification

```bash
# Run load test
docker-compose run --rm api pytest tests/load_test.py -v

# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/health

# Monitor resource usage during load test
docker stats --no-stream
```

---

## Rollback Procedures

### 1. Immediate Rollback

```bash
# Stop current deployment
docker-compose down

# Restore previous version
git checkout previous-commit-hash

# Rebuild and start
docker-compose up -d

# Verify rollback
curl http://localhost:8000/health
```

### 2. Database Rollback

```bash
# Stop application services
docker-compose stop api celery-worker celery-beat

# Restore database backup
docker-compose exec -T db psql -U arohan -d arohan < backups/db_backup_YYYYMMDD_HHMMSS.sql

# Restart services
docker-compose start api celery-worker celery-beat

# Verify
curl http://localhost:8000/health
```

### 3. Configuration Rollback

```bash
# Restore previous configuration
cp config/.env.backup config/.env

# Restart services
docker-compose restart

# Verify
curl http://localhost:8000/health
```

### 4. Full System Rollback

```bash
# Complete system rollback
cd /opt/arohan
git checkout previous-production-tag
docker-compose down
docker-compose up -d

# Verify all services
docker-compose ps
curl http://localhost:8000/health
```

---

## Monitoring and Maintenance

### 1. Daily Maintenance Tasks

```bash
# Check service health
curl http://localhost:8000/health/detailed | jq .

# Review logs for errors
docker-compose logs --since=24h | grep -i error

# Check disk space
df -h

# Check memory usage
free -h

# Review backup status
ls -lh backups/
```

### 2. Weekly Maintenance Tasks

```bash
# Database maintenance
docker-compose exec db psql -U arohan -d arohan -c "VACUUM ANALYZE;"

# Clean old logs
docker-compose logs --tail=1000 > logs/archive_$(date +%Y%m%d).log
docker system prune -f

# Review performance metrics
# Access Grafana: http://localhost:3000

# Security updates
sudo apt update && sudo apt upgrade -y
```

### 3. Monthly Maintenance Tasks

```bash
# Full database backup
docker-compose exec db pg_dump -U arohan arohan > backups/monthly_backup_$(date +%Y%m).sql

# Review and optimize indexes
docker-compose exec db psql -U arohan -d arohan -c "SELECT * FROM pg_stat_user_indexes;"

# Update dependencies
cd /opt/arohan
docker-compose build --no-cache
docker-compose up -d

# Security audit
# Review access logs
# Check for unauthorized access attempts
```

### 4. Automated Monitoring

```bash
# Set up cron jobs for automated checks
crontab -e

# Add these entries:
# Health check every 5 minutes
*/5 * * * * curl -f http://localhost:8000/health || echo "Health check failed" | mail -s "AROHAN Health Check Failed" admin@yourdomain.com

# Daily backup at 2 AM
0 2 * * * cd /opt/arohan && docker-compose exec db pg_dump -U arohan arohan > backups/daily_backup_$(date +\%Y\%m\%d).sql

# Log rotation weekly
0 3 * * 0 find /opt/arohan/logs -name "*.log" -mtime +7 -delete
```

---

## Troubleshooting

### 1. Service Won't Start

```bash
# Check service logs
docker-compose logs api

# Check for port conflicts
sudo netstat -tulpn | grep :8000

# Check resource availability
docker stats

# Restart service
docker-compose restart api
```

### 2. Database Connection Issues

```bash
# Check database status
docker-compose ps db

# Check database logs
docker-compose logs db

# Test database connection
docker-compose exec db psql -U arohan -d arohan -c "SELECT 1;"

# Check connection pool
docker-compose logs api | grep "connection pool"
```

### 3. High Memory Usage

```bash
# Check memory usage
docker stats

# Identify memory-intensive containers
docker stats --no-stream | sort -k 4 -h

# Restart services if needed
docker-compose restart

# Consider scaling resources
# Update docker-compose.yml with increased limits
```

### 4. Slow Response Times

```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/health

# Check database query performance
docker-compose exec db psql -U arohan -d arohan -c "SELECT * FROM pg_stat_statements ORDER BY mean_exec_time DESC LIMIT 10;"

# Check for blocking queries
docker-compose exec db psql -U arohan -d arohan -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Review application logs
docker-compose logs api | grep -i slow
```

### 5. External Service Failures

```bash
# Check external service status
curl https://status.twilio.com
curl https://developers.facebook.com/status/

# Test API connectivity
docker-compose exec api curl -I https://api.twilio.com

# Check API credentials
# Verify environment variables
docker-compose exec api env | grep TWILIO

# Review error logs
docker-compose logs api | grep -i "twilio\|meta\|bhashini"
```

### 6. Redis Issues

```bash
# Check Redis status
docker-compose ps redis

# Test Redis connection
docker-compose exec redis redis-cli ping

# Check Redis memory usage
docker-compose exec redis redis-cli INFO memory

# Check Redis keys
docker-compose exec redis redis-cli DBSIZE
```

### 7. RabbitMQ Issues

```bash
# Check RabbitMQ status
docker-compose ps rabbitmq

# Access RabbitMQ management UI
# URL: http://localhost:15672
# Credentials: guest/guest

# Check queue status
docker-compose exec rabbitmq rabbitmqctl list_queues

# Check connection status
docker-compose exec rabbitmq rabbitmqctl list_connections
```

---

## Security Best Practices

### 1. Regular Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d

# Review security advisories
# Subscribe to security mailing lists
```

### 2. Access Control

```bash
# Restrict file permissions
chmod 600 config/.env
chmod 644 ssl/*

# Use firewall rules
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw deny 8000/tcp  # Restrict API access
sudo ufw enable
```

### 3. Secret Management

```bash
# Use environment variables for secrets
# Never commit secrets to version control

# Rotate secrets regularly
# Update API keys every 90 days
# Update database passwords every 180 days

# Use secret management tools
# Consider HashiCorp Vault or AWS Secrets Manager
```

### 4. Audit Logging

```bash
# Enable audit logging
# Review access logs regularly
docker-compose logs api | grep -i "audit\|auth"

# Monitor for suspicious activity
# Set up alerts for failed authentication attempts
```

---

## Performance Optimization

### 1. Database Optimization

```bash
# Update statistics
docker-compose exec db psql -U arohan -d arohan -c "ANALYZE;"

# Rebuild indexes
docker-compose exec db psql -U arohan -d arohan -c "REINDEX DATABASE arohan;"

# Optimize queries
# Review slow query log
# Add appropriate indexes
```

### 2. Caching Strategy

```bash
# Monitor Redis hit rate
docker-compose exec redis redis-cli INFO stats | grep keyspace

# Adjust cache TTL as needed
# Monitor cache effectiveness
```

### 3. Connection Pooling

```bash
# Monitor connection pool usage
docker-compose logs api | grep "connection pool"

# Adjust pool size in configuration
# Update DATABASE_URL with pool parameters
```

### 4. Load Balancing

```bash
# Configure Nginx as reverse proxy
# Set up multiple API instances
# Configure health checks
```

---

## Disaster Recovery

### 1. Backup Strategy

```bash
# Automated daily backups
0 2 * * * /opt/arohan/scripts/backup.sh

# Weekly full backups
0 3 * * 0 /opt/arohan/scripts/full_backup.sh

# Offsite backup replication
# Use rsync or cloud storage
```

### 2. Recovery Procedures

```bash
# Restore from backup
docker-compose exec -T db psql -U arohan -d arohan < backups/latest_backup.sql

# Verify data integrity
docker-compose exec db psql -U arohan -d arohan -c "SELECT count(*) FROM candidates;"
```

### 3. High Availability

```bash
# Set up database replication
# Configure Redis clustering
# Implement load balancing
# Set up failover procedures
```

---

## Support and Escalation

### 1. Contact Information

- **Primary Support**: support@arohan.ai
- **Emergency Contact**: emergency@arohan.ai
- **Documentation**: https://docs.arohan.ai

### 2. Escalation Matrix

| Issue Type | Response Time | Escalation Path |
|------------|---------------|-----------------|
| P0 - Critical | 15 minutes | On-call → Tech Lead → CTO |
| P1 - High | 1 hour | Support → Tech Lead |
| P2 - Medium | 4 hours | Support Team |
| P3 - Low | Next business day | Support Team |

### 3. Known Issues

Document known issues and workarounds in the project wiki.

---

## Appendix

### A. Configuration Files

**docker-compose.yml** - Main service orchestration
**config/.env** - Environment variables
**monitoring/** - Monitoring configuration

### B. Useful Commands

```bash
# View all containers
docker ps -a

# View container logs
docker logs <container_name>

# Execute command in container
docker exec -it <container_name> bash

# Remove all stopped containers
docker container prune

# Remove unused images
docker image prune -a

# View disk usage
docker system df
```

### C. Performance Tuning

**API Workers**: Adjust based on CPU cores
**Database Connections**: Configure pool size
**Redis Memory**: Adjust based on cache usage
**Celery Workers**: Scale based on task queue

---

## Document Version

- **Version**: 1.0
- **Last Updated**: 2025-04-24
- **Maintained By**: DevOps Team
- **Review Date**: 2025-07-24