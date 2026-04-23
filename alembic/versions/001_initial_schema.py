"""Initial database schema creation

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-04-24 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create companies table
    op.create_table(
        'companies',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('domain', sa.String(255), unique=True, nullable=False),
        sa.Column('industry', sa.String(100)),
        sa.Column('size', sa.String(50)),
        sa.Column('plan', sa.String(50), default='startup'),
        sa.Column('status', sa.String(20), default='active'),
        sa.Column('settings', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
    )
    op.create_index('idx_companies_domain', 'companies', ['domain'])
    op.create_index('idx_companies_status', 'companies', ['status'])

    # Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('phone', sa.String(20), unique=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('role', sa.String(50), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('status', sa.String(20), default='active'),
        sa.Column('last_login', sa.DateTime()),
        sa.Column('settings', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
    )
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_company_id', 'users', ['company_id'])
    op.create_index('idx_users_role', 'users', ['role'])
    op.create_index('idx_users_status', 'users', ['status'])

    # Create requisitions table
    op.create_table(
        'requisitions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('requirements', postgresql.JSONB, default={}),
        sa.Column('score_threshold', sa.Integer(), default=70),
        sa.Column('geo_radius_km', sa.Integer(), default=10),
        sa.Column('pin_code', sa.String(10)),
        sa.Column('shift_preference', sa.String(50)),
        sa.Column('salary_range', sa.String(50)),
        sa.Column('status', sa.String(20), default='open'),
        sa.Column('statistics', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
    )
    op.create_index('idx_requisitions_company_id', 'requisitions', ['company_id'])
    op.create_index('idx_requisitions_status', 'requisitions', ['status'])
    op.create_index('idx_requisitions_pin_code', 'requisitions', ['pin_code'])
    op.create_index('idx_requisitions_score_threshold', 'requisitions', ['score_threshold'])

    # Create campaigns table
    op.create_table(
        'campaigns',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('company_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('requisition_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('description', sa.Text()),
        sa.Column('status', sa.String(20), default='active'),
        sa.Column('settings', postgresql.JSONB, default={}),
        sa.Column('statistics', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.Column('completed_at', sa.DateTime()),
        sa.ForeignKeyConstraint(['company_id'], ['companies.id'], ),
        sa.ForeignKeyConstraint(['requisition_id'], ['requisitions.id'], ),
    )
    op.create_index('idx_campaigns_company_id', 'campaigns', ['company_id'])
    op.create_index('idx_campaigns_requisition_id', 'campaigns', ['requisition_id'])
    op.create_index('idx_campaigns_status', 'campaigns', ['status'])

    # Create candidates table
    op.create_table(
        'candidates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('campaign_id', postgresql.UUID(as_uuid=True)),
        sa.Column('phone', sa.String(20), nullable=False, unique=True),
        sa.Column('pin_code', sa.String(10), nullable=False),
        sa.Column('name', sa.String(255)),
        sa.Column('email', sa.String(255)),
        sa.Column('language_detected', sa.String(10), default='hi-IN'),
        sa.Column('inbound_channel', sa.String(50)),
        sa.Column('status', sa.String(20), default='pending'),
        sa.Column('geo_data', postgresql.JSONB, default={}),
        sa.Column('language_data', postgresql.JSONB, default={}),
        sa.Column('demographic_data', postgresql.JSONB, default={}),
        sa.Column('enriched_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['campaign_id'], ['campaigns.id'], ),
    )
    op.create_index('idx_candidates_phone', 'candidates', ['phone'])
    op.create_index('idx_candidates_pin_code', 'candidates', ['pin_code'])
    op.create_index('idx_candidates_campaign_id', 'candidates', ['campaign_id'])
    op.create_index('idx_candidates_status', 'candidates', ['status'])
    op.create_index('idx_candidates_language_detected', 'candidates', ['language_detected'])

    # Create transcripts table
    op.create_table(
        'transcripts',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('candidate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('raw_text', sa.Text(), nullable=False),
        sa.Column('normalized_text', sa.Text()),
        sa.Column('language_detected', sa.String(10)),
        sa.Column('audio_url', sa.String(500)),
        sa.Column('audio_duration_seconds', sa.Integer()),
        sa.Column('segments', postgresql.JSONB, default=[]),
        sa.Column('confidence_score', sa.Float()),
        sa.Column('normalized', sa.Boolean(), default=False),
        sa.Column('normalized_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], ),
    )
    op.create_index('idx_transcripts_candidate_id', 'transcripts', ['candidate_id'])
    op.create_index('idx_transcripts_language_detected', 'transcripts', ['language_detected'])
    op.create_index('idx_transcripts_created_at', 'transcripts', ['created_at'])

    # Create scorecards table
    op.create_table(
        'scorecards',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('candidate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('requisition_id', postgresql.UUID(as_uuid=True)),
        sa.Column('session_id', postgresql.UUID(as_uuid=True)),
        sa.Column('overall_score', sa.Float(), nullable=False),
        sa.Column('communication_score', sa.Float()),
        sa.Column('domain_knowledge_score', sa.Float()),
        sa.Column('situational_judgment_score', sa.Float()),
        sa.Column('confidence_score', sa.Float()),
        sa.Column('language_fluency', sa.String(20)),
        sa.Column('assessor_notes', sa.Text()),
        sa.Column('recommended_roles', postgresql.ARRAY(sa.String())),
        sa.Column('shortlist_flag', sa.Boolean(), default=False),
        sa.Column('metrics', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), default=sa.func.now(), onupdate=sa.func.now()),
        sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], ),
        sa.ForeignKeyConstraint(['requisition_id'], ['requisitions.id'], ),
    )
    op.create_index('idx_scorecards_candidate_id', 'scorecards', ['candidate_id'])
    op.create_index('idx_scorecards_requisition_id', 'scorecards', ['requisition_id'])
    op.create_index('idx_scorecards_overall_score', 'scorecards', ['overall_score'])
    op.create_index('idx_scorecards_shortlist_flag', 'scorecards', ['shortlist_flag'])

    # Create candidate_sessions table
    op.create_table(
        'candidate_sessions',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('candidate_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('session_id', sa.String(100), unique=True, nullable=False),
        sa.Column('interview_state', sa.String(50), default='initiated'),
        sa.Column('current_question_index', sa.Integer(), default=0),
        sa.Column('total_questions', sa.Integer(), default=5),
        sa.Column('interview_duration_seconds', sa.Integer(), default=0),
        sa.Column('language_detected', sa.String(10), default='hi-IN'),
        sa.Column('inbound_channel', sa.String(50), default='ivr'),
        sa.Column('transcript_segments', postgresql.JSONB, default=[]),
        sa.Column('question_responses', postgresql.JSONB, default=[]),
        sa.Column('drop_off_count', sa.Integer(), default=0),
        sa.Column('last_question_asked', sa.Text()),
        sa.Column('recovery_context', postgresql.JSONB, default={}),
        sa.Column('matched_requisitions', postgresql.JSONB, default=[]),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('last_active_at', sa.DateTime(), default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime()),
        sa.ForeignKeyConstraint(['candidate_id'], ['candidates.id'], ),
    )
    op.create_index('idx_candidate_sessions_candidate_id', 'candidate_sessions', ['candidate_id'])
    op.create_index('idx_candidate_sessions_session_id', 'candidate_sessions', ['session_id'])
    op.create_index('idx_candidate_sessions_interview_state', 'candidate_sessions', ['interview_state'])
    op.create_index('idx_candidate_sessions_last_active_at', 'candidate_sessions', ['last_active_at'])

    # Create audit_trail table
    op.create_table(
        'audit_trail',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('event_id', postgresql.UUID(as_uuid=True)),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('entity_type', sa.String(50), nullable=False),
        sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True)),
        sa.Column('changes', postgresql.JSONB, default={}),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.String(500)),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    )
    op.create_index('idx_audit_trail_entity_type', 'audit_trail', ['entity_type'])
    op.create_index('idx_audit_trail_entity_id', 'audit_trail', ['entity_id'])
    op.create_index('idx_audit_trail_user_id', 'audit_trail', ['user_id'])
    op.create_index('idx_audit_trail_event_type', 'audit_trail', ['event_type'])
    op.create_index('idx_audit_trail_created_at', 'audit_trail', ['created_at'])

    # Create events table
    op.create_table(
        'events',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('event_type', sa.String(100), nullable=False),
        sa.Column('entity_type', sa.String(50), nullable=False),
        sa.Column('entity_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True)),
        sa.Column('changes', postgresql.JSONB, default={}),
        sa.Column('ip_address', sa.String(50)),
        sa.Column('user_agent', sa.String(500)),
        sa.Column('audited', sa.Boolean(), default=False),
        sa.Column('audited_at', sa.DateTime()),
        sa.Column('created_at', sa.DateTime(), default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
    )
    op.create_index('idx_events_entity_type', 'events', ['entity_type'])
    op.create_index('idx_events_entity_id', 'events', ['entity_id'])
    op.create_index('idx_events_audited', 'events', ['audited'])
    op.create_index('idx_events_created_at', 'events', ['created_at'])


def downgrade() -> None:
    # Drop tables in reverse order of creation
    op.drop_table('events')
    op.drop_table('audit_trail')
    op.drop_table('candidate_sessions')
    op.drop_table('scorecards')
    op.drop_table('transcripts')
    op.drop_table('candidates')
    op.drop_table('campaigns')
    op.drop_table('requisitions')
    op.drop_table('users')
    op.drop_table('companies')