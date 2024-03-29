--
-- PostgreSQL database dump
--

-- Dumped from database version 16.0
-- Dumped by pg_dump version 16.0

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id bigint NOT NULL,
    email character varying(255),
    name character varying(255),
    password character varying(255),
    role character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['ADMIN'::character varying, 'CLIENT'::character varying])::text[])))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_seq
    START WITH 1
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, email, name, password, role) FROM stdin;
1	ionutcosarca1@gmail.com	Ionut	$2a$10$ZY7gFZ.bDQTYQI74oHFdq.3rG9W81eT1koUN7X8DpWJKl5LSBf2ra	ADMIN
2	ionutcosarca5@gmail.com	John	$2a$10$e6InfZUUCAh9zs3SHjkBWejDBK7jnQe5akQ4z8cim/LmqOWZn/u8m	CLIENT
3	alinutu2000@gmail.com	Alin	$2a$10$eJqEmntd55javKfQ2vvc.ePm554i9Y/90P6m61MvpkgghA3ScUCsq	CLIENT
4	andreus@gmail.com	Andreea	$2a$10$mUa6IE1pahKhg0/Bu795A.0Q8unCK3n.JOmF4T4np/50n.7DhHX46	CLIENT
5	roxifoxy@gmail.com	Roxana	$2a$10$s5urGT3qsFKeDsfinezZl.Evjv.Tfjfvqm14zB8bWq6QcJqwvKq0O	CLIENT
6	camias@gmail.com	Claudiu	$2a$10$1wVGZXOLCGbQeGJ8ZmmX5.eksYjh.2GyikHlEBI6Kcqu5vs77nYSy	CLIENT
7	frafesteu@gmail.com	Catalin	$2a$10$/X9uoWicyDSnrqpeMn5zY.1JezphAYtqHw1J.znwp3NqrYxqowyr2	ADMIN
25	dummy@gmail	Dummy Face	$2a$10$NoT7n632FhjGBm.GjFOGiuUWfVmC3CXl08.D7anTN6jfUEkKr9eoK	CLIENT
8	vladutu@gmail.com	Vladutu	$2a$10$TJl7jV1QQQg/4IdEBsUCeub60jzz1U8j.qZ9rzo5fE15KXoW6X6sa	CLIENT
28	ionut@gmail	John	$2a$10$X9vng8CD8TQi7XcKBPkdDOwVrdKSLvVqK9466mQa5u2LGQzVYUQPu	ADMIN
\.


--
-- Name: users_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_seq', 201, true);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 29, true);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- PostgreSQL database dump complete
--

