--
-- PostgreSQL database dump
--

-- Dumped from database version 15.4
-- Dumped by pg_dump version 15.4

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
-- Data for Name: academic_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.academic_years (id, label, start_date, end_date, is_current, created_at) FROM stdin;
1	2024-2025	2024-09-01	2025-07-31	f	2026-05-04 01:08:47.674415
2	2025-2026	2025-09-01	2026-07-31	t	2026-05-04 01:08:47.674415
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, first_name, last_name, role, is_active, last_login, created_at, updated_at) FROM stdin;
10	mait@univ.ci	$2b$12$2aWjZfMydqEklS1ahUo3bOphckN0vZMiD9vq0uDe8Z3lC9STCAJV6	Bertin	Yao	enseignant	t	\N	2026-05-10 18:20:27.712523	2026-05-10 18:20:27.712523
11	prof@univ.ci	$2b$12$2aWjZfMydqEklS1ahUo3bOphckN0vZMiD9vq0uDe8Z3lC9STCAJV6	Charles	Diallo	enseignant	t	\N	2026-05-10 18:20:27.716948	2026-05-10 18:20:27.716948
3	jean.dupont@universite.ci	$2b$12$uz0AvQxrhZurW6KvJ4bEl.u7QRKGY50p9EDLfBr7.Ng312An4h8la	Jean	Dupont	enseignant	t	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
12	prof.yao@univ.ci	$2b$10$L6JCCYbJZpEmUc7FJ1.Q/umXiR5CvQqhTxth.7dCskwVfU5rMobY.	Amani	Yao	enseignant	t	\N	2026-05-10 18:26:30.365511	2026-05-10 18:26:30.365511
5	kouame.assi@universite.ci	$2b$12$uz0AvQxrhZurW6KvJ4bEl.u7QRKGY50p9EDLfBr7.Ng312An4h8la	Kouamé	Assi	enseignant	t	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
13	dr.traore@univ.ci	$2b$10$L6JCCYbJZpEmUc7FJ1.Q/umXiR5CvQqhTxth.7dCskwVfU5rMobY.	Moussa	Traoré	enseignant	t	2026-05-10 18:29:37.945662	2026-05-10 18:26:30.776915	2026-05-10 18:26:30.776915
14	m.bakayoko@univ.ci	$2b$10$L6JCCYbJZpEmUc7FJ1.Q/umXiR5CvQqhTxth.7dCskwVfU5rMobY.	Bakary	Bakayoko	enseignant	t	2026-05-10 18:30:04.497077	2026-05-10 18:26:31.180841	2026-05-10 18:26:31.180841
8	anna@gmail.com	$2b$12$IRx9IpBCc5tl/1DVIxIZSuSptAYerIAP.mF6tDszQFJ0.iXbhZWse	anna	yankey	enseignant	t	\N	2026-05-06 04:03:38.173192	2026-05-06 04:03:38.173192
2	rh@universite.ci	$2b$12$uz0AvQxrhZurW6KvJ4bEl.u7QRKGY50p9EDLfBr7.Ng312An4h8la	Marie	Konan	rh	t	2026-05-10 22:25:41.232911	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
9	asst@univ.ci	$2b$12$2aWjZfMydqEklS1ahUo3bOphckN0vZMiD9vq0uDe8Z3lC9STCAJV6	Alain	Koffi	enseignant	t	\N	2026-05-10 18:20:27.656353	2026-05-10 18:20:27.656353
6	nwolle14@gmail.com	$2b$12$9cKiLTi4YLxMIMa/i6DrUuTAVI9OVG8D5f7XFoQxt/nN.XQLNRcxe	Yankey	Ange	enseignant	t	2026-05-10 22:30:15.104512	2026-05-04 02:04:25.712045	2026-05-04 02:04:25.712045
4	fatou.diallo@universite.ci	$2b$12$uz0AvQxrhZurW6KvJ4bEl.u7QRKGY50p9EDLfBr7.Ng312An4h8la	Fatou	Diallo	enseignant	t	2026-05-10 22:54:31.063393	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
1	admin@universite.ci	$2b$12$uz0AvQxrhZurW6KvJ4bEl.u7QRKGY50p9EDLfBr7.Ng312An4h8la	Système	Administrateur	admin	t	2026-05-10 22:55:51.126766	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, user_id, action, table_name, record_id, details, created_at) FROM stdin;
1	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 01:24:08.885956
2	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 01:24:08.941316
3	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 01:24:29.130653
4	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 01:24:29.171963
5	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 01:56:22.693372
6	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 01:56:22.773821
7	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-04 01:57:46.412828
8	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-04 01:57:46.47365
9	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 02:02:10.211707
10	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 02:02:10.284642
11	1	POST	/api/users	\N	{"role": "enseignant", "email": "nwolle14@gmail.com", "last_name": "Ange", "first_name": "Yankey"}	2026-05-04 02:04:25.723253
12	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 02:06:24.838918
13	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 02:06:24.906003
14	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 02:09:15.195293
15	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 02:09:15.262051
16	1	POST	/api/hours	\N	{"date": "2026-05-04", "room": "ggg", "type": "CM", "hours": 2, "notes": null, "etd_hours": 3, "subject_id": 1, "teacher_id": 3, "academic_year_id": 2}	2026-05-04 02:11:09.099477
17	1	POST	/api/academic/subjects	\N	{"code": "ME-21", "name": "METHODOLOGIE RECHERCHE EMPLOI", "cm_hours": 0, "td_hours": 0, "tp_hours": 0, "program_id": 3, "coefficient": 1}	2026-05-04 02:13:11.361614
18	1	POST	/api/academic/subjects	\N	{"code": "PR-24", "name": "PROJET INFORMATIQUE", "cm_hours": 30, "td_hours": 0, "tp_hours": 8, "program_id": 3, "coefficient": 1}	2026-05-04 02:15:11.906959
19	1	PUT	/api/validation/1/validate	1	{}	2026-05-04 02:30:42.769579
20	1	PUT	/api/validation/12/validate	12	{}	2026-05-04 02:30:49.749955
21	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 09:06:24.487232
22	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 09:06:24.572116
23	1	POST	/api/users	\N	{"role": "rh", "email": "nadro@gmail.com", "last_name": "Konan", "first_name": "Nadro"}	2026-05-04 09:17:44.516708
24	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 09:19:42.766739
25	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 09:19:42.85061
26	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 09:25:23.052306
27	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 09:25:23.144122
28	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-04 09:25:37.62531
29	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-04 09:25:37.717527
30	2	POST	/api/academic/subjects	\N	{"code": "PR-500", "name": "PROJET INFORMATIQUE 1", "cm_hours": 50, "td_hours": 0, "tp_hours": 0, "program_id": 2, "coefficient": 3}	2026-05-04 09:27:57.948808
31	2	POST	/api/academic/subjects	\N	{"code": "JA-1", "name": "JAVA", "cm_hours": 50, "td_hours": 5, "tp_hours": 5, "program_id": 3, "coefficient": 6}	2026-05-04 09:28:48.953681
32	2	POST	/api/hours	16	{"tid": 1, "type": "CM", "hours": 2, "etd_hours": 3}	2026-05-04 10:10:23.711608
33	2	POST	/api/hours	\N	{"date": "2026-05-04", "room": null, "type": "CM", "hours": 2, "notes": "j'espère que le cours était apaisant", "etd_hours": 3, "subject_id": 7, "teacher_id": 1, "academic_year_id": 2}	2026-05-04 10:10:23.771658
34	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 10:11:20.909645
35	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-04 10:11:20.96173
36	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 10:11:42.103759
37	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-04 10:11:42.171155
38	4	POST	/api/auth/login	\N	{"email": "fatou.diallo@universite.ci"}	2026-05-04 10:27:12.500035
39	\N	POST	/api/auth/login	\N	{"email": "fatou.diallo@universite.ci"}	2026-05-04 10:27:12.568012
40	4	POST	/api/hours	17	{"tid": 2, "type": "CM", "hours": 2, "etd_hours": 3}	2026-05-04 10:28:00.915099
41	4	POST	/api/hours	\N	{"date": "2026-05-04", "room": null, "type": "CM", "hours": 2, "notes": "bonne séances à tous", "etd_hours": 3, "subject_id": 11, "teacher_id": 2, "academic_year_id": 2}	2026-05-04 10:28:01.026997
42	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-06 03:25:05.973691
43	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-06 03:25:06.069192
44	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-06 03:25:50.123797
45	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-06 03:25:50.200568
46	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-06 03:28:25.411967
47	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-06 03:28:25.488616
48	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-06 03:40:49.581672
49	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-06 03:40:50.76813
50	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-06 03:44:13.584428
51	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-06 03:44:13.64883
52	1	POST	/api/users	\N	{"role": "enseignant", "email": "anna@gmail.com", "grade": "maitre_assistant", "status": "permanent", "last_name": "yankey", "first_name": "anna"}	2026-05-06 04:03:38.265194
53	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-06 04:05:03.028096
54	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-06 04:05:03.108224
55	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-08 06:13:38.535763
56	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-08 06:13:38.654242
58	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-08 06:16:24.605132
57	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-08 06:16:24.527717
59	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-08 06:16:56.858285
60	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-08 06:16:56.919256
61	2	POST	/api/hours	18	{"tid": 4, "type": "CM", "hours": 4, "etd_hours": 6}	2026-05-08 06:18:02.375875
62	2	POST	/api/hours	\N	{"date": "2026-05-08", "room": "INFO-4", "type": "CM", "hours": 4, "notes": "developpement d'application mobile", "etd_hours": 6, "subject_id": 11, "teacher_id": 4, "academic_year_id": 2}	2026-05-08 06:18:02.426971
63	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-08 06:18:33.795483
64	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-08 06:18:33.901019
65	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-08 06:18:54.213585
66	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-08 06:18:54.275319
67	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-08 06:22:50.297357
68	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-08 06:22:50.342782
69	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 17:35:50.155075
70	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 17:35:50.229207
71	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 17:57:30.769272
72	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 17:57:30.835059
73	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 18:09:00.162026
74	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 18:09:00.307473
75	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 18:12:55.067901
76	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 18:12:55.119163
77	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 18:13:30.681004
78	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 18:13:30.738947
79	13	POST	/api/auth/login	\N	{"email": "dr.traore@univ.ci"}	2026-05-10 18:28:05.384685
80	\N	POST	/api/auth/login	\N	{"email": "dr.traore@univ.ci"}	2026-05-10 18:28:05.43052
81	13	PUT	/api/validation/27/contest	27	{"reason": "la durée est incorrect j'ai droit à 4H par 3H"}	2026-05-10 18:29:13.092626
82	13	POST	/api/auth/login	\N	{"email": "dr.traore@univ.ci"}	2026-05-10 18:29:37.949099
83	\N	POST	/api/auth/login	\N	{"email": "dr.traore@univ.ci"}	2026-05-10 18:29:38.001303
85	\N	POST	/api/auth/login	\N	{"email": "m.bakayoko@univ.ci"}	2026-05-10 18:30:04.565926
84	14	POST	/api/auth/login	\N	{"email": "m.bakayoko@univ.ci"}	2026-05-10 18:30:04.525086
86	14	PUT	/api/validation/28/validate	28	{}	2026-05-10 18:30:32.003923
87	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 18:31:01.171513
88	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 18:31:01.233997
89	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 18:47:34.097692
90	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 18:47:34.14371
91	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 18:47:56.12592
92	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 18:47:56.164699
93	2	POST	/api/hours	29	{"tid": 4, "type": "TP", "hours": 4, "etd_hours": 3}	2026-05-10 18:50:35.92345
94	2	POST	/api/hours	\N	{"date": "2026-05-10", "room": "SALLE 23", "type": "TP", "hours": 4, "notes": "test des projet réalisé", "etd_hours": 3, "subject_id": 10, "teacher_id": 4, "academic_year_id": 2}	2026-05-10 18:50:35.979899
95	2	PUT	/api/validation/29/validate	29	{}	2026-05-10 18:51:31.140552
96	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 18:51:54.284071
97	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 18:51:54.331756
98	6	PUT	/api/validation/18/validate	18	{}	2026-05-10 18:52:34.15331
99	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 18:53:00.231391
100	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 18:53:00.293587
101	2	POST	/api/hours	30	{"tid": 4, "type": "TD", "hours": 2, "etd_hours": 2}	2026-05-10 19:00:16.244166
102	2	POST	/api/hours	\N	{"date": "2026-05-10", "room": "Salle 03", "type": "TD", "hours": 2, "notes": null, "etd_hours": 2, "subject_id": 13, "teacher_id": 4, "academic_year_id": 2}	2026-05-10 19:00:16.283075
103	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 19:00:37.922087
104	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 19:00:37.967025
105	6	PUT	/api/validation/30/contest	30	{"reason": "durée tu TP incorrecte j'ai droit à 04heures je pense"}	2026-05-10 19:01:14.388395
106	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:01:44.99344
107	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:01:45.066982
108	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:03:42.824863
109	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:03:42.883572
110	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:08:38.625915
111	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:08:38.790267
112	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:09:44.240319
113	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:09:44.299485
114	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:11:17.348177
115	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:11:17.409086
116	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:12:52.806871
117	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:12:52.855495
118	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:15:14.978102
119	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 19:15:15.041308
120	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:55:50.615691
121	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 19:55:50.692103
122	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 20:10:26.249728
123	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 20:10:26.325669
124	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 20:11:00.551514
125	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 20:11:00.734353
126	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 20:33:31.351729
127	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 20:33:31.564557
128	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 21:20:05.923322
129	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 21:20:05.978756
130	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 22:06:23.850531
131	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 22:06:23.90029
132	2	POST	/api/hours	31	{"tid": 4, "type": "TD", "hours": 2, "etd_hours": 2}	2026-05-10 22:06:55.103462
133	2	POST	/api/hours	\N	{"date": "2026-05-10", "room": "Salle 27", "type": "TD", "hours": 2, "notes": null, "etd_hours": 2, "subject_id": 30, "teacher_id": 4, "academic_year_id": 2}	2026-05-10 22:06:55.15467
134	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 22:08:31.305132
135	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 22:08:31.365346
136	6	PUT	/api/validation/31/contest	31	{"reason": "heures incorrect"}	2026-05-10 22:09:11.211545
137	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 22:10:19.291997
138	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 22:10:19.384203
139	2	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 22:25:41.277083
140	\N	POST	/api/auth/login	\N	{"email": "rh@universite.ci"}	2026-05-10 22:25:41.326944
141	2	PUT	/api/hours/30	30	{"date": "2026-05-10", "room": "Salle 03", "type": "TP", "hours": 4, "notes": "désolé c'était une erreur vous avez droit à 04 heures", "status": "pending", "etd_hours": 3, "subject_id": 13, "teacher_id": 4, "academic_year_id": 2}	2026-05-10 22:29:59.8479
142	6	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 22:30:15.153524
143	\N	POST	/api/auth/login	\N	{"email": "nwolle14@gmail.com"}	2026-05-10 22:30:15.204762
144	6	PUT	/api/validation/30/validate	30	{}	2026-05-10 22:30:34.320308
145	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 22:46:37.149537
146	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 22:46:37.629986
147	4	POST	/api/auth/login	\N	{"email": "fatou.diallo@universite.ci"}	2026-05-10 22:54:31.173127
148	\N	POST	/api/auth/login	\N	{"email": "fatou.diallo@universite.ci"}	2026-05-10 22:54:31.239949
149	4	PUT	/api/validation/10/contest	10	{"reason": "humm je pense qu'il y aura une erreur\\n"}	2026-05-10 22:55:28.177804
150	1	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 22:55:51.133213
151	\N	POST	/api/auth/login	\N	{"email": "admin@universite.ci"}	2026-05-10 22:55:51.182481
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, name, code, description, created_at) FROM stdin;
1	Informatique	INFO	Département des Sciences et Technologies de l'Information	2026-05-04 01:08:47.674415
2	Mathématiques	MATH	Département de Mathématiques Appliquées	2026-05-04 01:08:47.674415
3	Physique	PHYS	Département de Physique Fondamentale	2026-05-04 01:08:47.674415
4	Sciences et Technologie	ST	\N	2026-05-10 18:26:28.636751
5	UFR Mathématiques et Informatique	MATH-INFO	\N	2026-05-10 19:20:00.76954
6	UFR Sciences Juridiques et Politiques	DROIT	\N	2026-05-10 19:20:00.808333
7	UFR Sciences Économiques et Gestion	ECO-GEST	\N	2026-05-10 19:20:00.809329
8	UFR Biosciences	BIO	\N	2026-05-10 19:20:00.809912
9	UFR Sciences de l'Homme et de la Société	SHS	\N	2026-05-10 19:20:00.810548
10	UFR Lettres, Langues et Arts	LLA	\N	2026-05-10 19:20:00.811121
11	UFR Sciences de la Terre et des Ressources Minières	STRM	\N	2026-05-10 19:20:00.811646
\.


--
-- Data for Name: equivalence_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.equivalence_rates (id, type, coefficient, description, updated_at) FROM stdin;
1	CM	1.50	1h CM = 1.5h ETD	2026-05-04 01:08:47.674415
2	TD	1.00	1h TD = 1.0h ETD	2026-05-04 01:08:47.674415
3	TP	0.75	1h TP = 0.75h ETD	2026-05-04 01:08:47.674415
\.


--
-- Data for Name: ues; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ues (id, name, code, level, department_id, academic_year_id, created_at) FROM stdin;
1	Licence Informatique	L-INFO-L1	L1	1	2	2026-05-04 01:08:47.674415
2	Licence Informatique	L-INFO-L2	L2	1	2	2026-05-04 01:08:47.674415
3	Licence Informatique	L-INFO-L3	L3	1	2	2026-05-04 01:08:47.674415
4	Master Informatique	M-INFO-M1	M1	1	2	2026-05-04 01:08:47.674415
5	Master Informatique	M-INFO-M2	M2	1	2	2026-05-04 01:08:47.674415
6	Licence Mathématiques	L-MATH-L1	L1	2	2	2026-05-04 01:08:47.674415
7	Licence Informatique	L_INFO	L1	5	\N	2026-05-10 19:21:23.0864
8	Master Big Data et IA	M_BDIA	M1	5	\N	2026-05-10 19:21:23.139339
9	Licence Droit Privé	L_DROIT_P	L2	6	\N	2026-05-10 19:21:23.141402
10	Master Droit des Affaires	M_DROIT_A	M2	6	\N	2026-05-10 19:21:23.143261
11	Licence Gestion des Entreprises	L_GEST	L3	7	\N	2026-05-10 19:21:23.144168
12	Master Finance	M_FIN	M2	7	\N	2026-05-10 19:21:23.144823
13	Licence Biotechnologie	L_BIO	L2	8	\N	2026-05-10 19:21:23.145607
14	Licence Communication	L_COMM	L1	10	\N	2026-05-10 19:21:23.14651
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.subjects (id, name, code, ue_id, cm_hours, td_hours, tp_hours, coefficient, created_at) FROM stdin;
1	Algorithmique et Structures de Données	ASD-L1	1	30.0	20.0	10.0	3.0	2026-05-04 01:08:47.674415
2	Programmation Orientée Objet	POO-L2	2	25.0	20.0	15.0	3.0	2026-05-04 01:08:47.674415
3	Bases de Données	BDD-L2	2	30.0	15.0	15.0	3.0	2026-05-04 01:08:47.674415
4	Réseaux Informatiques	RES-L3	3	30.0	20.0	10.0	3.0	2026-05-04 01:08:47.674415
5	Génie Logiciel	GL-M1	4	35.0	15.0	10.0	4.0	2026-05-04 01:08:47.674415
6	Intelligence Artificielle	IA-M2	5	40.0	20.0	0.0	4.0	2026-05-04 01:08:47.674415
7	Analyse Mathématique	AM-L1	6	40.0	25.0	0.0	4.0	2026-05-04 01:08:47.674415
8	METHODOLOGIE RECHERCHE EMPLOI	ME-21	3	0.0	0.0	0.0	1.0	2026-05-04 02:13:11.357409
9	PROJET INFORMATIQUE	PR-24	3	30.0	0.0	8.0	1.0	2026-05-04 02:15:11.824639
10	PROJET INFORMATIQUE 1	PR-500	2	50.0	0.0	0.0	3.0	2026-05-04 09:27:57.554282
11	JAVA	JA-1	3	50.0	5.0	5.0	6.0	2026-05-04 09:28:48.943313
12	Architecture des Ordinateurs	INF101	\N	0.0	0.0	0.0	1.0	2026-05-10 18:26:31.621483
13	Calcul Numérique	MAT201	\N	0.0	0.0	0.0	1.0	2026-05-10 18:26:31.929656
14	Algorithmique et Structures de Données	INFO101	7	30.0	20.0	15.0	1.0	2026-05-10 19:21:23.167499
15	Bases de Données Relationnelles	INFO201	7	25.0	15.0	10.0	1.0	2026-05-10 19:21:23.172977
16	Programmation Orientée Objet (Java)	INFO202	7	20.0	20.0	20.0	1.0	2026-05-10 19:21:23.173688
17	Réseaux Informatiques	INFO301	7	20.0	10.0	10.0	1.0	2026-05-10 19:21:23.174531
18	Machine Learning Appliqué	INFO501	8	30.0	0.0	30.0	1.0	2026-05-10 19:21:23.175249
19	Architecture Cloud	INFO502	8	20.0	0.0	20.0	1.0	2026-05-10 19:21:23.176447
20	Droit Civil : Les Personnes	DRT101	9	40.0	20.0	0.0	1.0	2026-05-10 19:21:23.177266
21	Droit Constitutionnel	DRT102	9	35.0	15.0	0.0	1.0	2026-05-10 19:21:23.178065
22	Droit Pénal Général	DRT201	9	30.0	10.0	0.0	1.0	2026-05-10 19:21:23.178736
23	Droit des Sociétés	DRT501	10	30.0	10.0	0.0	1.0	2026-05-10 19:21:23.179402
24	Microéconomie 1	ECO101	11	30.0	20.0	0.0	1.0	2026-05-10 19:21:23.180161
25	Macroéconomie 1	ECO102	11	30.0	20.0	0.0	1.0	2026-05-10 19:21:23.180931
26	Comptabilité Générale	GST101	11	20.0	30.0	0.0	1.0	2026-05-10 19:21:23.182054
27	Marketing Stratégique	GST501	12	25.0	15.0	0.0	1.0	2026-05-10 19:21:23.183174
28	Analyse Financière	GST502	12	30.0	10.0	0.0	1.0	2026-05-10 19:21:23.184229
29	Biologie Cellulaire	BIO101	13	30.0	10.0	20.0	1.0	2026-05-10 19:21:23.191808
30	Génétique Mendélienne	BIO201	13	25.0	15.0	10.0	1.0	2026-05-10 19:21:23.192512
31	Théories de la Communication	COM101	14	30.0	10.0	0.0	1.0	2026-05-10 19:21:23.193183
32	Journalisme et Éthique	COM301	14	20.0	10.0	0.0	1.0	2026-05-10 19:21:23.193911
\.


--
-- Data for Name: teachers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teachers (id, user_id, department_id, grade, status, speciality, contractual_hours, created_at, updated_at, rank) FROM stdin;
1	3	1	maitre_assistant	permanent	Génie Logiciel & BDD	192.00	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415	\N
2	4	1	assistant	permanent	Intelligence Artificielle	192.00	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415	\N
3	5	2	professeur	permanent	Algèbre & Analyse	192.00	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415	\N
4	6	\N	assistant	permanent	\N	192.00	2026-05-06 03:55:30.561104	2026-05-06 03:55:30.561104	\N
5	8	\N	maitre_assistant	permanent	\N	192.00	2026-05-06 04:03:38.235098	2026-05-06 04:03:38.235098	\N
6	9	1	assistant	permanent	\N	192.00	2026-05-10 18:20:27.68708	2026-05-10 18:20:27.68708	\N
7	10	1	maitre_assistant	permanent	\N	192.00	2026-05-10 18:20:27.713653	2026-05-10 18:20:27.713653	\N
8	11	1	professeur	permanent	\N	192.00	2026-05-10 18:20:27.718004	2026-05-10 18:20:27.718004	\N
9	12	4	professeur	permanent	\N	192.00	2026-05-10 18:26:30.583222	2026-05-10 18:26:30.583222	\N
10	13	4	maitre_assistant	permanent	\N	192.00	2026-05-10 18:26:30.986386	2026-05-10 18:26:30.986386	\N
11	14	4	assistant	vacataire	\N	0.00	2026-05-10 18:26:31.398026	2026-05-10 18:26:31.398026	\N
\.


--
-- Data for Name: hour_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hour_entries (id, teacher_id, subject_id, academic_year_id, date, type, hours, etd_hours, room, notes, created_by, status, validated_by, validated_at, contest_reason, created_at, updated_at) FROM stdin;
2	1	1	2	2025-10-12	TD	3.00	3.00	Salle 12	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
3	1	2	2	2025-10-19	CM	3.00	4.50	Amphi A	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
4	1	3	2	2025-11-02	CM	4.00	6.00	Amphi B	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
5	1	3	2	2025-11-09	TD	4.00	4.00	Salle 8	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
6	1	5	2	2025-11-16	CM	5.00	7.50	Amphi A	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
7	1	5	2	2025-11-23	TD	4.00	4.00	Salle 10	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
8	1	6	2	2025-12-07	CM	6.00	9.00	Amphi B	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
9	2	2	2	2025-10-06	CM	3.00	4.50	Amphi C	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
11	2	6	2	2025-11-03	CM	4.00	6.00	Amphi C	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
13	3	7	2	2025-10-14	TD	3.00	3.00	Salle 3	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
14	3	7	2	2025-11-04	CM	4.00	6.00	Amphi D	\N	1	pending	\N	\N	\N	2026-05-04 01:08:47.674415	2026-05-04 01:08:47.674415
15	3	1	2	2026-05-04	CM	2.00	3.00	ggg	\N	1	pending	\N	\N	\N	2026-05-04 02:11:09.089097	2026-05-04 02:11:09.089097
1	1	1	2	2025-10-05	CM	4.00	6.00	Amphi A	\N	1	validated	1	2026-05-04 02:30:42.721538	\N	2026-05-04 01:08:47.674415	2026-05-04 02:30:42.721538
12	3	7	2	2025-10-07	CM	5.00	7.50	Amphi D	\N	1	validated	1	2026-05-04 02:30:49.744603	\N	2026-05-04 01:08:47.674415	2026-05-04 02:30:49.744603
16	1	7	2	2026-05-04	CM	2.00	3.00	\N	j'espère que le cours était apaisant	2	pending	\N	\N	\N	2026-05-04 10:10:23.658613	2026-05-04 10:10:23.658613
17	2	11	2	2026-05-04	CM	2.00	3.00	\N	bonne séances à tous	4	pending	\N	\N	\N	2026-05-04 10:28:00.835605	2026-05-04 10:28:00.835605
19	6	1	2	2026-05-01	CM	4.00	6.00	\N	\N	2	pending	\N	\N	\N	2026-05-10 18:20:27.733456	2026-05-10 18:20:27.733456
20	6	2	2	2026-05-05	TD	2.00	2.00	\N	\N	2	pending	\N	\N	\N	2026-05-10 18:20:27.750273	2026-05-10 18:20:27.750273
21	7	1	2	2026-05-01	CM	4.00	6.00	\N	\N	2	pending	\N	\N	\N	2026-05-10 18:20:27.752357	2026-05-10 18:20:27.752357
22	7	2	2	2026-05-05	TD	2.00	2.00	\N	\N	2	pending	\N	\N	\N	2026-05-10 18:20:27.753328	2026-05-10 18:20:27.753328
23	8	1	2	2026-05-01	CM	4.00	6.00	\N	\N	2	pending	\N	\N	\N	2026-05-10 18:20:27.754667	2026-05-10 18:20:27.754667
24	8	2	2	2026-05-05	TD	2.00	2.00	\N	\N	2	pending	\N	\N	\N	2026-05-10 18:20:27.755524	2026-05-10 18:20:27.755524
25	9	12	2	2026-05-02	CM	4.00	6.00	\N	Cours Magistral Intro	\N	pending	\N	\N	\N	2026-05-10 18:26:32.345058	2026-05-10 18:26:32.345058
26	9	12	2	2026-05-05	TD	2.00	2.00	\N	Exercices Architecture	\N	pending	\N	\N	\N	2026-05-10 18:26:32.642803	2026-05-10 18:26:32.642803
27	10	13	2	2026-05-03	TD	3.00	3.00	\N	TD Matrices	\N	contested	\N	\N	la durée est incorrect j'ai droit à 4H par 3H	2026-05-10 18:26:32.961785	2026-05-10 18:29:13.073766
28	11	13	2	2026-05-04	TP	4.00	3.00	\N	TP Matlab	\N	validated	14	2026-05-10 18:30:32.002342	\N	2026-05-10 18:26:33.188844	2026-05-10 18:30:32.002342
29	4	10	2	2026-05-10	TP	4.00	3.00	SALLE 23	test des projet réalisé	2	validated	2	2026-05-10 18:51:29.660925	\N	2026-05-10 18:50:35.877437	2026-05-10 18:51:29.660925
18	4	11	2	2026-05-08	CM	4.00	6.00	INFO-4	developpement d'application mobile	2	validated	6	2026-05-10 18:52:34.151115	\N	2026-05-08 06:18:02.313466	2026-05-10 18:52:34.151115
31	4	30	2	2026-05-10	TD	2.00	2.00	Salle 27	\N	2	contested	\N	\N	heures incorrect	2026-05-10 22:06:55.091356	2026-05-10 22:09:11.205658
30	4	13	2	2026-05-10	TP	4.00	3.00	Salle 03	désolé c'était une erreur vous avez droit à 04 heures	2	validated	6	2026-05-10 22:30:34.316185	durée tu TP incorrecte j'ai droit à 04heures je pense	2026-05-10 19:00:16.188444	2026-05-10 22:30:34.316185
10	2	2	2	2025-10-13	TP	2.00	1.50	Labo 1	\N	1	contested	\N	\N	humm je pense qu'il y aura une erreur\n	2026-05-04 01:08:47.674415	2026-05-10 22:55:28.171448
\.


--
-- Data for Name: hourly_rates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hourly_rates (id, grade, status, rate, updated_at) FROM stdin;
8	professeur	permanent	20000.00	2026-05-10 18:55:19.409271
9	professeur	vacataire	25000.00	2026-05-10 18:55:19.409271
10	maitre_assistant	permanent	15000.00	2026-05-10 18:55:19.409271
11	maitre_assistant	vacataire	18000.00	2026-05-10 18:55:19.409271
12	assistant	permanent	10000.00	2026-05-10 18:55:19.409271
13	assistant	vacataire	12000.00	2026-05-10 18:55:19.409271
14	autres	permanent	8000.00	2026-05-10 18:55:19.409271
15	autres	vacataire	10000.00	2026-05-10 18:55:19.409271
\.


--
-- Name: academic_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.academic_years_id_seq', 3, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 151, true);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 18, true);


--
-- Name: equivalence_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.equivalence_rates_id_seq', 3, true);


--
-- Name: hour_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hour_entries_id_seq', 31, true);


--
-- Name: hourly_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hourly_rates_id_seq', 15, true);


--
-- Name: programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.programs_id_seq', 14, true);


--
-- Name: subjects_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.subjects_id_seq', 32, true);


--
-- Name: teachers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teachers_id_seq', 11, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 14, true);


--
-- PostgreSQL database dump complete
--

