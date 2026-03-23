-- =============================================================================
-- SCRIPT DE CRÉATION DE LA BASE DE DONNÉES
-- Application: Gestion des Heures des Enseignants du Supérieur
-- SGBD: PostgreSQL 14+
-- =============================================================================

-- Créer la base si nécessaire (à exécuter en tant que superuser)
-- CREATE DATABASE gestion_heures;
-- \c gestion_heures;

BEGIN;

-- ─── EXTENSIONS ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── ENUM TYPES ──────────────────────────────────────────────────────────────
CREATE TYPE user_role AS ENUM ('admin', 'rh', 'enseignant');
CREATE TYPE teacher_grade AS ENUM ('assistant', 'maitre_assistant', 'professeur');
CREATE TYPE teacher_status AS ENUM ('permanent', 'vacataire');
CREATE TYPE hour_type AS ENUM ('CM', 'TD', 'TP');

-- =============================================================================
-- TABLE: academic_years — Années académiques
-- =============================================================================
CREATE TABLE academic_years (
    id          SERIAL PRIMARY KEY,
    label       VARCHAR(20) NOT NULL,        -- ex: "2025-2026"
    start_date  DATE NOT NULL,
    end_date    DATE NOT NULL,
    is_current  BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_label UNIQUE (label)
);

-- =============================================================================
-- TABLE: users — Comptes utilisateurs (Admin, RH, Enseignant)
-- =============================================================================
CREATE TABLE users (
    id            SERIAL PRIMARY KEY,
    email         VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    role          user_role NOT NULL DEFAULT 'enseignant',
    is_active     BOOLEAN DEFAULT TRUE,
    last_login    TIMESTAMP,
    created_at    TIMESTAMP DEFAULT NOW(),
    updated_at    TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- =============================================================================
-- TABLE: departments — Départements / UFR
-- =============================================================================
CREATE TABLE departments (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    code        VARCHAR(20) UNIQUE,
    description TEXT,
    created_at  TIMESTAMP DEFAULT NOW()
);

-- =============================================================================
-- TABLE: teachers — Profils enseignants
-- =============================================================================
CREATE TABLE teachers (
    id                 SERIAL PRIMARY KEY,
    user_id            INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    department_id      INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    grade              teacher_grade NOT NULL,
    status             teacher_status NOT NULL,
    speciality         VARCHAR(200),
    contractual_hours  DECIMAL(6,2) NOT NULL DEFAULT 192.00,  -- h ETD/an pour permanent
    created_at         TIMESTAMP DEFAULT NOW(),
    updated_at         TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_teachers_department ON teachers(department_id);
CREATE INDEX idx_teachers_grade ON teachers(grade);
CREATE INDEX idx_teachers_status ON teachers(status);

-- =============================================================================
-- TABLE: programs — Filières (L1, L2, L3, M1, M2)
-- =============================================================================
CREATE TABLE programs (
    id               SERIAL PRIMARY KEY,
    name             VARCHAR(150) NOT NULL,
    code             VARCHAR(20),
    level            VARCHAR(10) NOT NULL,       -- 'L1','L2','L3','M1','M2'
    department_id    INTEGER REFERENCES departments(id) ON DELETE SET NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE SET NULL,
    created_at       TIMESTAMP DEFAULT NOW(),
    CONSTRAINT chk_level CHECK (level IN ('L1','L2','L3','M1','M2'))
);

CREATE INDEX idx_programs_department ON programs(department_id);

-- =============================================================================
-- TABLE: subjects — Matières avec volumes horaires prévus
-- =============================================================================
CREATE TABLE subjects (
    id           SERIAL PRIMARY KEY,
    name         VARCHAR(200) NOT NULL,
    code         VARCHAR(30),
    program_id   INTEGER REFERENCES programs(id) ON DELETE CASCADE,
    cm_hours     DECIMAL(5,1) DEFAULT 0,   -- Volume prévu CM
    td_hours     DECIMAL(5,1) DEFAULT 0,   -- Volume prévu TD
    tp_hours     DECIMAL(5,1) DEFAULT 0,   -- Volume prévu TP
    coefficient  DECIMAL(3,1) DEFAULT 1.0, -- Coefficient de la matière
    created_at   TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subjects_program ON subjects(program_id);

-- =============================================================================
-- TABLE: equivalence_rates — Coefficients de conversion en ETD
-- =============================================================================
CREATE TABLE equivalence_rates (
    id          SERIAL PRIMARY KEY,
    type        hour_type NOT NULL UNIQUE,
    coefficient DECIMAL(4,2) NOT NULL,
    description VARCHAR(100),
    updated_at  TIMESTAMP DEFAULT NOW()
);

-- Données par défaut (standard français)
INSERT INTO equivalence_rates (type, coefficient, description) VALUES
    ('CM', 1.50, '1h CM = 1.5h ETD'),
    ('TD', 1.00, '1h TD = 1.0h ETD'),
    ('TP', 0.75, '1h TP = 0.75h ETD');

-- =============================================================================
-- TABLE: hourly_rates — Taux horaires par grade et statut (FCFA/h)
-- =============================================================================
CREATE TABLE hourly_rates (
    id         SERIAL PRIMARY KEY,
    grade      teacher_grade NOT NULL,
    status     teacher_status NOT NULL,
    rate       DECIMAL(10,2) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT unique_grade_status UNIQUE (grade, status)
);

-- Taux par défaut (configurables via l'interface Admin)
INSERT INTO hourly_rates (grade, status, rate) VALUES
    ('assistant',        'permanent', 5000.00),
    ('assistant',        'vacataire', 4000.00),
    ('maitre_assistant', 'permanent', 6500.00),
    ('maitre_assistant', 'vacataire', 4000.00),
    ('professeur',       'permanent', 8000.00),
    ('professeur',       'vacataire', 4000.00);

-- =============================================================================
-- TABLE: hour_entries — Saisies des heures d'enseignement
-- =============================================================================
CREATE TABLE hour_entries (
    id               SERIAL PRIMARY KEY,
    teacher_id       INTEGER NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    subject_id       INTEGER REFERENCES subjects(id) ON DELETE SET NULL,
    academic_year_id INTEGER REFERENCES academic_years(id) ON DELETE SET NULL,
    date             DATE NOT NULL,
    type             hour_type NOT NULL,
    hours            DECIMAL(5,2) NOT NULL CHECK (hours > 0),
    etd_hours        DECIMAL(6,2) NOT NULL,         -- Calculé automatiquement
    room             VARCHAR(60),
    notes            TEXT,
    created_by       INTEGER REFERENCES users(id),
    created_at       TIMESTAMP DEFAULT NOW(),
    updated_at       TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hour_entries_teacher    ON hour_entries(teacher_id);
CREATE INDEX idx_hour_entries_date       ON hour_entries(date);
CREATE INDEX idx_hour_entries_type       ON hour_entries(type);
CREATE INDEX idx_hour_entries_year       ON hour_entries(academic_year_id);
CREATE INDEX idx_hour_entries_month_year ON hour_entries(EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date));

-- =============================================================================
-- TABLE: audit_logs — Journal des modifications
-- =============================================================================
CREATE TABLE audit_logs (
    id          SERIAL PRIMARY KEY,
    user_id     INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(10) NOT NULL,      -- POST, PUT, DELETE
    table_name  VARCHAR(100) NOT NULL,     -- endpoint path
    record_id   INTEGER,
    details     JSONB,
    created_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(created_at);

-- =============================================================================
-- VUES UTILITAIRES
-- =============================================================================

-- Vue: bilan par enseignant et année académique
CREATE OR REPLACE VIEW v_teacher_balance AS
SELECT
    t.id as teacher_id,
    u.first_name,
    u.last_name,
    t.grade,
    t.status,
    t.contractual_hours,
    d.name as department_name,
    ay.label as academic_year,
    SUM(CASE WHEN h.type='CM' THEN h.hours ELSE 0 END) as cm_raw,
    SUM(CASE WHEN h.type='TD' THEN h.hours ELSE 0 END) as td_raw,
    SUM(CASE WHEN h.type='TP' THEN h.hours ELSE 0 END) as tp_raw,
    SUM(h.etd_hours) as total_etd,
    GREATEST(0, SUM(h.etd_hours) - t.contractual_hours) as complementary_etd,
    LEAST(SUM(h.etd_hours), t.contractual_hours) as normal_etd
FROM teachers t
JOIN users u ON u.id = t.user_id
LEFT JOIN departments d ON d.id = t.department_id
LEFT JOIN hour_entries h ON h.teacher_id = t.id
LEFT JOIN academic_years ay ON ay.id = h.academic_year_id
GROUP BY t.id, u.first_name, u.last_name, t.grade, t.status,
         t.contractual_hours, d.name, ay.label;

-- Vue: état comptable (montants dus)
CREATE OR REPLACE VIEW v_accounting AS
SELECT
    b.*,
    hr.rate as hourly_rate,
    ROUND(b.complementary_etd * hr.rate, 0) as amount_due
FROM v_teacher_balance b
JOIN hourly_rates hr ON hr.grade = b.grade AND hr.status = b.status;

-- =============================================================================
-- DONNÉES DE DÉMONSTRATION (SEED)
-- =============================================================================

-- Année académique
INSERT INTO academic_years (label, start_date, end_date, is_current) VALUES
    ('2024-2025', '2024-09-01', '2025-07-31', FALSE),
    ('2025-2026', '2025-09-01', '2026-07-31', TRUE);

-- Départements
INSERT INTO departments (name, code, description) VALUES
    ('Informatique', 'INFO', 'Département des Sciences et Technologies de l''Information'),
    ('Mathématiques', 'MATH', 'Département de Mathématiques Appliquées'),
    ('Physique', 'PHYS', 'Département de Physique Fondamentale');

-- Filières
INSERT INTO programs (name, code, level, department_id, academic_year_id) VALUES
    ('Licence Informatique', 'L-INFO-L1', 'L1', 1, 2),
    ('Licence Informatique', 'L-INFO-L2', 'L2', 1, 2),
    ('Licence Informatique', 'L-INFO-L3', 'L3', 1, 2),
    ('Master Informatique', 'M-INFO-M1', 'M1', 1, 2),
    ('Master Informatique', 'M-INFO-M2', 'M2', 1, 2),
    ('Licence Mathématiques', 'L-MATH-L1', 'L1', 2, 2);

-- Matières
INSERT INTO subjects (name, code, program_id, cm_hours, td_hours, tp_hours, coefficient) VALUES
    ('Algorithmique et Structures de Données', 'ASD-L1', 1, 30, 20, 10, 3),
    ('Programmation Orientée Objet', 'POO-L2', 2, 25, 20, 15, 3),
    ('Bases de Données', 'BDD-L2', 2, 30, 15, 15, 3),
    ('Réseaux Informatiques', 'RES-L3', 3, 30, 20, 10, 3),
    ('Génie Logiciel', 'GL-M1', 4, 35, 15, 10, 4),
    ('Intelligence Artificielle', 'IA-M2', 5, 40, 20, 0, 4),
    ('Analyse Mathématique', 'AM-L1', 6, 40, 25, 0, 4);

-- Comptes utilisateurs (mots de passe: "Admin1234!" hashés avec bcrypt rounds=12)
-- IMPORTANT: Remplacer ces hashes par de vrais hashes en production via npm run seed
INSERT INTO users (email, password_hash, first_name, last_name, role) VALUES
    ('admin@universite.ci',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6v0OD9y3lm',
     'Système', 'Administrateur', 'admin'),
    ('rh@universite.ci',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6v0OD9y3lm',
     'Marie', 'Konan', 'rh'),
    ('jean.dupont@universite.ci',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6v0OD9y3lm',
     'Jean', 'Dupont', 'enseignant'),
    ('fatou.diallo@universite.ci',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6v0OD9y3lm',
     'Fatou', 'Diallo', 'enseignant'),
    ('kouame.assi@universite.ci',
     '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6v0OD9y3lm',
     'Kouamé', 'Assi', 'enseignant');

-- Profils enseignants
INSERT INTO teachers (user_id, department_id, grade, status, speciality, contractual_hours) VALUES
    (3, 1, 'maitre_assistant', 'permanent', 'Génie Logiciel & BDD', 192.00),
    (4, 1, 'assistant',        'permanent', 'Intelligence Artificielle', 192.00),
    (5, 2, 'professeur',       'permanent', 'Algèbre & Analyse', 192.00);

-- Saisies d'heures exemple (année 2025-2026, id=2)
INSERT INTO hour_entries (teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, room, created_by) VALUES
    -- Jean Dupont (teacher_id=1) - dépasse son service
    (1, 1, 2, '2025-10-05', 'CM', 4.0, 6.00, 'Amphi A', 1),
    (1, 1, 2, '2025-10-12', 'TD', 3.0, 3.00, 'Salle 12', 1),
    (1, 2, 2, '2025-10-19', 'CM', 3.0, 4.50, 'Amphi A', 1),
    (1, 3, 2, '2025-11-02', 'CM', 4.0, 6.00, 'Amphi B', 1),
    (1, 3, 2, '2025-11-09', 'TD', 4.0, 4.00, 'Salle 8',  1),
    (1, 5, 2, '2025-11-16', 'CM', 5.0, 7.50, 'Amphi A', 1),
    (1, 5, 2, '2025-11-23', 'TD', 4.0, 4.00, 'Salle 10', 1),
    (1, 6, 2, '2025-12-07', 'CM', 6.0, 9.00, 'Amphi B', 1),
    -- Fatou Diallo (teacher_id=2)
    (2, 2, 2, '2025-10-06', 'CM', 3.0, 4.50, 'Amphi C', 1),
    (2, 2, 2, '2025-10-13', 'TP', 2.0, 1.50, 'Labo 1',  1),
    (2, 6, 2, '2025-11-03', 'CM', 4.0, 6.00, 'Amphi C', 1),
    -- Kouamé Assi (teacher_id=3)
    (3, 7, 2, '2025-10-07', 'CM', 5.0, 7.50, 'Amphi D', 1),
    (3, 7, 2, '2025-10-14', 'TD', 3.0, 3.00, 'Salle 3',  1),
    (3, 7, 2, '2025-11-04', 'CM', 4.0, 6.00, 'Amphi D', 1);

COMMIT;

-- =============================================================================
-- Vérification post-installation
-- =============================================================================
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public';
-- SELECT * FROM v_accounting;
