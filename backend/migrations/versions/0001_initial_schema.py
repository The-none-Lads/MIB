"""0001_initial_schema

Revision ID: 0001_initial_schema
Revises: 
Create Date: 2026-10-30 16:30:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from app.core.database import GUID

# revision identifiers, used by Alembic.
revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. agents table
    op.create_table(
        "agents",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("slug", sa.String(length=64), nullable=False),
        sa.Column("real_name", sa.String(length=255), nullable=False),
        sa.Column("codename", sa.String(length=64), nullable=False),
        sa.Column("agent_number", sa.String(length=32), nullable=False),
        sa.Column("rank", sa.String(length=64), nullable=False),
        sa.Column("division", sa.String(length=64), nullable=False),
        sa.Column("clearance_level", sa.String(length=32), nullable=False),
        sa.Column("status", sa.String(length=32), server_default="active", nullable=False),
        sa.Column("photograph_path", sa.String(length=512), nullable=True),
        sa.Column("specialization", sa.String(length=128), nullable=True),
        sa.Column("biography", sa.Text(), nullable=True),
        sa.Column("signature_quote", sa.Text(), nullable=True),
        sa.Column("recruitment_date", sa.Date(), nullable=True),
        sa.Column("is_published", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("show_in_directory", sa.Boolean(), server_default=sa.text("false"), nullable=False),
        sa.Column("archived_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("slug"),
        sa.UniqueConstraint("agent_number"),
    )
    op.create_index("ix_agents_slug", "agents", ["slug"], unique=True)
    op.create_index("ix_agents_codename", "agents", ["codename"], unique=False)
    op.create_index("ix_agents_agent_number", "agents", ["agent_number"], unique=True)

    # 2. agent_cards table
    op.create_table(
        "agent_cards",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("card_uid", sa.String(length=64), nullable=True),
        sa.Column("label", sa.String(length=128), nullable=False),
        sa.Column("agent_id", GUID(), nullable=True),
        sa.Column("card_type", sa.String(length=32), server_default="NTAG215", nullable=False),
        sa.Column("status", sa.String(length=32), server_default="available", nullable=False),
        sa.Column("assigned_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["agent_id"], ["agents.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_agent_cards_card_uid", "agent_cards", ["card_uid"], unique=False)
    op.create_index("ix_agent_cards_agent_id", "agent_cards", ["agent_id"], unique=False)

    # 3. dossiers table
    op.create_table(
        "dossiers",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("agent_id", GUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("classification", sa.String(length=32), server_default="CONFIDENTIAL", nullable=False),
        sa.Column("visibility", sa.String(length=32), server_default="ADMIN_ONLY", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["agent_id"], ["agents.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_dossiers_agent_id", "dossiers", ["agent_id"], unique=False)

    # 4. mission_records table
    op.create_table(
        "mission_records",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("agent_id", GUID(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("mission_date", sa.Date(), nullable=True),
        sa.Column("outcome", sa.String(length=64), server_default="SUCCESS", nullable=False),
        sa.Column("classification", sa.String(length=32), server_default="CONFIDENTIAL", nullable=False),
        sa.Column("visibility", sa.String(length=32), server_default="ADMIN_ONLY", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["agent_id"], ["agents.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_mission_records_agent_id", "mission_records", ["agent_id"], unique=False)

    # 5. admin_users table
    op.create_table(
        "admin_users",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("username", sa.String(length=64), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=32), server_default="admin", nullable=False),
        sa.Column("is_active", sa.Boolean(), server_default=sa.text("true"), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("username"),
        sa.UniqueConstraint("email"),
    )
    op.create_index("ix_admin_users_username", "admin_users", ["username"], unique=True)
    op.create_index("ix_admin_users_email", "admin_users", ["email"], unique=True)

    # 6. scan_events table
    op.create_table(
        "scan_events",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("agent_id", GUID(), nullable=False),
        sa.Column("card_id", GUID(), nullable=True),
        sa.Column("source", sa.String(length=32), server_default="unknown", nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.ForeignKeyConstraint(["agent_id"], ["agents.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["card_id"], ["agent_cards.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_scan_events_agent_id", "scan_events", ["agent_id"], unique=False)
    op.create_index("ix_scan_events_card_id", "scan_events", ["card_id"], unique=False)

    # 7. audit_logs table
    op.create_table(
        "audit_logs",
        sa.Column("id", GUID(), nullable=False),
        sa.Column("admin_id", GUID(), nullable=True),
        sa.Column("action", sa.String(length=64), nullable=False),
        sa.Column("target_type", sa.String(length=64), nullable=False),
        sa.Column("target_id", sa.String(length=64), nullable=False),
        sa.Column("timestamp", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("metadata_json", sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(["admin_id"], ["admin_users.id"], ondelete="SET NULL"),
        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("audit_logs")
    op.drop_table("scan_events")
    op.drop_table("admin_users")
    op.drop_table("mission_records")
    op.drop_table("dossiers")
    op.drop_table("agent_cards")
    op.drop_table("agents")
