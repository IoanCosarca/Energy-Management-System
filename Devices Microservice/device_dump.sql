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
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.devices (
    max_hourly_consumption integer,
    device_id bigint NOT NULL,
    address character varying(255),
    description character varying(255)
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- Name: devices_device_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devices_device_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.devices_device_id_seq OWNER TO postgres;

--
-- Name: devices_device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devices_device_id_seq OWNED BY public.devices.device_id;


--
-- Name: user_device; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_device (
    id bigint NOT NULL,
    device_id bigint,
    user_id bigint
);


ALTER TABLE public.user_device OWNER TO postgres;

--
-- Name: user_device_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_device_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_device_id_seq OWNER TO postgres;

--
-- Name: user_device_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_device_id_seq OWNED BY public.user_device.id;


--
-- Name: devices device_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices ALTER COLUMN device_id SET DEFAULT nextval('public.devices_device_id_seq'::regclass);


--
-- Name: user_device id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_device ALTER COLUMN id SET DEFAULT nextval('public.user_device_id_seq'::regclass);


--
-- Data for Name: devices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.devices (max_hourly_consumption, device_id, address, description) FROM stdin;
360	1	T├órgu Mure╚Ö	Releu inteligent cu contor de consum monofazic sau trifazic Shelly 3EM 360A, Conexiune Wifi, control de pe mobil Shelly 3EM
200	2	Cluj-Napoca	CARLO GAVAZZI EM340DINAV23XS1PFB
40	13	Cluj-Napoca	Shelly Pro 4PM releu inteligent 4 canale, WiFi, LAN, contor de putere, control aplicatie, Amazon Alexa, Google Assistant si Home 3800235268049
8	5	Turda	Termostat digital neprogramabil CT3S Conter pentru fir
8900	7	T├órgu Mure╚Ö	Cuptor electric SurroundCook A 65 l litri inox antiamprent─â
5000	12	address	Dummy Product
\.


--
-- Data for Name: user_device; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_device (id, device_id, user_id) FROM stdin;
3	5	3
5	12	5
4	7	8
2	2	6
6	13	25
1	1	7
\.


--
-- Name: devices_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.devices_device_id_seq', 14, true);


--
-- Name: user_device_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_device_id_seq', 7, true);


--
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (device_id);


--
-- Name: user_device user_device_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_device
    ADD CONSTRAINT user_device_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

