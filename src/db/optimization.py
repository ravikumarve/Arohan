"""
AROHAN Database Optimization
Additional indexes, constraints, triggers, and views for performance
"""

from sqlalchemy import text
from src.db.database import engine


# ============================================================================
# Performance Indexes
# ============================================================================

PERFORMANCE_INDEXES = [
    # Company indexes
    "CREATE INDEX IF NOT EXISTS idx_companies_plan_status ON companies(plan, status) WHERE status = 'active';",
    
    # User indexes
    "CREATE INDEX IF NOT EXISTS idx_users_company_role ON users(company_id, role) WHERE status = 'active';",
    "CREATE INDEX IF NOT EXISTS idx_users_last_login ON users(last_login DESC) WHERE last_login IS NOT NULL;",
    
    # Requisition indexes
    "CREATE INDEX IF NOT EXISTS idx_requisitions_company_status ON requisitions(company_id, status) WHERE status = 'open';",
    "CREATE INDEX IF NOT EXISTS idx_requisitions_geo_radius ON requisitions(pin_code, geo_radius_km) WHERE status = 'open';",
    "CREATE INDEX IF NOT EXISTS idx_requisitions_score_threshold ON requisitions(score_threshold DESC) WHERE status = 'open';",
    
    # Campaign indexes
    "CREATE INDEX IF NOT EXISTS idx_campaigns_company_status ON campaigns(company_id, status) WHERE status = 'active';",
    "CREATE INDEX IF NOT EXISTS idx_campaigns_requisition_status ON campaigns(requisition_id, status) WHERE status = 'active';",
    
    # Candidate indexes
    "CREATE INDEX IF NOT EXISTS idx_candidates_campaign_status ON candidates(campaign_id, status) WHERE campaign_id IS NOT NULL;",
    "CREATE INDEX IF NOT EXISTS idx_candidates_phone_status ON candidates(phone, status);",
    "CREATE INDEX IF NOT EXISTS idx_candidates_geo_pin ON candidates(pin_code, status) WHERE status = 'completed';",
    "CREATE INDEX IF NOT EXISTS idx_candidates_language_status ON candidates(language_detected, status) WHERE status = 'completed';",
    "CREATE INDEX IF NOT EXISTS idx_candidates_created_at ON candidates(created_at DESC);",
    
    # Transcript indexes
    "CREATE INDEX IF NOT EXISTS idx_transcripts_candidate_created ON transcripts(candidate_id, created_at DESC);",
    "CREATE INDEX IF NOT EXISTS idx_transcripts_confidence ON transcripts(confidence_score DESC) WHERE confidence_score IS NOT NULL;",
    
    # Scorecard indexes
    "CREATE INDEX IF NOT EXISTS idx_scorecards_candidate_overall ON scorecards(candidate_id, overall_score DESC);",
    "CREATE INDEX IF NOT EXISTS idx_scorecards_requisition_shortlist ON scorecards(requisition_id, shortlist_flag, overall_score DESC) WHERE shortlist_flag = true;",
    "CREATE INDEX IF NOT EXISTS idx_scorecards_overall_threshold ON scorecards(overall_score DESC) WHERE overall_score >= 70;",
    
    # Session indexes
    "CREATE INDEX IF NOT EXISTS idx_sessions_candidate_state ON candidate_sessions(candidate_id, interview_state) WHERE interview_state IN ('in_progress', 'dropped_off');",
    "CREATE INDEX IF NOT EXISTS idx_sessions_last_active ON candidate_sessions(last_active_at DESC) WHERE interview_state = 'in_progress';",
    "CREATE INDEX IF NOT EXISTS idx_sessions_recovery ON candidate_sessions(interview_state, last_active_at) WHERE interview_state = 'dropped_off';",
    
    # Audit trail indexes
    "CREATE INDEX IF NOT EXISTS idx_audit_entity_type_id ON audit_trail(entity_type, entity_id, created_at DESC);",
    "CREATE INDEX IF NOT EXISTS idx_audit_user_created ON audit_trail(user_id, created_at DESC) WHERE user_id IS NOT NULL;",
    "CREATE INDEX IF NOT EXISTS idx_audit_event_type ON audit_trail(event_type, created_at DESC);",
    
    # Event indexes
    "CREATE INDEX IF NOT EXISTS idx_events_audited ON events(audited, created_at) WHERE audited = false;",
    "CREATE INDEX IF NOT EXISTS idx_events_entity_created ON events(entity_type, entity_id, created_at DESC);",
]


# ============================================================================
# Database Constraints
# ============================================================================

CONSTRAINTS = [
    # Company constraints
    "ALTER TABLE companies ADD CONSTRAINT chk_companies_plan CHECK (plan IN ('startup', 'growth', 'enterprise'));",
    "ALTER TABLE companies ADD CONSTRAINT chk_companies_status CHECK (status IN ('active', 'suspended', 'deleted'));",
    
    # User constraints
    "ALTER TABLE users ADD CONSTRAINT chk_users_role CHECK (role IN ('admin', 'viewer', 'recruiter'));",
    "ALTER TABLE users ADD CONSTRAINT chk_users_status CHECK (status IN ('active', 'inactive', 'deleted'));",
    
    # Requisition constraints
    "ALTER TABLE requisitions ADD CONSTRAINT chk_requisitions_score CHECK (score_threshold >= 0 AND score_threshold <= 100);",
    "ALTER TABLE requisitions ADD CONSTRAINT chk_requisitions_radius CHECK (geo_radius_km >= 1 AND geo_radius_km <= 100);",
    "ALTER TABLE requisitions ADD CONSTRAINT chk_requisitions_status CHECK (status IN ('open', 'closed', 'paused'));",
    "ALTER TABLE requisitions ADD CONSTRAINT chk_requisitions_shift CHECK (shift_preference IN ('day', 'night', 'flexible') OR shift_preference IS NULL);",
    
    # Campaign constraints
    "ALTER TABLE campaigns ADD CONSTRAINT chk_campaigns_status CHECK (status IN ('active', 'completed', 'paused'));",
    "ALTER TABLE campaigns ADD CONSTRAINT chk_campaigns_dates CHECK (completed_at IS NULL OR completed_at >= created_at);",
    
    # Candidate constraints
    "ALTER TABLE candidates ADD CONSTRAINT chk_candidates_status CHECK (status IN ('pending', 'in_progress', 'completed', 'shortlisted', 'rejected'));",
    "ALTER TABLE candidates ADD CONSTRAINT chk_candidates_dates CHECK (enriched_at IS NULL OR enriched_at >= created_at);",
    
    # Transcript constraints
    "ALTER TABLE transcripts ADD CONSTRAINT chk_transcripts_duration CHECK (audio_duration_seconds IS NULL OR audio_duration_seconds >= 0);",
    "ALTER TABLE transcripts ADD CONSTRAINT chk_transcripts_confidence CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 1));",
    "ALTER TABLE transcripts ADD CONSTRAINT chk_transcripts_dates CHECK (normalized_at IS NULL OR normalized_at >= created_at);",
    
    # Scorecard constraints
    "ALTER TABLE scorecards ADD CONSTRAINT chk_scorecards_overall CHECK (overall_score >= 0 AND overall_score <= 100);",
    "ALTER TABLE scorecards ADD CONSTRAINT chk_scorecards_communication CHECK (communication_score IS NULL OR (communication_score >= 0 AND communication_score <= 100));",
    "ALTER TABLE scorecards ADD CONSTRAINT chk_scorecards_domain CHECK (domain_knowledge_score IS NULL OR (domain_knowledge_score >= 0 AND domain_knowledge_score <= 100));",
    "ALTER TABLE scorecards ADD CONSTRAINT chk_scorecards_situational CHECK (situational_judgment_score IS NULL OR (situational_judgment_score >= 0 AND situational_judgment_score <= 100));",
    "ALTER TABLE scorecards ADD CONSTRAINT chk_scorecards_confidence CHECK (confidence_score IS NULL OR (confidence_score >= 0 AND confidence_score <= 100));",
    "ALTER TABLE scorecards ADD CONSTRAINT chk_scorecards_fluency CHECK (language_fluency IN ('native', 'proficient', 'functional') OR language_fluency IS NULL);",
    
    # Session constraints
    "ALTER TABLE candidate_sessions ADD CONSTRAINT chk_sessions_state CHECK (interview_state IN ('initiated', 'in_progress', 'completed', 'dropped_off', 'recovered'));",
    "ALTER TABLE candidate_sessions ADD CONSTRAINT chk_sessions_questions CHECK (current_question_index >= 0 AND current_question_index <= total_questions);",
    "ALTER TABLE candidate_sessions ADD CONSTRAINT chk_sessions_duration CHECK (interview_duration_seconds >= 0);",
    "ALTER TABLE candidate_sessions ADD CONSTRAINT chk_sessions_dates CHECK (last_active_at >= created_at AND (completed_at IS NULL OR completed_at >= created_at));",
]


# ============================================================================
# Database Triggers
# ============================================================================

TRIGGERS = [
    # Update timestamp trigger for companies
    """
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';
    """,
    
    # Apply update timestamp triggers
    "DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;",
    "CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    "DROP TRIGGER IF EXISTS update_users_updated_at ON users;",
    "CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    "DROP TRIGGER IF EXISTS update_requisitions_updated_at ON requisitions;",
    "CREATE TRIGGER update_requisitions_updated_at BEFORE UPDATE ON requisitions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    "DROP TRIGGER IF EXISTS update_campaigns_updated_at ON campaigns;",
    "CREATE TRIGGER update_campaigns_updated_at BEFORE UPDATE ON campaigns FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    "DROP TRIGGER IF EXISTS update_candidates_updated_at ON candidates;",
    "CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    "DROP TRIGGER IF EXISTS update_transcripts_updated_at ON transcripts;",
    "CREATE TRIGGER update_transcripts_updated_at BEFORE UPDATE ON transcripts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    "DROP TRIGGER IF EXISTS update_scorecards_updated_at ON scorecards;",
    "CREATE TRIGGER update_scorecards_updated_at BEFORE UPDATE ON scorecards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();",
    
    # Audit trail trigger
    """
    CREATE OR REPLACE FUNCTION create_audit_trail()
    RETURNS TRIGGER AS $$
    BEGIN
        IF TG_OP = 'INSERT' THEN
            INSERT INTO audit_trail (event_type, entity_type, entity_id, changes, created_at)
            VALUES ('created', TG_TABLE_NAME, NEW.id, row_to_json(NEW), CURRENT_TIMESTAMP);
            RETURN NEW;
        ELSIF TG_OP = 'UPDATE' THEN
            INSERT INTO audit_trail (event_type, entity_type, entity_id, changes, created_at)
            VALUES ('updated', TG_TABLE_NAME, NEW.id, jsonb_build_object('old', row_to_json(OLD), 'new', row_to_json(NEW)), CURRENT_TIMESTAMP);
            RETURN NEW;
        ELSIF TG_OP = 'DELETE' THEN
            INSERT INTO audit_trail (event_type, entity_type, entity_id, changes, created_at)
            VALUES ('deleted', TG_TABLE_NAME, OLD.id, row_to_json(OLD), CURRENT_TIMESTAMP);
            RETURN OLD;
        END IF;
        RETURN NULL;
    END;
    $$ language 'plpgsql';
    """,
    
    # Apply audit trail triggers to key tables
    "DROP TRIGGER IF EXISTS audit_companies ON companies;",
    "CREATE TRIGGER audit_companies AFTER INSERT OR UPDATE OR DELETE ON companies FOR EACH ROW EXECUTE FUNCTION create_audit_trail();",
    
    "DROP TRIGGER IF EXISTS audit_users ON users;",
    "CREATE TRIGGER audit_users AFTER INSERT OR UPDATE OR DELETE ON users FOR EACH ROW EXECUTE FUNCTION create_audit_trail();",
    
    "DROP TRIGGER IF EXISTS audit_requisitions ON requisitions;",
    "CREATE TRIGGER audit_requisitions AFTER INSERT OR UPDATE OR DELETE ON requisitions FOR EACH ROW EXECUTE FUNCTION create_audit_trail();",
    
    "DROP TRIGGER IF EXISTS audit_campaigns ON campaigns;",
    "CREATE TRIGGER audit_campaigns AFTER INSERT OR UPDATE OR DELETE ON campaigns FOR EACH ROW EXECUTE FUNCTION create_audit_trail();",
    
    "DROP TRIGGER IF EXISTS audit_candidates ON candidates;",
    "CREATE TRIGGER audit_candidates AFTER INSERT OR UPDATE OR DELETE ON candidates FOR EACH ROW EXECUTE FUNCTION create_audit_trail();",
    
    "DROP TRIGGER IF EXISTS audit_scorecards ON scorecards;",
    "CREATE TRIGGER audit_scorecards AFTER INSERT OR UPDATE OR DELETE ON scorecards FOR EACH ROW EXECUTE FUNCTION create_audit_trail();",
]


# ============================================================================
# Database Functions
# ============================================================================

FUNCTIONS = [
    # Function to calculate candidate match score
    """
    CREATE OR REPLACE FUNCTION calculate_match_score(
        p_candidate_id UUID,
        p_requisition_id UUID
    ) RETURNS FLOAT AS $$
    DECLARE
        v_score FLOAT;
        v_scorecard RECORD;
        v_requisition RECORD;
    BEGIN
        -- Get scorecard
        SELECT * INTO v_scorecard FROM scorecards WHERE candidate_id = p_candidate_id;
        
        -- Get requisition
        SELECT * INTO v_requisition FROM requisitions WHERE id = p_requisition_id;
        
        -- Calculate match score based on scorecard and requisition threshold
        IF v_scorecard IS NOT NULL AND v_requisition IS NOT NULL THEN
            v_score := (v_scorecard.overall_score / v_requisition.score_threshold) * 100;
        ELSE
            v_score := 0;
        END IF;
        
        RETURN v_score;
    END;
    $$ LANGUAGE plpgsql;
    """,
    
    # Function to get candidate statistics
    """
    CREATE OR REPLACE FUNCTION get_candidate_statistics(p_campaign_id UUID)
    RETURNS JSONB AS $$
    DECLARE
        v_stats JSONB;
    BEGIN
        SELECT jsonb_build_object(
            'total', COUNT(*),
            'pending', COUNT(*) FILTER (WHERE status = 'pending'),
            'in_progress', COUNT(*) FILTER (WHERE status = 'in_progress'),
            'completed', COUNT(*) FILTER (WHERE status = 'completed'),
            'shortlisted', COUNT(*) FILTER (WHERE status = 'shortlisted'),
            'rejected', COUNT(*) FILTER (WHERE status = 'rejected'),
            'avg_score', COALESCE(AVG(s.overall_score), 0),
            'completion_rate', COALESCE(
                (COUNT(*) FILTER (WHERE status IN ('completed', 'shortlisted', 'rejected'))::FLOAT / NULLIF(COUNT(*), 0)) * 100, 
                0
            )
        ) INTO v_stats
        FROM candidates c
        LEFT JOIN scorecards s ON c.id = s.candidate_id
        WHERE c.campaign_id = p_campaign_id;
        
        RETURN v_stats;
    END;
    $$ LANGUAGE plpgsql;
    """,
    
    # Function to get requisition statistics
    """
    CREATE OR REPLACE FUNCTION get_requisition_statistics(p_requisition_id UUID)
    RETURNS JSONB AS $$
    DECLARE
        v_stats JSONB;
    BEGIN
        SELECT jsonb_build_object(
            'total_candidates', COUNT(DISTINCT c.id),
            'completed_interviews', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed'),
            'shortlisted', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'shortlisted'),
            'rejected', COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'rejected'),
            'avg_score', COALESCE(AVG(s.overall_score), 0),
            'shortlist_rate', COALESCE(
                (COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'shortlisted')::FLOAT / 
                 NULLIF(COUNT(DISTINCT c.id) FILTER (WHERE c.status IN ('completed', 'shortlisted', 'rejected')), 0)) * 100,
                0
            )
        ) INTO v_stats
        FROM candidates c
        JOIN campaigns camp ON c.campaign_id = camp.id
        LEFT JOIN scorecards s ON c.id = s.candidate_id
        WHERE camp.requisition_id = p_requisition_id;
        
        RETURN v_stats;
    END;
    $$ LANGUAGE plpgsql;
    """,
    
    # Function to clean up old sessions
    """
    CREATE OR REPLACE FUNCTION cleanup_old_sessions(days_to_keep INTEGER DEFAULT 30)
    RETURNS INTEGER AS $$
    DECLARE
        v_deleted_count INTEGER;
    BEGIN
        DELETE FROM candidate_sessions
        WHERE last_active_at < CURRENT_TIMESTAMP - (days_to_keep || ' days')::INTERVAL
        AND interview_state IN ('completed', 'dropped_off');
        
        GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
        RETURN v_deleted_count;
    END;
    $$ LANGUAGE plpgsql;
    """,
]


# ============================================================================
# Database Views
# ============================================================================

VIEWS = [
    # View for candidate summary with scorecard
    """
    CREATE OR REPLACE VIEW v_candidate_summary AS
    SELECT 
        c.id,
        c.campaign_id,
        c.phone,
        c.pin_code,
        c.name,
        c.email,
        c.language_detected,
        c.status,
        c.created_at,
        s.id as scorecard_id,
        s.overall_score,
        s.communication_score,
        s.domain_knowledge_score,
        s.situational_judgment_score,
        s.confidence_score,
        s.language_fluency,
        s.shortlist_flag,
        s.recommended_roles,
        camp.name as campaign_name,
        camp.requisition_id,
        req.title as requisition_title,
        req.score_threshold as requisition_threshold
    FROM candidates c
    LEFT JOIN scorecards s ON c.id = s.candidate_id
    LEFT JOIN campaigns camp ON c.campaign_id = camp.id
    LEFT JOIN requisitions req ON camp.requisition_id = req.id;
    """,
    
    # View for active sessions
    """
    CREATE OR REPLACE VIEW v_active_sessions AS
    SELECT 
        cs.id,
        cs.session_id,
        cs.candidate_id,
        c.phone,
        c.name,
        cs.interview_state,
        cs.current_question_index,
        cs.total_questions,
        cs.interview_duration_seconds,
        cs.language_detected,
        cs.inbound_channel,
        cs.drop_off_count,
        cs.last_active_at,
        cs.created_at,
        EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - cs.last_active_at)) as inactive_seconds
    FROM candidate_sessions cs
    JOIN candidates c ON cs.candidate_id = c.id
    WHERE cs.interview_state IN ('in_progress', 'dropped_off');
    """,
    
    # View for campaign analytics
    """
    CREATE OR REPLACE VIEW v_campaign_analytics AS
    SELECT 
        camp.id,
        camp.name,
        camp.company_id,
        camp.requisition_id,
        camp.status,
        camp.created_at,
        COUNT(DISTINCT c.id) as total_candidates,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed') as completed,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'shortlisted') as shortlisted,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'rejected') as rejected,
        COALESCE(AVG(s.overall_score), 0) as avg_score,
        COALESCE(
            (COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'shortlisted')::FLOAT / 
             NULLIF(COUNT(DISTINCT c.id) FILTER (WHERE c.status IN ('completed', 'shortlisted', 'rejected')), 0)) * 100,
            0
        ) as shortlist_rate
    FROM campaigns camp
    LEFT JOIN candidates c ON camp.id = c.campaign_id
    LEFT JOIN scorecards s ON c.id = s.candidate_id
    GROUP BY camp.id, camp.name, camp.company_id, camp.requisition_id, camp.status, camp.created_at;
    """,
    
    # View for requisition analytics
    """
    CREATE OR REPLACE VIEW v_requisition_analytics AS
    SELECT 
        req.id,
        req.company_id,
        req.title,
        req.status,
        req.score_threshold,
        req.geo_radius_km,
        req.pin_code,
        req.created_at,
        COUNT(DISTINCT camp.id) as total_campaigns,
        COUNT(DISTINCT c.id) as total_candidates,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'completed') as completed_interviews,
        COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'shortlisted') as shortlisted,
        COALESCE(AVG(s.overall_score), 0) as avg_score,
        COALESCE(
            (COUNT(DISTINCT c.id) FILTER (WHERE c.status = 'shortlisted')::FLOAT / 
             NULLIF(COUNT(DISTINCT c.id) FILTER (WHERE c.status IN ('completed', 'shortlisted', 'rejected')), 0)) * 100,
            0
        ) as shortlist_rate
    FROM requisitions req
    LEFT JOIN campaigns camp ON req.id = camp.requisition_id
    LEFT JOIN candidates c ON camp.id = c.campaign_id
    LEFT JOIN scorecards s ON c.id = s.candidate_id
    GROUP BY req.id, req.company_id, req.title, req.status, req.score_threshold, req.geo_radius_km, req.pin_code, req.created_at;
    """,
]


# ============================================================================
# Database Setup Functions
# ============================================================================

async def create_performance_indexes():
    """Create all performance indexes"""
    async with engine.begin() as conn:
        for index_sql in PERFORMANCE_INDEXES:
            try:
                await conn.execute(text(index_sql))
                print(f"✅ Created index: {index_sql[:50]}...")
            except Exception as e:
                print(f"❌ Error creating index: {e}")


async def create_constraints():
    """Create all database constraints"""
    async with engine.begin() as conn:
        for constraint_sql in CONSTRAINTS:
            try:
                await conn.execute(text(constraint_sql))
                print(f"✅ Created constraint: {constraint_sql[:50]}...")
            except Exception as e:
                print(f"❌ Error creating constraint: {e}")


async def create_triggers():
    """Create all database triggers"""
    async with engine.begin() as conn:
        for trigger_sql in TRIGGERS:
            try:
                await conn.execute(text(trigger_sql))
                print(f"✅ Created trigger: {trigger_sql[:50]}...")
            except Exception as e:
                print(f"❌ Error creating trigger: {e}")


async def create_functions():
    """Create all database functions"""
    async with engine.begin() as conn:
        for function_sql in FUNCTIONS:
            try:
                await conn.execute(text(function_sql))
                print(f"✅ Created function: {function_sql[:50]}...")
            except Exception as e:
                print(f"❌ Error creating function: {e}")


async def create_views():
    """Create all database views"""
    async with engine.begin() as conn:
        for view_sql in VIEWS:
            try:
                await conn.execute(text(view_sql))
                print(f"✅ Created view: {view_sql[:50]}...")
            except Exception as e:
                print(f"❌ Error creating view: {e}")


async def setup_database_optimization():
    """Setup all database optimization components"""
    print("🚀 Setting up database optimization...")
    
    print("\n📊 Creating performance indexes...")
    await create_performance_indexes()
    
    print("\n🔒 Creating database constraints...")
    await create_constraints()
    
    print("\n⚡ Creating database triggers...")
    await create_triggers()
    
    print("\n🔧 Creating database functions...")
    await create_functions()
    
    print("\n👁️  Creating database views...")
    await create_views()
    
    print("\n✅ Database optimization complete!")


if __name__ == "__main__":
    import asyncio
    asyncio.run(setup_database_optimization())