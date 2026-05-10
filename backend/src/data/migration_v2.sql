-- Migration to integrate UE, Ranks, and fix Data bugs

BEGIN;

-- 1. Rename programs to ues (with check)
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'programs') THEN
    ALTER TABLE programs RENAME TO ues;
  END IF;
END $$;

-- 2. Update subjects to reference ue_id instead of program_id (with check)
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'subjects' AND column_name = 'program_id') THEN
    ALTER TABLE subjects RENAME COLUMN program_id TO ue_id;
  END IF;
END $$;

-- 3. Add Rank to teachers (with check)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'teacher_rank') THEN
    CREATE TYPE teacher_rank AS ENUM ('A', 'B');
  END IF;
  IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'teachers' AND column_name = 'rank') THEN
    ALTER TABLE teachers ADD COLUMN rank teacher_rank;
  END IF;
END $$;

-- 4. Set default contractual hours based on rank
-- We can add a trigger or just update them for now.
-- "Rank B: 240H, Rank A: 150H"
-- Default was 192.00.

-- 5. Update v_teacher_balance to include rank and correct calculations
-- Drop existing views first to avoid column mismatch errors
DROP VIEW IF EXISTS v_accounting;
DROP VIEW IF EXISTS v_teacher_balance;

CREATE OR REPLACE VIEW v_teacher_balance AS
SELECT
    t.id as teacher_id,
    u.first_name,
    u.last_name,
    t.grade,
    t.rank,
    t.status,
    t.contractual_hours,
    d.name as department_name,
    ay.label as academic_year,
    SUM(CASE WHEN h.type='CM' THEN h.hours ELSE 0 END) as cm_raw,
    SUM(CASE WHEN h.type='TD' THEN h.hours ELSE 0 END) as td_raw,
    SUM(CASE WHEN h.type='TP' THEN h.hours ELSE 0 END) as tp_raw,
    SUM(COALESCE(h.etd_hours, 0)) as total_etd,
    GREATEST(0, SUM(COALESCE(h.etd_hours, 0)) - t.contractual_hours) as complementary_etd,
    LEAST(SUM(COALESCE(h.etd_hours, 0)), t.contractual_hours) as normal_etd
FROM teachers t
JOIN users u ON u.id = t.user_id
LEFT JOIN departments d ON d.id = t.department_id
CROSS JOIN academic_years ay
LEFT JOIN hour_entries h ON h.teacher_id = t.id AND h.academic_year_id = ay.id
GROUP BY t.id, u.first_name, u.last_name, t.grade, t.rank, t.status,
         t.contractual_hours, d.name, ay.label, ay.id;

-- Recreate v_accounting
CREATE OR REPLACE VIEW v_accounting AS
SELECT
    b.*,
    hr.rate as hourly_rate,
    ROUND(b.complementary_etd * hr.rate, 0) as amount_due
FROM v_teacher_balance b
JOIN hourly_rates hr ON hr.grade = b.grade AND hr.status = b.status;

-- 6. Add level to hour_entries for easier filtering (optional but helpful)
-- Or we can just join through subject -> ue -> level.
-- Let's update v_accounting as well if needed.

COMMIT;
