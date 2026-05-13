--
-- PostgreSQL database dump
--

\restrict 8WVHxNrLsVswFwf5iTlMsISHALXcRaY6mLFP80egtqmbm5eJOK7qzmhDsa8g8Uo

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
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.academic_years (id, label, start_date, end_date, is_current, created_at) FROM stdin;
1	2024-2025	2024-09-01	2025-07-31	f	2026-05-11 00:22:02.095719
2	2025-2026	2025-09-01	2026-07-31	t	2026-05-11 00:22:02.095719
3	2026-2027	2027-01-11	2027-12-11	f	2026-05-11 03:05:35.91772
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.departments (id, name, code, description, created_at) FROM stdin;
1	Informatique	INFO	Département des Sciences et Technologies de l'Information	2026-05-11 00:22:02.095719
2	Mathématiques	MATH	Département de Mathématiques Appliquées	2026-05-11 00:22:02.095719
3	Physique	PHYS	Département de Physique Fondamentale	2026-05-11 00:22:02.095719
\.


--
-- Data for Name: equivalence_rates; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.equivalence_rates (id, type, coefficient, description, updated_at) FROM stdin;
1	CM	1.50	1h CM = 1.5h ETD	2026-05-11 00:22:02.095719
2	TD	1.00	1h TD = 1.0h ETD	2026-05-11 00:22:02.095719
3	TP	0.75	1h TP = 0.75h ETD	2026-05-11 00:22:02.095719
\.


--
-- Data for Name: ues; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.ues (id, name, code, level, department_id, academic_year_id, created_at) FROM stdin;
1	Licence Informatique	L-INFO-L1	L1	1	2	2026-05-11 00:22:02.095719
2	Licence Informatique	L-INFO-L2	L2	1	2	2026-05-11 00:22:02.095719
3	Licence Informatique	L-INFO-L3	L3	1	2	2026-05-11 00:22:02.095719
4	Master Informatique	M-INFO-M1	M1	1	2	2026-05-11 00:22:02.095719
5	Master Informatique	M-INFO-M2	M2	1	2	2026-05-11 00:22:02.095719
6	Licence Mathématiques	L-MATH-L1	L1	2	2	2026-05-11 00:22:02.095719
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.subjects (id, name, code, ue_id, cm_hours, td_hours, tp_hours, coefficient, created_at) FROM stdin;
1	Algorithmique et Structures de Données	ASD-L1	1	30.0	20.0	10.0	3.0	2026-05-11 00:22:02.095719
2	Programmation Orientée Objet	POO-L2	2	25.0	20.0	15.0	3.0	2026-05-11 00:22:02.095719
3	Bases de Données	BDD-L2	2	30.0	15.0	15.0	3.0	2026-05-11 00:22:02.095719
4	Réseaux Informatiques	RES-L3	3	30.0	20.0	10.0	3.0	2026-05-11 00:22:02.095719
5	Génie Logiciel	GL-M1	4	35.0	15.0	10.0	4.0	2026-05-11 00:22:02.095719
6	Intelligence Artificielle	IA-M2	5	40.0	20.0	0.0	4.0	2026-05-11 00:22:02.095719
7	Analyse Mathématique	AM-L1	6	40.0	25.0	0.0	4.0	2026-05-11 00:22:02.095719
33	Projet Informatique 1	pr1	\N	40.0	8.0	10.0	6.0	2026-05-11 01:03:26.875758
34	Projet Informatique 2	Pri2	\N	50.0	10.0	10.0	2.0	2026-05-11 01:04:20.194704
35	Methodologie Recherche Emploi	MRE-10	\N	20.0	8.0	2.0	2.0	2026-05-11 01:15:02.067455
36	Virtualisation	VI-1	3	30.0	8.0	8.0	3.0	2026-05-11 01:23:37.990264
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.users (id, email, password_hash, first_name, last_name, role, is_active, last_login, created_at, updated_at) FROM stdin;
3	jean.dupont@universite.ci	$2b$12$Fy2w3u5L73TrUT37enWxJezTs27qwIFrvEd7bpre4Q/SkXcQLWUlu	Jean	Dupont	enseignant	t	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719
4	fatou.diallo@universite.ci	$2b$12$Fy2w3u5L73TrUT37enWxJezTs27qwIFrvEd7bpre4Q/SkXcQLWUlu	Fatou	Diallo	enseignant	t	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719
5	kouame.assi@universite.ci	$2b$12$Fy2w3u5L73TrUT37enWxJezTs27qwIFrvEd7bpre4Q/SkXcQLWUlu	Kouamé	Assi	enseignant	t	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719
16	evra@gmail.com	$2b$12$jle6MS/6LQUDPHt9fXWYYeMNGVQL/Bo4HRQshNOnQYKsNu673HdW.	evra	kouadio	enseignant	t	\N	2026-05-11 00:34:31.256554	2026-05-11 00:34:31.256554
18	dansou@gmail.com	$2b$12$LKxTA9Mtr45WhNmkPe1QXuYUhQSE.Ao.pQxa.dYIzDeh9V1NKF8he	lionel	dansou	enseignant	t	\N	2026-05-11 02:58:23.53074	2026-05-11 02:58:23.53074
2	rh@universite.ci	$2b$12$Fy2w3u5L73TrUT37enWxJezTs27qwIFrvEd7bpre4Q/SkXcQLWUlu	Marie	Konan	rh	t	2026-05-11 09:20:53.309826	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719
17	esdras@gmail.com	$2b$12$KTVkGB/jqtHPfsC5XQAHOOuIer7bMIWHoedmC.Btk/PRznJQcGz6C	esdras	seka	enseignant	t	2026-05-12 18:33:04.732729	2026-05-11 00:47:01.624646	2026-05-11 00:47:01.624646
15	nwolle14@gmail.com	$2b$12$nh6VdlxAGKekZqPe5DiFOe/2DcvaQC7SyM6mqP775ESJsZsbQ.B76	ange	Yankey	enseignant	t	2026-05-12 18:44:31.238482	2026-05-11 00:33:31.898666	2026-05-11 00:33:31.898666
1	admin@universite.ci	$2b$12$Fy2w3u5L73TrUT37enWxJezTs27qwIFrvEd7bpre4Q/SkXcQLWUlu	Système	Administrateur	admin	t	2026-05-12 18:45:02.46015	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.teachers (id, user_id, department_id, grade, status, speciality, contractual_hours, created_at, updated_at, rank) FROM stdin;
1	3	1	maitre_assistant	permanent	Génie Logiciel & BDD	192.00	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
2	4	1	assistant	permanent	Intelligence Artificielle	192.00	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
3	5	2	professeur	permanent	Algèbre & Analyse	192.00	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
12	17	\N	maitre_assistant	permanent	\N	192.00	2026-05-11 00:47:01.66022	2026-05-11 00:47:01.66022	\N
13	18	\N	maitre_assistant	permanent	\N	192.00	2026-05-11 02:58:23.548074	2026-05-11 02:58:23.548074	\N
\.


--
-- Data for Name: hour_entries; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.hour_entries (id, teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, room, notes, created_by, status, validated_by, validated_at, contest_reason, created_at, updated_at, semester) FROM stdin;
2	1	1	2	2025-10-12	TD	3.00	3.00	Salle 12	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
4	1	3	2	2025-11-02	CM	4.00	6.00	Amphi B	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
5	1	3	2	2025-11-09	TD	4.00	4.00	Salle 8	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
6	1	5	2	2025-11-16	CM	5.00	7.50	Amphi A	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
7	1	5	2	2025-11-23	TD	4.00	4.00	Salle 10	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
9	2	2	2	2025-10-06	CM	3.00	4.50	Amphi C	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
11	2	6	2	2025-11-03	CM	4.00	6.00	Amphi C	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
13	3	7	2	2025-10-14	TD	3.00	3.00	Salle 3	\N	1	pending	\N	\N	\N	2026-05-11 00:22:02.095719	2026-05-11 00:22:02.095719	\N
32	12	5	2	2026-05-11	CM	2.00	3.00	Salle info 1	\N	2	contested	\N	\N	je devais avoir normalement 04heures de TP	2026-05-11 00:55:23.893255	2026-05-11 00:56:40.375252	\N
8	1	6	2	2025-12-07	CM	6.00	9.00	Amphi B	\N	1	validated	2	2026-05-11 01:01:29.877446	\N	2026-05-11 00:22:02.095719	2026-05-11 01:01:29.877446	\N
14	3	7	2	2025-11-04	CM	4.00	6.00	Amphi D	\N	1	validated	2	2026-05-11 01:01:36.934404	\N	2026-05-11 00:22:02.095719	2026-05-11 01:01:36.934404	\N
3	1	2	2	2025-10-19	CM	3.00	4.50	Amphi A	\N	1	validated	2	2026-05-11 01:01:38.576516	\N	2026-05-11 00:22:02.095719	2026-05-11 01:01:38.576516	\N
10	2	2	2	2025-10-13	TP	2.00	1.50	Labo 1	\N	1	validated	2	2026-05-11 01:01:39.53902	\N	2026-05-11 00:22:02.095719	2026-05-11 01:01:39.53902	\N
12	3	7	2	2025-10-07	CM	5.00	7.50	Amphi D	\N	1	validated	2	2026-05-11 01:01:40.424129	\N	2026-05-11 00:22:02.095719	2026-05-11 01:01:40.424129	\N
1	1	1	2	2025-10-05	CM	4.00	6.00	Amphi A	\N	1	validated	2	2026-05-11 01:01:41.867555	\N	2026-05-11 00:22:02.095719	2026-05-11 01:01:41.867555	\N
33	3	36	2	2026-05-11	CM	2.00	3.00	Amphi A	\N	2	pending	\N	\N	\N	2026-05-11 01:25:10.832645	2026-05-11 01:25:10.832645	\N
34	1	1	2	2026-05-11	TD	4.00	4.00	Salle info 4	\N	2	pending	\N	\N	\N	2026-05-11 01:25:33.78179	2026-05-11 01:25:33.78179	\N
35	3	3	2	2026-05-11	CM	2.00	3.00	Salle 10	\N	2	pending	\N	\N	\N	2026-05-11 01:25:48.195999	2026-05-11 01:25:48.195999	\N
37	2	4	2	2026-05-11	TP	2.00	1.50	Salle 15	\N	2	pending	\N	\N	\N	2026-05-11 01:26:43.391606	2026-05-11 01:26:43.391606	\N
38	3	35	2	2026-05-11	CM	2.00	3.00	Salle 17	\N	2	pending	\N	\N	\N	2026-05-11 01:27:00.366409	2026-05-11 01:27:00.366409	\N
39	12	5	2	2026-05-11	CM	4.00	6.00	Salle A	\N	2	validated	17	2026-05-11 03:13:18.943013	l'heure attribué n'est pas la mienne , j'ai droit à 04H de cours magistral	2026-05-11 03:07:05.601433	2026-05-11 03:13:18.943013	\N
36	12	34	2	2026-05-11	TP	2.00	1.50	Salle info 2	\N	2	contested	\N	\N	emploi du temps de merde	2026-05-11 01:26:14.454431	2026-05-11 09:20:27.885828	\N
\.


--
-- Data for Name: hourly_rates; Type: TABLE DATA; Schema: public; Owner: gestheures
--

COPY public.hourly_rates (id, grade, status, rate, updated_at) FROM stdin;
1	assistant	permanent	5000.00	2026-05-11 00:22:02.095719
2	assistant	vacataire	4000.00	2026-05-11 00:22:02.095719
3	maitre_assistant	permanent	6500.00	2026-05-11 00:22:02.095719
4	maitre_assistant	vacataire	4000.00	2026-05-11 00:22:02.095719
5	professeur	permanent	8000.00	2026-05-11 00:22:02.095719
6	professeur	vacataire	4000.00	2026-05-11 00:22:02.095719
\.


--
-- Name: academic_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.academic_years_id_seq', 3, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 235, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.departments_id_seq', 19, true);


--
-- Name: equivalence_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.equivalence_rates_id_seq', 3, true);


--
-- Name: hour_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.hour_entries_id_seq', 39, true);


--
-- Name: hourly_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.hourly_rates_id_seq', 15, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.subjects_id_seq', 36, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.teachers_id_seq', 13, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: gestheures
--

SELECT pg_catalog.setval('public.users_id_seq', 18, true);


--
-- PostgreSQL database dump complete
--

\unrestrict 8WVHxNrLsVswFwf5iTlMsISHALXcRaY6mLFP80egtqmbm5eJOK7qzmhDsa8g8Uo

