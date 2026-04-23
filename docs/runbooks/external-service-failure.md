# External Service Failure Runbook

## Overview
This runbook covers failures with external services that AROHAN depends on:
- **Twilio**: IVR calls and SMS
- **Meta (WhatsApp)**: WhatsApp messaging
- **Bhashini**: Speech-to-Text API
- **OpenAI**: Whisper fallback and embeddings
- **Pinecone**: Vector database for trait scoring

## Severity Levels
- **P0 - Critical**: Complete service outage, blocking core functionality
- **P1 - High**: Major degradation, significant user impact
- **P2 - Medium**: Partial degradation, limited user impact
- **P3 - Low**: Minor issues, minimal user impact

## Service-Specific Runbooks

### 1. Twilio Service Failure

**Symptoms:**
- IVR calls not initiating
- SMS not sending
- Twilio API errors in logs
- Prometheus alert: `TwilioAPIFailure`

**Immediate Actions (0-5 minutes):**
1. Check Twilio status page: https://status.twilio.com
2. Verify API credentials in environment variables
3. Check account balance and quotas
4. Review Twilio error logs in console

**Investigation Steps (5-15 minutes):**
1. Test Twilio API directly:
   ```bash
   curl -X POST https://api.twilio.com/2010-04-01/Accounts/$TWILIO_ACCOUNT_SID/Calls.json \
   -u "$TWILIO_ACCOUNT_SID:$TWILIO_AUTH_TOKEN" \
   -d "Url=http://demo.twilio.com/docs/voice.xml" \
   -d "To=+15555555555" \
   -d "From=+15555555556"
   ```
2. Check for rate limiting or account suspension
3. Review recent API usage patterns
4. Verify phone number configuration

**Resolution Steps:**
1. If credentials invalid: Update environment variables and restart
2. If rate limited: Implement exponential backoff and queueing
3. If account suspended: Contact Twilio support immediately
4. If service outage: Enable fallback mechanisms

**Fallback Mechanisms:**
- Queue failed calls for retry
- Send SMS notification of service issues
- Display maintenance message in IVR
- Log all failed attempts for later processing

**Verification:**
- Test call initiates successfully
- SMS sends successfully
- No Twilio errors in logs
- Queue processing resumes

**Prevention:**
- Monitor Twilio API usage and quotas
- Implement rate limiting on our side
- Set up alerts for low account balance
- Regular credential rotation

---

### 2. Meta (WhatsApp) Service Failure

**Symptoms:**
- WhatsApp messages not sending
- Webhook not receiving events
- Meta API errors
- Prometheus alert: `MetaAPIFailure`

**Immediate Actions (0-5 minutes):**
1. Check Meta Platform Status: https://developers.facebook.com/status/
2. Verify webhook configuration
3. Check access token validity
4. Review Meta error logs

**Investigation Steps (5-15 minutes):**
1. Test webhook endpoint:
   ```bash
   curl -X POST https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages \
   -H "Authorization: Bearer $META_ACCESS_TOKEN" \
   -H "Content-Type: application/json" \
   -d '{
     "messaging_product": "whatsapp",
     "to": "15555555555",
     "type": "text",
     "text": {"body": "Test message"}
   }'
   ```
2. Verify webhook is receiving events
3. Check for rate limiting or policy violations
4. Review message template approval status

**Resolution Steps:**
1. If webhook issue: Update webhook URL and verify
2. If token expired: Generate new access token
3. If rate limited: Implement message queuing
4. If policy violation: Review and fix compliance issues

**Fallback Mechanisms:**
- Queue failed messages for retry
- Send SMS fallback for critical messages
- Display service status in app
- Log all failed attempts

**Verification:**
- Test message sends successfully
- Webhook receives events
- No Meta API errors
- Message queue processing

**Prevention:**
- Monitor webhook health
- Implement message queuing
- Set up token refresh automation
- Regular compliance reviews

---

### 3. Bhashini STT Service Failure

**Symptoms:**
- Speech-to-text not working
- Bhashini API errors
- Long transcription times
- Fallback to Whisper not triggering

**Immediate Actions (0-5 minutes):**
1. Check Bhashini service status
2. Verify API key validity
3. Check for rate limiting
4. Review error logs

**Investigation Steps (5-15 minutes):**
1. Test Bhashini API directly
2. Check audio format compatibility
3. Review recent API changes
4. Verify language support

**Resolution Steps:**
1. If API key invalid: Update credentials
2. If rate limited: Implement request queuing
3. If service down: Enable Whisper fallback
4. If format issue: Convert audio format

**Fallback Mechanisms:**
- Automatic fallback to OpenAI Whisper
- Queue failed transcriptions
- Notify users of service issues
- Log all failures for analysis

**Verification:**
- Transcription working (primary or fallback)
- No STT errors in logs
- Processing times acceptable
- Fallback mechanism tested

**Prevention:**
- Implement robust fallback logic
- Monitor API usage and quotas
- Test fallback mechanisms regularly
- Cache common transcriptions

---

### 4. OpenAI API Failure

**Symptoms:**
- Whisper fallback not working
- Embedding generation failing
- OpenAI API errors
- High latency

**Immediate Actions (0-5 minutes):**
1. Check OpenAI status page: https://status.openai.com
2. Verify API key and credits
3. Check rate limits
4. Review error logs

**Investigation Steps (5-15 minutes):**
1. Test OpenAI API directly
2. Check for model availability
3. Review usage patterns
4. Verify request format

**Resolution Steps:**
1. If API key invalid: Update credentials
2. If out of credits: Add credits or upgrade plan
3. If rate limited: Implement request queuing
4. If model down: Use alternative model

**Fallback Mechanisms:**
- Queue failed requests
- Use cached results when possible
- Notify users of service issues
- Implement graceful degradation

**Verification:**
- API calls succeeding
- Response times acceptable
- No errors in logs
- Fallback mechanisms working

**Prevention:**
- Monitor API usage and costs
- Implement request caching
- Set up usage alerts
- Regular testing of fallbacks

---

### 5. Pinecone Vector Database Failure

**Symptoms:**
- Trait scoring not working
- Vector search failures
- Pinecone API errors
- Slow similarity searches

**Immediate Actions (0-5 minutes):**
1. Check Pinecone status page
2. Verify API key
3. Check index status
4. Review error logs

**Investigation Steps (5-15 minutes):**
1. Test Pinecone API directly
2. Check index health and capacity
3. Review query patterns
4. Verify vector dimensions

**Resolution Steps:**
1. If API key invalid: Update credentials
2. If index down: Recreate index from backup
3. If capacity issue: Scale up index
4. If query issue: Optimize search parameters

**Fallback Mechanisms:**
- Use keyword-based scoring as fallback
- Cache similarity results
- Queue failed operations
- Notify users of degraded service

**Verification:**
- Vector searches working
- Scorecard generation functioning
- No Pinecone errors
- Performance acceptable

**Prevention:**
- Monitor index capacity and performance
- Implement result caching
- Regular index backups
- Test fallback mechanisms

---

## General External Service Failure Protocol

### Detection
- Prometheus alerts for high failure rates
- Log monitoring for API errors
- Uptime monitoring for service availability
- User-reported issues

### Triage
1. Identify which service is failing
2. Determine severity level
3. Assess impact on users
4. Check if fallback mechanisms exist

### Mitigation
1. Enable fallback mechanisms if available
2. Queue failed operations for retry
3. Notify users of service issues
4. Implement graceful degradation

### Resolution
1. Fix root cause (credentials, configuration, etc.)
2. Process queued operations
3. Verify service is fully operational
4. Monitor for recurrence

### Communication
- **P0**: Immediate notification via all channels
- **P1**: Notification within 15 minutes
- **P2**: Notification within 1 hour
- **P3**: Notification next business day

## Testing Fallback Mechanisms

### Regular Testing Schedule
- **Daily**: Automated health checks
- **Weekly**: Fallback mechanism tests
- **Monthly**: Full service outage simulation
- **Quarterly**: Disaster recovery drill

### Test Scenarios
1. **API Key Rotation**: Test credential updates
2. **Rate Limiting**: Test queuing and backoff
3. **Service Outage**: Test fallback activation
4. **Network Issues**: Test retry logic

## Monitoring and Alerting

### Key Metrics
- API success rate
- Response time percentiles
- Error rate by service
- Queue depth
- Fallback activation rate

### Alert Thresholds
- **Critical**: Success rate < 90% for 5 minutes
- **Warning**: Success rate < 95% for 10 minutes
- **Info**: Response time > 2x baseline

## Documentation

### Service Configuration
- API endpoints and versions
- Authentication methods
- Rate limits and quotas
- Fallback mechanisms

### Runbook Maintenance
- Update after each incident
- Test fallback mechanisms regularly
- Review and update quarterly
- Share lessons learned

## Related Runbooks
- API Failure Runbook
- Database Failure Runbook
- Network Failure Runbook
- Security Incident Runbook