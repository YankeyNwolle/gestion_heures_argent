--
-- PostgreSQL database dump
--

\restrict b4LfQq6P1ZarjdMtWioAlcmZKcynHoQwc36sZpEfwRZ3LTP7iWwAhXjHixcfrG1

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: hour_type; Type: TYPE; Schema: public; Owner: gestheures
--

CREATE TYPE public.hour_type AS ENUM (
    'CM',
    'TD',
    'TP'
);


ALTER TYPE public.hour_type OWNER TO gestheures;

--
-- Name: teacher_grade; Type: TYPE; Schema: public; Owner: gestheures
--

CREATE TYPE public.teacher_grade AS ENUM (
    'assistant',
    'maitre_assistant',
    'professeur'
);


ALTER TYPE public.teacher_grade OWNER TO gestheures;

--
-- Name: teacher_rank; Type: TYPE; Schema: public; Owner: gestheures
--

CREATE TYPE public.teacher_rank AS ENUM (
    'A',
    'B'
);


ALTER TYPE public.teacher_rank OWNER TO gestheures;

--
-- Name: teacher_status; Type: TYPE; Schema: public; Owner: gestheures
--

CREATE TYPE public.teacher_status AS ENUM (
    'permanent',
    'vacataire'
);


ALTER TYPE public.teacher_status OWNER TO gestheures;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: gestheures
--

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'rh',
    'enseignant'
);


ALTER TYPE public.user_role OWNER TO gestheures;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: academic_years; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.academic_years (
    id integer NOT NULL,
    label character varying(20) NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_current boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.academic_years OWNER TO gestheures;

--
-- Name: academic_years_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.academic_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.academic_years_id_seq OWNER TO gestheures;

--
-- Name: academic_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.academic_years_id_seq OWNED BY public.academic_years.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    user_id integer,
    action character varying(10) NOT NULL,
    table_name character varying(100) NOT NULL,
    record_id integer,
    details jsonb,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO gestheures;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO gestheures;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    code character varying(20),
    description text,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.departments OWNER TO gestheures;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO gestheures;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: equivalence_rates; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.equivalence_rates (
    id integer NOT NULL,
    type public.hour_type NOT NULL,
    coefficient numeric(4,2) NOT NULL,
    description character varying(100),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.equivalence_rates OWNER TO gestheures;

--
-- Name: equivalence_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.equivalence_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.equivalence_rates_id_seq OWNER TO gestheures;

--
-- Name: equivalence_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.equivalence_rates_id_seq OWNED BY public.equivalence_rates.id;


--
-- Name: hour_entries; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.hour_entries (
    id integer NOT NULL,
    teacher_id integer NOT NULL,
    subject_id integer,
    academic_year_id integer,
    date date NOT NULL,
    type public.hour_type NOT NULL,
    hours numeric(5,2) NOT NULL,
    etd_hours numeric(6,2) NOT NULL,
    room character varying(60),
    notes text,
    created_by integer,
    status character varying(20) DEFAULT 'pending'::character varying,
    validated_by integer,
    validated_at timestamp without time zone,
    contest_reason text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    semester character varying(3),
    CONSTRAINT hour_entries_hours_check CHECK ((hours > (0)::numeric)),
    CONSTRAINT hour_entries_semester_check CHECK (((semester)::text = ANY ((ARRAY['S1'::character varying, 'S2'::character varying, 'S3'::character varying, 'S4'::character varying, 'S5'::character varying, 'S6'::character varying, 'S7'::character varying, 'S8'::character varying, 'S9'::character varying, 'S10'::character varying])::text[])))
);


ALTER TABLE public.hour_entries OWNER TO gestheures;

--
-- Name: hour_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.hour_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hour_entries_id_seq OWNER TO gestheures;

--
-- Name: hour_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.hour_entries_id_seq OWNED BY public.hour_entries.id;


--
-- Name: hourly_rates; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.hourly_rates (
    id integer NOT NULL,
    grade public.teacher_grade NOT NULL,
    status public.teacher_status NOT NULL,
    rate numeric(10,2) NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.hourly_rates OWNER TO gestheures;

--
-- Name: hourly_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.hourly_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hourly_rates_id_seq OWNER TO gestheures;

--
-- Name: hourly_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.hourly_rates_id_seq OWNED BY public.hourly_rates.id;


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.subjects (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(30),
    ue_id integer,
    cm_hours numeric(5,1) DEFAULT 0,
    td_hours numeric(5,1) DEFAULT 0,
    tp_hours numeric(5,1) DEFAULT 0,
    coefficient numeric(3,1) DEFAULT 1.0,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.subjects OWNER TO gestheures;

--
-- Name: subjects_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.subjects_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.subjects_id_seq OWNER TO gestheures;

--
-- Name: subjects_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.subjects_id_seq OWNED BY public.subjects.id;


--
-- Name: teachers; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.teachers (
    id integer NOT NULL,
    user_id integer NOT NULL,
    department_id integer,
    grade public.teacher_grade NOT NULL,
    status public.teacher_status NOT NULL,
    speciality character varying(200),
    contractual_hours numeric(6,2) DEFAULT 192.00 NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    rank character varying(100)
);


ALTER TABLE public.teachers OWNER TO gestheures;

--
-- Name: teachers_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.teachers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teachers_id_seq OWNER TO gestheures;

--
-- Name: teachers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.teachers_id_seq OWNED BY public.teachers.id;


--
-- Name: ues; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.ues (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    code character varying(20),
    level character varying(10) NOT NULL,
    department_id integer,
    academic_year_id integer,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT chk_level CHECK (((level)::text = ANY (ARRAY[('L1'::character varying)::text, ('L2'::character varying)::text, ('L3'::character varying)::text, ('M1'::character varying)::text, ('M2'::character varying)::text])))
);


ALTER TABLE public.ues OWNER TO gestheures;

--
-- Name: users; Type: TABLE; Schema: public; Owner: gestheures
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(150) NOT NULL,
    password_hash character varying(255) NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    role public.user_role DEFAULT 'enseignant'::public.user_role NOT NULL,
    is_active boolean DEFAULT true,
    last_login timestamp without time zone,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO gestheures;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: gestheures
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO gestheures;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: gestheures
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: v_teacher_balance; Type: VIEW; Schema: public; Owner: gestheures
--

CREATE VIEW public.v_teacher_balance AS
 SELECT t.id AS teacher_id,
    u.first_name,
    u.last_name,
    t.grade,
    t.status,
    t.contractual_hours,
    d.name AS department_name,
    ay.label AS academic_year,
    sum(
        CASE
            WHEN (h.type = 'CM'::public.hour_type) THEN h.hours
            ELSE (0)::numeric
        END) AS cm_raw,
    sum(
        CASE
            WHEN (h.type = 'TD'::public.hour_type) THEN h.hours
            ELSE (0)::numeric
        END) AS td_raw,
    sum(
        CASE
            WHEN (h.type = 'TP'::public.hour_type) THEN h.hours
            ELSE (0)::numeric
        END) AS tp_raw,
    sum(h.etd_hours) AS total_etd,
    GREATEST((0)::numeric, (sum(h.etd_hours) - t.contractual_hours)) AS complementary_etd,
    LEAST(sum(h.etd_hours), t.contractual_hours) AS normal_etd
   FROM ((((public.teachers t
     JOIN public.users u ON ((u.id = t.user_id)))
     LEFT JOIN public.departments d ON ((d.id = t.department_id)))
     LEFT JOIN public.hour_entries h ON ((h.teacher_id = t.id)))
     LEFT JOIN public.academic_years ay ON ((ay.id = h.academic_year_id)))
  GROUP BY t.id, u.first_name, u.last_name, t.grade, t.status, t.contractual_hours, d.name, ay.label;


ALTER VIEW public.v_teacher_balance OWNER TO gestheures;

--
-- Name: v_accounting; Type: VIEW; Schema: public; Owner: gestheures
--

CREATE VIEW public.v_accounting AS
 SELECT b.teacher_id,
    b.first_name,
    b.last_name,
    b.grade,
    b.status,
    b.contractual_hours,
    b.department_name,
    b.academic_year,
    b.cm_raw,
    b.td_raw,
    b.tp_raw,
    b.total_etd,
    b.complementary_etd,
    b.normal_etd,
    hr.rate AS hourly_rate,
    round((b.complementary_etd * hr.rate), 0) AS amount_due
   FROM (public.v_teacher_balance b
     JOIN public.hourly_rates hr ON (((hr.grade = b.grade) AND (hr.status = b.status))));


ALTER VIEW public.v_accounting OWNER TO gestheures;

--
-- Name: academic_years id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.academic_years ALTER COLUMN id SET DEFAULT nextval('public.academic_years_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: equivalence_rates id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.equivalence_rates ALTER COLUMN id SET DEFAULT nextval('public.equivalence_rates_id_seq'::regclass);


--
-- Name: hour_entries id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries ALTER COLUMN id SET DEFAULT nextval('public.hour_entries_id_seq'::regclass);


--
-- Name: hourly_rates id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hourly_rates ALTER COLUMN id SET DEFAULT nextval('public.hourly_rates_id_seq'::regclass);


--
-- Name: subjects id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.subjects ALTER COLUMN id SET DEFAULT nextval('public.subjects_id_seq'::regclass);


--
-- Name: teachers id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.teachers ALTER COLUMN id SET DEFAULT nextval('public.teachers_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: academic_years academic_years_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT academic_years_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: equivalence_rates equivalence_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.equivalence_rates
    ADD CONSTRAINT equivalence_rates_pkey PRIMARY KEY (id);


--
-- Name: equivalence_rates equivalence_rates_type_key; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.equivalence_rates
    ADD CONSTRAINT equivalence_rates_type_key UNIQUE (type);


--
-- Name: hour_entries hour_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries
    ADD CONSTRAINT hour_entries_pkey PRIMARY KEY (id);


--
-- Name: hourly_rates hourly_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hourly_rates
    ADD CONSTRAINT hourly_rates_pkey PRIMARY KEY (id);


--
-- Name: ues programs_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.ues
    ADD CONSTRAINT programs_pkey PRIMARY KEY (id);


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_pkey PRIMARY KEY (id);


--
-- Name: teachers teachers_user_id_key; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_key UNIQUE (user_id);


--
-- Name: hourly_rates unique_grade_status; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hourly_rates
    ADD CONSTRAINT unique_grade_status UNIQUE (grade, status);


--
-- Name: academic_years unique_label; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.academic_years
    ADD CONSTRAINT unique_label UNIQUE (label);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_logs_date; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_audit_logs_date ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_user; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_audit_logs_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_hour_entries_date; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_hour_entries_date ON public.hour_entries USING btree (date);


--
-- Name: idx_hour_entries_month_year; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_hour_entries_month_year ON public.hour_entries USING btree (EXTRACT(year FROM date), EXTRACT(month FROM date));


--
-- Name: idx_hour_entries_teacher; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_hour_entries_teacher ON public.hour_entries USING btree (teacher_id);


--
-- Name: idx_hour_entries_type; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_hour_entries_type ON public.hour_entries USING btree (type);


--
-- Name: idx_hour_entries_year; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_hour_entries_year ON public.hour_entries USING btree (academic_year_id);


--
-- Name: idx_programs_department; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_programs_department ON public.ues USING btree (department_id);


--
-- Name: idx_subjects_program; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_subjects_program ON public.subjects USING btree (ue_id);


--
-- Name: idx_teachers_department; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_teachers_department ON public.teachers USING btree (department_id);


--
-- Name: idx_teachers_grade; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_teachers_grade ON public.teachers USING btree (grade);


--
-- Name: idx_teachers_status; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_teachers_status ON public.teachers USING btree (status);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_role; Type: INDEX; Schema: public; Owner: gestheures
--

CREATE INDEX idx_users_role ON public.users USING btree (role);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: hour_entries hour_entries_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries
    ADD CONSTRAINT hour_entries_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON DELETE SET NULL;


--
-- Name: hour_entries hour_entries_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries
    ADD CONSTRAINT hour_entries_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: hour_entries hour_entries_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries
    ADD CONSTRAINT hour_entries_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id) ON DELETE SET NULL;


--
-- Name: hour_entries hour_entries_teacher_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries
    ADD CONSTRAINT hour_entries_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.teachers(id) ON DELETE CASCADE;


--
-- Name: hour_entries hour_entries_validated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.hour_entries
    ADD CONSTRAINT hour_entries_validated_by_fkey FOREIGN KEY (validated_by) REFERENCES public.users(id);


--
-- Name: ues programs_academic_year_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.ues
    ADD CONSTRAINT programs_academic_year_id_fkey FOREIGN KEY (academic_year_id) REFERENCES public.academic_years(id) ON DELETE SET NULL;


--
-- Name: ues programs_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.ues
    ADD CONSTRAINT programs_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: subjects subjects_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.subjects
    ADD CONSTRAINT subjects_program_id_fkey FOREIGN KEY (ue_id) REFERENCES public.ues(id) ON DELETE CASCADE;


--
-- Name: teachers teachers_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: teachers teachers_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: gestheures
--

ALTER TABLE ONLY public.teachers
    ADD CONSTRAINT teachers_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict b4LfQq6P1ZarjdMtWioAlcmZKcynHoQwc36sZpEfwRZ3LTP7iWwAhXjHixcfrG1

