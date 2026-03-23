"""initial migration with is_admin

Revision ID: 70b844210944
Revises: 
Create Date: 2026-03-23 12:03:09.459806

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '70b844210944'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Manual fix: Only add the column that is missing
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), server_default='false', nullable=False), schema='investment')


def downgrade() -> None:
    op.drop_column('users', 'is_admin', schema='investment')
