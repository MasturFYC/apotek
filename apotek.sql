--
-- PostgreSQL database dump
--

-- Dumped from database version 12.1
-- Dumped by pg_dump version 12.1

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
-- Name: od_on_create(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.od_on_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.subtotal = (NEW.price - NEW.discount) * NEW.qty;

   UPDATE orders SET
      total = total + NEW.subtotal 
   WHERE id = NEW.order_id;

   NEW.created_at = now();
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.od_on_create() OWNER TO root;

--
-- Name: od_on_delete(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.od_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

   UPDATE orders SET
      total = total - OLD.subtotal
   WHERE id = OLD.order_id;

   RETURN OLD;

END;
$$;


ALTER FUNCTION public.od_on_delete() OWNER TO root;

--
-- Name: od_on_update(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.od_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

   NEW.subtotal = (NEW.price - NEW.discount) * NEW.qty;

   UPDATE orders SET
      total = total + NEW.subtotal - OLD.subtotal
   WHERE id = NEW.order_id;

   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.od_on_update() OWNER TO root;

--
-- Name: orders_on_create(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.orders_on_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.remain_payment = NEW.total - (NEW.cash + NEW.payment);
   NEW.updated_at = now();
   NEW.created_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.orders_on_create() OWNER TO root;

--
-- Name: orders_on_update(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.orders_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.remain_payment = NEW.total - (NEW.cash + NEW.payment);
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.orders_on_update() OWNER TO root;

--
-- Name: payments_on_create(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.payments_on_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   UPDATE orders SET
        payment = payment + NEW.amount
	WHERE id = NEW.order_id;

   NEW.created_at = now();
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.payments_on_create() OWNER TO root;

--
-- Name: payments_on_delete(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.payments_on_delete() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

   UPDATE orders SET
        payment = payment - OLD.amount
	WHERE id = OLD.order_id;

   RETURN OLD;

END;
$$;


ALTER FUNCTION public.payments_on_delete() OWNER TO root;

--
-- Name: payments_on_update(); Type: FUNCTION; Schema: public; Owner: root
--

CREATE FUNCTION public.payments_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   UPDATE orders SET
        payment = payment + NEW.amount - OLD.amount
	WHERE id = NEW.order_id;
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.payments_on_update() OWNER TO root;

--
-- Name: timestamp_on_create(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.timestamp_on_create() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.created_at = now();
   NEW.updated_at = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.timestamp_on_create() OWNER TO postgres;

--
-- Name: timestamp_on_update(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.timestamp_on_update() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.timestamp_on_update() OWNER TO postgres;

--
-- Name: categories_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.categories_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_seq OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: categories; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.categories (
    id integer DEFAULT nextval('public.categories_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO root;

--
-- Name: customers_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.customers_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.customers_seq OWNER TO root;

--
-- Name: customers; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.customers (
    id smallint DEFAULT nextval('public.customers_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    street character varying(128) NOT NULL,
    city character varying(50) NOT NULL,
    phone character varying(25) NOT NULL,
    cell character varying(25),
    zip character varying(25),
    rayon_id smallint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    credit_limit numeric(11,2) DEFAULT 0 NOT NULL,
    descriptions character varying(128),
    customer_type smallint DEFAULT 1 NOT NULL
);


ALTER TABLE public.customers OWNER TO root;

--
-- Name: methods_sequence; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.methods_sequence
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.methods_sequence OWNER TO root;

--
-- Name: order_details_sequence; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.order_details_sequence
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_details_sequence OWNER TO root;

--
-- Name: order_details; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.order_details (
    id integer DEFAULT nextval('public.order_details_sequence'::regclass) NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    unit_id smallint NOT NULL,
    qty numeric(5,2) NOT NULL,
    unit_name character varying(6) NOT NULL,
    real_qty numeric(8,2) NOT NULL,
    weight numeric(6,2) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    price numeric(11,2) DEFAULT 0 NOT NULL,
    discount numeric(10,2) DEFAULT 0 NOT NULL,
    subtotal numeric(11,2) DEFAULT 0 NOT NULL,
    profit numeric(10,2) DEFAULT 0 NOT NULL
);


ALTER TABLE public.order_details OWNER TO root;

--
-- Name: orders_sequence; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.orders_sequence
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_sequence OWNER TO root;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.orders (
    id integer DEFAULT nextval('public.orders_sequence'::regclass) NOT NULL,
    customer_id smallint NOT NULL,
    sales_id smallint NOT NULL,
    due_date timestamp without time zone NOT NULL,
    total numeric(11,2) DEFAULT 0 NOT NULL,
    cash numeric(11,2) DEFAULT 0 NOT NULL,
    payment numeric(11,2) DEFAULT 0 NOT NULL,
    remain_payment numeric(11,2) DEFAULT 0 NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    status smallint DEFAULT 0 NOT NULL,
    descriptions character varying(256),
    user_id character varying(50)
);


ALTER TABLE public.orders OWNER TO root;

--
-- Name: payment_methods; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.payment_methods (
    id smallint DEFAULT nextval('public.methods_sequence'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    descriptions character varying(128),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.payment_methods OWNER TO root;

--
-- Name: payments_sequence; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.payments_sequence
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.payments_sequence OWNER TO root;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.payments (
    id integer DEFAULT nextval('public.payments_sequence'::regclass) NOT NULL,
    order_id integer NOT NULL,
    method_id smallint NOT NULL,
    amount numeric(11,2) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    descriptions character varying(128),
    user_id character varying(50) NOT NULL
);


ALTER TABLE public.payments OWNER TO root;

--
-- Name: products_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.products_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_seq OWNER TO root;

--
-- Name: products; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.products (
    id integer DEFAULT nextval('public.products_seq'::regclass) NOT NULL,
    code character varying(8) NOT NULL,
    name character varying(50) NOT NULL,
    spec character varying(50) DEFAULT NULL::character varying,
    base_unit character varying(6) NOT NULL,
    base_price numeric(9,2) NOT NULL,
    base_weight numeric(4,2) NOT NULL,
    is_active boolean NOT NULL,
    first_stock numeric(5,2) NOT NULL,
    unit_in_stock numeric(7,2) NOT NULL,
    category_id smallint NOT NULL,
    supplier_id smallint NOT NULL,
    warehouse_id smallint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.products OWNER TO root;

--
-- Name: rayons_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.rayons_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.rayons_seq OWNER TO root;

--
-- Name: rayons; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.rayons (
    id integer DEFAULT nextval('public.rayons_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    descriptions character varying(128),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.rayons OWNER TO root;

--
-- Name: sales_sequence; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.sales_sequence
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sales_sequence OWNER TO root;

--
-- Name: salesmans; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.salesmans (
    id integer DEFAULT nextval('public.sales_sequence'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    street character varying(128) NOT NULL,
    city character varying(50) NOT NULL,
    phone character varying(25) NOT NULL,
    cell character varying(25),
    zip character varying(6),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.salesmans OWNER TO root;

--
-- Name: suppliers_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.suppliers_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.suppliers_seq OWNER TO root;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.suppliers (
    id smallint DEFAULT nextval('public.suppliers_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    contact_name character varying(50) NOT NULL,
    street character varying(128) NOT NULL,
    city character varying(50) NOT NULL,
    phone character varying(25) NOT NULL,
    cell character varying(25),
    zip character varying(25),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.suppliers OWNER TO root;

--
-- Name: test_categories; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.test_categories (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.test_categories OWNER TO root;

--
-- Name: test_products; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.test_products (
    id integer NOT NULL,
    code character varying(8) NOT NULL,
    name character varying(50) NOT NULL,
    spec character varying(50) DEFAULT NULL::character varying,
    base_unit character varying(6) NOT NULL,
    base_price numeric(7,2) NOT NULL,
    base_weight numeric(4,2) NOT NULL,
    is_active boolean NOT NULL,
    first_stock numeric(5,2) NOT NULL,
    unit_in_stock numeric(7,2) NOT NULL,
    category_id smallint NOT NULL,
    supplier_id smallint NOT NULL,
    warehouse_id smallint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.test_products OWNER TO root;

--
-- Name: units_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.units_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.units_seq OWNER TO root;

--
-- Name: units; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.units (
    id integer DEFAULT nextval('public.units_seq'::regclass) NOT NULL,
    barcode character varying(25) NOT NULL,
    name character varying(6) NOT NULL,
    content numeric(6,2) DEFAULT 0.0 NOT NULL,
    weight numeric(6,2) DEFAULT 0.0 NOT NULL,
    buy_price numeric(10,2) DEFAULT 0.0 NOT NULL,
    margin numeric(5,4) DEFAULT 0.0 NOT NULL,
    agent_margin numeric(5,4) DEFAULT 0.0 NOT NULL,
    member_margin numeric(5,4) DEFAULT 0.0 NOT NULL,
    sale_price numeric(11,2) DEFAULT 0.0 NOT NULL,
    agent_price numeric(11,2) DEFAULT 0.0 NOT NULL,
    member_price numeric(11,2) DEFAULT 0.0 NOT NULL,
    profit numeric(10,2) DEFAULT 0.0 NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.units OWNER TO root;

--
-- Name: warehouses_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public.warehouses_seq
    AS smallint
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.warehouses_seq OWNER TO root;

--
-- Name: warehouses; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public.warehouses (
    id integer DEFAULT nextval('public.warehouses_seq'::regclass) NOT NULL,
    name character varying(50) NOT NULL,
    location character varying(128) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL
);


ALTER TABLE public.warehouses OWNER TO root;

--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.categories (id, name, created_at, updated_at) FROM stdin;
25	Tepung Terigu	2020-12-06 03:27:09.397374	2021-03-19 20:15:44.155404
24	Rokok	2020-12-06 03:26:40.032173	2021-03-19 23:17:43.592131
21	Kerupuk dan Ciki	2020-12-05 18:59:52.958799	2021-03-21 02:32:48.662821
20	Welcome to the Jungle	2021-03-19 20:19:50.083194	2021-03-23 00:51:39.579902
23	Mie Instant	2020-12-06 03:10:17.377237	2021-03-25 04:05:54.193232
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.customers (id, name, street, city, phone, cell, zip, rayon_id, created_at, updated_at, credit_limit, descriptions, customer_type) FROM stdin;
5	Mastur FYC s	Jl. Jend. Sudirman No. 144 Kel. Lemahmekar	Indramayu		085321703564	45212	2	2020-12-06 06:16:43.733775	2021-03-25 19:29:23.873906	0.00	\N	2
3	Doni Armadi	Blok Sindu Praja Ds. Telukagung	Indramayu	089	\N	45212	6	2020-12-06 06:03:32.259621	2021-03-25 19:29:37.573779	0.00	rewqeq weqw eqw qwe	2
1	Saita	Blok Balai Desa Ds. Plumbon	Indramayu Barat	089	\N	45215	5	2020-12-06 06:00:00.022327	2021-03-25 19:31:15.457447	25000000.00	q2213 213	1
\.


--
-- Data for Name: order_details; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.order_details (id, order_id, product_id, unit_id, qty, unit_name, real_qty, weight, created_at, updated_at, price, discount, subtotal, profit) FROM stdin;
49	3	42	117	1.00	dus	200.00	50.00	2021-03-31 16:16:46.266457	2021-03-31 16:16:46.266457	4180000.00	0.00	4180000.00	0.00
50	3	12	149	2.00	box	240.00	120.00	2021-03-31 16:26:47.908332	2021-03-31 16:26:47.908332	620000.00	0.00	1240000.00	0.00
51	3	12	147	25.00	bks	1.00	0.50	2021-03-31 16:26:57.539384	2021-03-31 16:26:57.539384	2750.00	0.00	68750.00	0.00
47	3	41	112	1.00	bos	20.00	10.00	2021-03-31 16:12:05.891431	2021-03-31 16:40:53.278946	342400.00	400.00	342000.00	0.00
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.orders (id, customer_id, sales_id, due_date, total, cash, payment, remain_payment, created_at, updated_at, status, descriptions, user_id) FROM stdin;
3	5	2	2021-03-05 00:00:00	5830750.00	0.00	5330750.00	500000.00	2020-12-30 00:00:00	2021-03-31 16:40:53.278946	1	rerwerwer	\N
\.


--
-- Data for Name: payment_methods; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.payment_methods (id, name, descriptions, created_at, updated_at) FROM stdin;
1	cash	Pembayaran langsung tunai	2021-01-10 03:09:36.014986	2021-01-10 03:09:36.014986
2	Bank	Pembayaran lewat bank	2021-03-31 14:01:56.180071	2021-03-31 14:01:56.180071
3	Credit Card	Pembayaran langsung dari kartu kredit	2021-03-31 14:02:32.836085	2021-03-31 14:02:32.836085
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.payments (id, order_id, method_id, amount, created_at, updated_at, descriptions, user_id) FROM stdin;
19	3	1	830750.00	2021-03-31 16:25:25.238244	2021-03-31 16:27:37.468954	\N	-
20	3	2	4500000.00	2021-03-31 16:27:59.23344	2021-03-31 16:27:59.23344	Bank BCA 0236558458	-
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.products (id, code, name, spec, base_unit, base_price, base_weight, is_active, first_stock, unit_in_stock, category_id, supplier_id, warehouse_id, created_at, updated_at) FROM stdin;
5	03-xxs	Antasida TRIFA 100 sss	wwww xxx sss	12323	123.00	10.50	t	123.00	123.00	21	3	2	2020-12-06 19:57:47.364152	2021-03-06 01:04:30.378148
2	ccxdxx	Altamed Gloves. S 100`s	wwww 	12323	123.00	2.20	t	123.00	123.00	21	3	2	2020-12-06 19:56:54.459637	2021-03-06 01:14:30.501823
15	SK-01	Sampoerna Kretek	100 bks : 10 slop: 1 dus	bks	12000.00	0.50	t	0.00	0.00	21	3	4	2021-03-06 02:01:05.443938	2021-03-25 19:11:34.543816
31	TBM	Terigu Beruang Merah	1 zak : 25kg	kg	2500.00	0.50	t	0.00	0.00	23	3	2	2021-03-09 22:38:15.955477	2021-03-10 00:59:03.592786
41	ggf ss	Gudang Garam Filter	200 : 20 : 10	bks	2500.00	0.50	f	0.00	0.00	24	1	2	2021-03-09 22:49:05.029604	2021-03-25 19:13:38.115377
12	igs	Indomie Goreng Spesial	ccccc xx a	bks	2500.00	0.50	f	0.00	0.00	23	1	2	2021-03-06 01:59:25.486752	2021-03-25 19:35:05.927073
22	msdp	Mie Sedap	1 dus : 24 bks	kg	2500.00	1.50	t	0.00	0.00	23	3	2	2021-03-06 02:17:58.57636	2021-03-21 18:39:53.316436
29	TLM-25	Terigu Lencana Merah	1 zax : 25 kg 	kg	7250.00	1.00	t	0.00	0.00	25	3	2	2021-03-09 22:17:26.51534	2021-03-21 02:43:52.59471
6	001s	ALLOPURINOL TAB 300 mg 100 HEXA	x : 5 : 25	kg	2500.00	0.50	t	200.00	0.00	23	1	1	2020-12-12 12:06:15.654264	2021-03-21 19:17:16.209883
43	ggs16	Gudang Garam Surya 16 s	200 : 20 : 10	kg	75000.00	0.75	t	0.00	0.00	24	3	2	2021-03-09 22:51:14.304563	2021-03-24 21:11:00.715863
42	js12	Jarum Super 12	200 : 10 : 20	bks	19000.00	0.25	t	0.00	0.00	24	1	2	2021-03-09 22:49:54.558455	2021-03-24 21:11:11.232222
30	TSB	Terigu Segitiga Biru	1zak : 10kg	kg	2500.00	0.50	t	0.00	0.00	25	3	4	2021-03-09 22:34:40.534099	2021-03-25 02:29:13.323908
\.


--
-- Data for Name: rayons; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.rayons (id, name, descriptions, created_at, updated_at) FROM stdin;
1	Indramayu	Data pelanggan yg ada di rayon Indramayu	2020-12-06 04:06:25.495059	2020-12-06 04:14:37.537683
2	Jatibarang		2020-12-06 04:17:37.924208	2020-12-06 04:17:37.924208
3	Sukra		2020-12-06 04:17:52.473662	2020-12-06 04:17:52.473662
6	Losarang		2020-12-06 04:56:00.04163	2020-12-06 04:59:20.591772
5	Lohbener	\N	2020-12-06 04:54:45.798847	2020-12-06 04:59:31.063875
4	Karangampel		2020-12-06 04:54:01.330468	2020-12-06 07:55:26.865942
\.


--
-- Data for Name: salesmans; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.salesmans (id, name, street, city, phone, cell, zip, created_at, updated_at) FROM stdin;
2	Doni Armadi	Desa Telukagung Blok Sindu Praja	Indramayu	02365978	\N	45215	2021-03-22 19:32:11.350269	2021-03-24 19:44:59.037633
1	Mastur	Jl. Jend. Sudirman No. 155	Indramayu	0234	085	54217	2020-12-30 01:01:20.39677	2021-03-24 19:48:09.786307
\.


--
-- Data for Name: suppliers; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.suppliers (id, name, contact_name, street, city, phone, cell, zip, created_at, updated_at) FROM stdin;
3	PT. Mega Sentosa	Doni Armadi	Ds. Telukagung	Indramayu	(+62) 82315907707		45212	2020-12-06 09:08:42.927472	2021-03-24 18:57:51.453997
1	Ciptamaru, CV	Mastur	Jl. Jend. Sudirman No. 144 Kel. Lemahmekar	Indramayu	082320552675		45215	2020-12-06 09:00:52.11501	2021-03-25 01:01:26.200208
\.


--
-- Data for Name: test_categories; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.test_categories (id, name, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: test_products; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.test_products (id, code, name, spec, base_unit, base_price, base_weight, is_active, first_stock, unit_in_stock, category_id, supplier_id, warehouse_id, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: units; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.units (id, barcode, name, content, weight, buy_price, margin, agent_margin, member_margin, sale_price, agent_price, member_price, profit, product_id, created_at, updated_at) FROM stdin;
149	igs3	box	240.00	120.00	600000.00	0.0333	0.0167	0.0250	620000.00	610000.00	615000.00	0.00	12	2021-03-21 02:34:57.883909	2021-03-21 02:36:30.425834
148	igs2	dus	24.00	12.00	60000.00	0.1000	0.0417	0.0667	66000.00	62500.00	64000.00	0.00	12	2021-03-21 02:34:41.884983	2021-03-21 02:37:17.157772
147	igs1	bks	1.00	0.50	2500.00	0.1000	0.0400	0.0600	2750.00	2600.00	2650.00	0.00	12	2021-03-21 02:34:26.324897	2021-03-21 02:37:47.201048
24	1234567	bks	1.00	0.50	2500.00	0.1024	0.0300	0.0800	2756.00	2575.00	2700.00	0.00	6	2021-03-12 20:41:58.628521	2021-03-21 18:36:17.766309
25	123659874	slop	5.00	2.50	12500.00	0.2000	0.0300	0.0700	15000.00	12875.00	13375.00	0.00	6	2021-03-12 20:49:24.366751	2021-03-21 18:36:17.803842
26	12345	bos	20.00	10.00	50000.00	0.1200	0.0300	0.0700	56000.00	51500.00	53500.00	0.00	6	2021-03-12 20:51:01.800011	2021-03-21 18:36:17.878751
150	lm1	kg	1.00	1.00	7250.00	0.1034	0.0345	0.0690	8000.00	7500.00	7750.00	0.00	29	2021-03-21 02:41:53.034401	2021-03-21 02:44:26.887801
27	dus123	dus	200.00	100.00	500000.00	0.1000	0.0600	0.0700	550000.00	530000.00	535000.00	0.00	6	2021-03-12 21:21:16.754486	2021-03-21 18:36:17.912456
107	MS-001	bks	1.00	1.50	2500.00	0.1000	0.0500	0.0752	2750.00	2625.00	2688.00	0.00	22	2021-03-13 02:29:12.506705	2021-03-21 18:39:53.320746
127	eqwee	kg	12.00	18.00	30000.00	0.1000	0.0500	0.0750	33000.00	31500.00	32250.00	0.00	22	2021-03-16 04:23:13.203224	2021-03-21 18:39:53.391541
151	lm2	zak	25.00	25.00	181250.00	0.0483	0.0207	0.0317	190000.00	185000.00	187000.00	0.00	29	2021-03-21 02:42:51.681396	2021-03-21 02:45:01.885875
28	MS-002	dus	24.00	36.00	60000.00	0.1000	0.0300	0.0700	66000.00	61800.00	64200.00	0.00	22	2021-03-12 21:22:10.170595	2021-03-21 18:39:53.425717
115	js-1	bks	1.00	0.25	19000.00	0.1000	0.0500	0.0700	20900.00	19950.00	20330.00	0.00	42	2021-03-13 04:03:58.243977	2021-03-24 21:11:11.35977
116	js-2	slop	20.00	5.00	380000.00	0.1000	0.0500	0.0700	418000.00	399000.00	406600.00	0.00	42	2021-03-13 04:04:29.646068	2021-03-24 21:11:11.393631
117	js-3	dus	200.00	50.00	3800000.00	0.1000	0.0500	0.0700	4180000.00	3990000.00	4066000.00	0.00	42	2021-03-13 04:04:58.222845	2021-03-24 21:11:11.426207
138	www	kgs	2.00	1.00	24000.00	0.1000	0.0500	0.0750	26400.00	25200.00	25800.00	0.00	15	2021-03-19 02:21:12.695792	2021-03-25 19:11:34.548154
153	xxx	pak	20.00	10.00	240000.00	0.1000	0.0500	0.0750	264000.00	252000.00	258000.00	0.00	15	2021-03-25 19:11:00.782764	2021-03-25 19:11:34.605245
154	ccc	dus	200.00	100.00	2400000.00	0.1000	0.0500	0.0750	2640000.00	2520000.00	2580000.00	0.00	15	2021-03-25 19:11:14.719045	2021-03-25 19:11:34.638536
110	ggs1	bks	1.00	0.50	2500.00	0.1000	0.0400	0.0600	2750.00	2600.00	2650.00	0.00	41	2021-03-13 03:45:18.842378	2021-03-25 19:13:38.105813
111	ggs2	slop	10.00	5.00	160000.00	0.0800	0.0500	0.0938	172800.00	168000.00	175000.00	0.00	41	2021-03-13 03:45:37.954169	2021-03-25 19:13:38.130376
112	ggs3	bos	20.00	10.00	320000.00	0.0700	0.0400	0.0500	342400.00	332800.00	336000.00	0.00	41	2021-03-13 03:51:01.017273	2021-03-25 19:13:38.196867
113	ggs4	bal	200.00	100.00	3200000.00	0.0600	0.0300	0.0400	3392000.00	3296000.00	3328000.00	0.00	41	2021-03-13 03:52:21.9391	2021-03-25 19:13:38.23088
114	ggs5	dus	1000.00	500.00	16000000.00	0.0500	0.0200	0.0300	16800000.00	16320000.00	16480000.00	0.00	41	2021-03-13 04:00:19.609664	2021-03-25 19:13:38.271973
\.


--
-- Data for Name: warehouses; Type: TABLE DATA; Schema: public; Owner: root
--

COPY public.warehouses (id, name, location, created_at, updated_at) FROM stdin;
2	Gudang Pasar	Jl. Samsu No. 125654	2020-12-06 12:12:49.589476	2020-12-06 12:12:49.589476
1	Gudang Toko	Jl. Raya Singaraja No. 16	2020-12-06 12:06:03.40682	2020-12-06 12:17:58.379931
4	Gudang Barang	Rumah pak Sam	2021-03-25 01:51:51.488539	2021-03-25 01:51:51.488539
\.


--
-- Name: categories_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.categories_seq', 49, true);


--
-- Name: customers_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.customers_seq', 52, true);


--
-- Name: methods_sequence; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.methods_sequence', 3, true);


--
-- Name: order_details_sequence; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.order_details_sequence', 51, true);


--
-- Name: orders_sequence; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.orders_sequence', 3, true);


--
-- Name: payments_sequence; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.payments_sequence', 20, true);


--
-- Name: products_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.products_seq', 68, true);


--
-- Name: rayons_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.rayons_seq', 6, true);


--
-- Name: sales_sequence; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.sales_sequence', 2, true);


--
-- Name: suppliers_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.suppliers_seq', 5, true);


--
-- Name: units_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.units_seq', 154, true);


--
-- Name: warehouses_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public.warehouses_seq', 4, true);


--
-- Name: customers PK_customers; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "PK_customers" PRIMARY KEY (id);


--
-- Name: test_products PK_products; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.test_products
    ADD CONSTRAINT "PK_products" PRIMARY KEY (id);


--
-- Name: categories pk_categories; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT pk_categories PRIMARY KEY (id);


--
-- Name: payment_methods pk_methods; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payment_methods
    ADD CONSTRAINT pk_methods PRIMARY KEY (id);


--
-- Name: order_details pk_order_details; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT pk_order_details PRIMARY KEY (id);


--
-- Name: orders pk_orders; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT pk_orders PRIMARY KEY (id);


--
-- Name: payments pk_payments; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT pk_payments PRIMARY KEY (id);


--
-- Name: products pk_products; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT pk_products PRIMARY KEY (id);


--
-- Name: rayons pk_rayons; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.rayons
    ADD CONSTRAINT pk_rayons PRIMARY KEY (id);


--
-- Name: salesmans pk_sales; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.salesmans
    ADD CONSTRAINT pk_sales PRIMARY KEY (id);


--
-- Name: suppliers pk_suppliers; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT pk_suppliers PRIMARY KEY (id);


--
-- Name: units pk_units; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT pk_units PRIMARY KEY (id);


--
-- Name: warehouses pk_warehouses; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.warehouses
    ADD CONSTRAINT pk_warehouses PRIMARY KEY (id);


--
-- Name: test_categories test_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.test_categories
    ADD CONSTRAINT test_categories_pkey PRIMARY KEY (id);


--
-- Name: IX_customers_rayons; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IX_customers_rayons" ON public.customers USING btree (rayon_id);


--
-- Name: IX_product_lower_name; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IX_product_lower_name" ON public.products USING btree (lower((name)::text));


--
-- Name: IX_supplier_lower_name; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX "IX_supplier_lower_name" ON public.suppliers USING btree (lower((name)::text));


--
-- Name: UQ_customers_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "UQ_customers_name" ON public.customers USING btree (name);


--
-- Name: UQ_product_code; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "UQ_product_code" ON public.test_products USING btree (code);


--
-- Name: UQ_product_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "UQ_product_name" ON public.test_products USING btree (name);


--
-- Name: UQ_test_categories_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX "UQ_test_categories_name" ON public.test_categories USING btree (name);


--
-- Name: categories_eq_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX categories_eq_name ON public.categories USING btree (name);


--
-- Name: details_ix_orders; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX details_ix_orders ON public.order_details USING btree (order_id);


--
-- Name: details_ix_products; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX details_ix_products ON public.order_details USING btree (product_id);


--
-- Name: details_ix_units; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX details_ix_units ON public.order_details USING btree (unit_id);


--
-- Name: ix_category_lower_name; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX ix_category_lower_name ON public.categories USING btree (name);


--
-- Name: ix_units_products; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX ix_units_products ON public.units USING btree (product_id);


--
-- Name: methods_ix_payments; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX methods_ix_payments ON public.payments USING btree (method_id);


--
-- Name: orders_ix_customers; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX orders_ix_customers ON public.orders USING btree (customer_id);


--
-- Name: orders_ix_sales; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX orders_ix_sales ON public.orders USING btree (sales_id);


--
-- Name: payments_ix_orders; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX payments_ix_orders ON public.payments USING btree (order_id);


--
-- Name: products_ix_categories; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX products_ix_categories ON public.products USING btree (category_id);


--
-- Name: products_ix_suppliers; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX products_ix_suppliers ON public.products USING btree (supplier_id);


--
-- Name: products_ix_warehouses; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX products_ix_warehouses ON public.products USING btree (warehouse_id);


--
-- Name: products_uq_code; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX products_uq_code ON public.products USING btree (code);


--
-- Name: products_uq_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX products_uq_name ON public.products USING btree (name);


--
-- Name: rayons_eq_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX rayons_eq_name ON public.rayons USING btree (name);


--
-- Name: suppliers_eq_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX suppliers_eq_name ON public.suppliers USING btree (name);


--
-- Name: test_product_ix_categories; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX test_product_ix_categories ON public.test_products USING btree (category_id);


--
-- Name: test_product_ix_suppliers; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX test_product_ix_suppliers ON public.test_products USING btree (supplier_id);


--
-- Name: test_product_ix_warehouses; Type: INDEX; Schema: public; Owner: root
--

CREATE INDEX test_product_ix_warehouses ON public.test_products USING btree (warehouse_id);


--
-- Name: uq_method_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX uq_method_name ON public.payment_methods USING btree (name);


--
-- Name: uq_units_barcode; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX uq_units_barcode ON public.units USING btree (barcode);


--
-- Name: uq_untis_content_per_product; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX uq_untis_content_per_product ON public.units USING btree (product_id, content);


--
-- Name: uq_untis_name_per_product; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX uq_untis_name_per_product ON public.units USING btree (product_id, name);


--
-- Name: warehouses_eq_name; Type: INDEX; Schema: public; Owner: root
--

CREATE UNIQUE INDEX warehouses_eq_name ON public.warehouses USING btree (name);


--
-- Name: categories categories_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER categories_create_timestamp BEFORE INSERT ON public.categories FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: categories categories_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER categories_update_timestamp BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: customers customers_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER customers_create_timestamp BEFORE INSERT ON public.customers FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: customers customers_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER customers_update_timestamp BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: payment_methods methods_trig_create; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER methods_trig_create BEFORE INSERT ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: payment_methods methods_trig_update; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER methods_trig_update BEFORE UPDATE ON public.payment_methods FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: order_details od_create; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER od_create BEFORE INSERT ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.od_on_create();


--
-- Name: order_details od_delete; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER od_delete AFTER DELETE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.od_on_delete();


--
-- Name: order_details od_update; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER od_update BEFORE UPDATE ON public.order_details FOR EACH ROW EXECUTE FUNCTION public.od_on_update();


--
-- Name: orders orders_create; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER orders_create BEFORE INSERT ON public.orders FOR EACH ROW EXECUTE FUNCTION public.orders_on_create();


--
-- Name: orders orders_update; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER orders_update BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.orders_on_update();


--
-- Name: payments payments_trig_create; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER payments_trig_create BEFORE INSERT ON public.payments FOR EACH ROW EXECUTE FUNCTION public.payments_on_create();


--
-- Name: payments payments_trig_delete; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER payments_trig_delete AFTER DELETE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.payments_on_delete();


--
-- Name: payments payments_trig_update; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER payments_trig_update BEFORE UPDATE ON public.payments FOR EACH ROW EXECUTE FUNCTION public.payments_on_update();


--
-- Name: products products_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER products_create_timestamp BEFORE INSERT ON public.products FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: products products_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER products_update_timestamp BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: rayons rayons_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER rayons_create_timestamp BEFORE INSERT ON public.rayons FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: rayons rayons_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER rayons_update_timestamp BEFORE UPDATE ON public.rayons FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: salesmans sales_trig_create; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER sales_trig_create BEFORE INSERT ON public.salesmans FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: salesmans sales_trig_update; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER sales_trig_update BEFORE UPDATE ON public.salesmans FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: suppliers suppliers_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER suppliers_create_timestamp BEFORE INSERT ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: suppliers suppliers_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER suppliers_update_timestamp BEFORE UPDATE ON public.suppliers FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: units units_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER units_create_timestamp BEFORE INSERT ON public.units FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: units units_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER units_update_timestamp BEFORE UPDATE ON public.units FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: warehouses warehouses_create_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER warehouses_create_timestamp BEFORE INSERT ON public.warehouses FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_create();


--
-- Name: warehouses warehouses_update_timestamp; Type: TRIGGER; Schema: public; Owner: root
--

CREATE TRIGGER warehouses_update_timestamp BEFORE UPDATE ON public.warehouses FOR EACH ROW EXECUTE FUNCTION public.timestamp_on_update();


--
-- Name: customers FK_customers_rayons; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT "FK_customers_rayons" FOREIGN KEY (rayon_id) REFERENCES public.rayons(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: units fk_units_products; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.units
    ADD CONSTRAINT fk_units_products FOREIGN KEY (product_id) REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments methods_fk_payments; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT methods_fk_payments FOREIGN KEY (method_id) REFERENCES public.payment_methods(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: order_details order_details_fk_orders; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_fk_orders FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: order_details order_details_fk_products; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_fk_products FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_details order_details_fk_units; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.order_details
    ADD CONSTRAINT order_details_fk_units FOREIGN KEY (unit_id) REFERENCES public.units(id) ON DELETE CASCADE;


--
-- Name: orders orders_fk_customers; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_fk_customers FOREIGN KEY (customer_id) REFERENCES public.customers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: orders orders_fk_sales; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_fk_sales FOREIGN KEY (sales_id) REFERENCES public.salesmans(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: payments payments_fk_orders; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_fk_orders FOREIGN KEY (order_id) REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_fk_categories; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_fk_categories FOREIGN KEY (category_id) REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_fk_suppliers; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_fk_suppliers FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: products products_fk_warehouses; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_fk_warehouses FOREIGN KEY (warehouse_id) REFERENCES public.warehouses(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: test_products test_product_fk_categories; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public.test_products
    ADD CONSTRAINT test_product_fk_categories FOREIGN KEY (category_id) REFERENCES public.test_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO root;


--
-- PostgreSQL database dump complete
--

