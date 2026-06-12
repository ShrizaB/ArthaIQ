-- ArthaIQ PostgreSQL Schema
-- Run this on your PostgreSQL instance before starting the app.
-- Connection string format: postgresql://user:password@host:5432/arthaiq

-- ── Extensions ────────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  civic_id      TEXT UNIQUE NOT NULL,
  email         TEXT,
  name          TEXT,
  picture_url   TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Financial Goals ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS goals (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  icon          TEXT NOT NULL DEFAULT 'target',
  color         TEXT NOT NULL DEFAULT '#C9A84C',
  current_amt   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  target_amt    NUMERIC(15, 2) NOT NULL,
  deadline      DATE,
  note          TEXT,
  tip           TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Portfolio / Fund Holdings ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS holdings (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  fund_name     TEXT NOT NULL,
  fund_tag      TEXT NOT NULL,    -- ELSS, Equity, Debt, Index, Gold, Liquid
  isin          TEXT,
  current_value NUMERIC(15, 2) NOT NULL DEFAULT 0,
  invested_amt  NUMERIC(15, 2) NOT NULL DEFAULT 0,
  units         NUMERIC(15, 4),
  nav           NUMERIC(10, 4),
  xirr          NUMERIC(6, 3),
  allocation    NUMERIC(5, 2),    -- percentage
  color         TEXT NOT NULL DEFAULT '#C9A84C',
  as_of_date    DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Monthly Cash Flow ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS cash_flow (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month         DATE NOT NULL,    -- first day of month e.g. 2025-03-01
  income        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  expense       NUMERIC(12, 2) NOT NULL DEFAULT 0,
  saved         NUMERIC(12, 2) GENERATED ALWAYS AS (income - expense) STORED,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, month)
);

-- ── Spending Categories ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS spending (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  month         DATE NOT NULL,
  category      TEXT NOT NULL,
  actual        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  budget        NUMERIC(12, 2) NOT NULL DEFAULT 0,
  color         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, month, category)
);

-- ── Net Worth Snapshots ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS net_worth_snapshots (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  net_worth     NUMERIC(15, 2) NOT NULL,
  invested      NUMERIC(15, 2),
  liquid        NUMERIC(15, 2),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, snapshot_date)
);

-- ── AI Chat History ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_messages (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content       TEXT NOT NULL,
  session_id    UUID,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Indexes ────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_goals_user          ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_holdings_user       ON holdings(user_id);
CREATE INDEX IF NOT EXISTS idx_cash_flow_user      ON cash_flow(user_id, month DESC);
CREATE INDEX IF NOT EXISTS idx_spending_user       ON spending(user_id, month DESC);
CREATE INDEX IF NOT EXISTS idx_nw_snapshots_user   ON net_worth_snapshots(user_id, snapshot_date DESC);
CREATE INDEX IF NOT EXISTS idx_chat_user           ON chat_messages(user_id, created_at DESC);

-- ── updated_at trigger function ────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_users_updated
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_goals_updated
  BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE TRIGGER trg_holdings_updated
  BEFORE UPDATE ON holdings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ── Sample seed data (Arjun Mehta demo profile) ───────────────────────────────
-- Uncomment and replace UUIDs if you want demo data in your DB.
/*
INSERT INTO users (id, civic_id, email, name)
VALUES ('11111111-1111-1111-1111-111111111111', 'civic_demo_arjun', 'arjun@example.com', 'Arjun Mehta')
ON CONFLICT (civic_id) DO NOTHING;

INSERT INTO net_worth_snapshots (user_id, snapshot_date, net_worth, invested, liquid) VALUES
('11111111-1111-1111-1111-111111111111', '2024-04-01', 2140000, 1820000, 320000),
('11111111-1111-1111-1111-111111111111', '2024-05-01', 2218000, 1890000, 328000),
('11111111-1111-1111-1111-111111111111', '2025-03-01', 2742500, 2128000, 614500);

INSERT INTO goals (user_id, name, icon, color, current_amt, target_amt, deadline) VALUES
('11111111-1111-1111-1111-111111111111', 'Emergency Fund',   'shield',         '#3DAA70', 540000,   600000,   '2025-09-01'),
('11111111-1111-1111-1111-111111111111', 'Dream Home',       'home',           '#C9A84C', 1240000,  5000000,  '2027-12-01'),
('11111111-1111-1111-1111-111111111111', 'Riya''s Education', 'graduation-cap', '#4A80C4', 487000,   2500000,  '2032-06-01'),
('11111111-1111-1111-1111-111111111111', 'Retirement',       'sun',            '#A07860', 4120000,  30000000, '2045-03-01');
*/
