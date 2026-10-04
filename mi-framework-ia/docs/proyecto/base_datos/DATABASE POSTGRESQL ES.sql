--
-- PostgreSQL database dump
--

\restrict HaJiO9JF3O6IYcKex0cEyBwGyX1N4XxVqulpITovVl1y2fysEF6KDJUU53TnFid

-- Dumped from database version 16.15 (Debian 16.15-1.pgdg12+2)
-- Dumped by pg_dump version 16.15 (Debian 16.15-1.pgdg12+2)

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
-- Name: meta; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA meta;


ALTER SCHEMA meta OWNER TO postgres;

--
-- Name: vector; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA public;


--
-- Name: EXTENSION vector; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION vector IS 'vector data type and ivfflat and hnsw access methods';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: migraciones; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.migraciones (
    version text NOT NULL,
    nombre text,
    aplicado_en timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE meta.migraciones OWNER TO postgres;

--
-- Name: vectores; Type: TABLE; Schema: meta; Owner: postgres
--

CREATE TABLE meta.vectores (
    id bigint NOT NULL,
    creado_en timestamp with time zone DEFAULT now() NOT NULL,
    contenido text NOT NULL,
    vector public.vector(384) NOT NULL
);


ALTER TABLE meta.vectores OWNER TO postgres;

--
-- Name: vectores_id_seq; Type: SEQUENCE; Schema: meta; Owner: postgres
--

ALTER TABLE meta.vectores ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME meta.vectores_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: danos_detectados; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.danos_detectados (
    id uuid NOT NULL,
    preperitaje_id uuid,
    severidad text,
    tipo_dano text NOT NULL,
    descripcion text NOT NULL,
    confianza numeric(5,2),
    creado_en timestamp with time zone DEFAULT now(),
    CONSTRAINT danos_detectados_severidad_check CHECK ((severidad = ANY (ARRAY['bajo'::text, 'medio'::text, 'alto'::text, 'critico'::text])))
);


ALTER TABLE public.danos_detectados OWNER TO postgres;

--
-- Name: fotografias; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.fotografias (
    id uuid NOT NULL,
    vehiculo_id uuid,
    tipo_fotografia text NOT NULL,
    ruta_archivo text NOT NULL,
    url text NOT NULL,
    es_principal boolean DEFAULT false,
    creado_en timestamp with time zone DEFAULT now()
);


ALTER TABLE public.fotografias OWNER TO postgres;

--
-- Name: preguntas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preguntas (
    id uuid NOT NULL,
    codigo text NOT NULL,
    texto text NOT NULL,
    tipo text,
    obligatoria boolean DEFAULT false,
    orden integer NOT NULL,
    creado_en timestamp with time zone DEFAULT now(),
    CONSTRAINT preguntas_tipo_check CHECK ((tipo = ANY (ARRAY['texto'::text, 'seleccion'::text, 'numero'::text, 'booleano'::text])))
);


ALTER TABLE public.preguntas OWNER TO postgres;

--
-- Name: preperitajes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.preperitajes (
    id uuid NOT NULL,
    usuario_id uuid,
    vehiculo_id uuid,
    estado text,
    enviado_en timestamp with time zone,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now(),
    CONSTRAINT preperitajes_estado_check CHECK ((estado = ANY (ARRAY['borrador'::text, 'en_revision'::text, 'procesando'::text, 'completado'::text, 'error'::text])))
);


ALTER TABLE public.preperitajes OWNER TO postgres;

--
-- Name: respuestas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.respuestas (
    id uuid NOT NULL,
    preperitaje_id uuid,
    pregunta_id uuid,
    respuesta text,
    respuesta_json jsonb,
    creado_en timestamp with time zone DEFAULT now()
);


ALTER TABLE public.respuestas OWNER TO postgres;

--
-- Name: resultados_ia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultados_ia (
    id uuid NOT NULL,
    preperitaje_id uuid,
    resumen text NOT NULL,
    advertencia text NOT NULL,
    confianza_ia numeric(5,2),
    creado_en timestamp with time zone DEFAULT now()
);


ALTER TABLE public.resultados_ia OWNER TO postgres;

--
-- Name: TABLE resultados_ia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.resultados_ia IS 'Resultados preliminares, no reemplazan un peritaje profesional.';


--
-- Name: COLUMN resultados_ia.resumen; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.resultados_ia.resumen IS 'Resumen del preperitaje.';


--
-- Name: COLUMN resultados_ia.advertencia; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.resultados_ia.advertencia IS 'Advertencia preliminar.';


--
-- Name: solicitudes_analisis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.solicitudes_analisis (
    id uuid NOT NULL,
    preperitaje_id uuid,
    estado text,
    datos_enviados jsonb NOT NULL,
    respuesta_json jsonb,
    creado_en timestamp with time zone DEFAULT now(),
    finalizado_en timestamp with time zone,
    CONSTRAINT solicitudes_analisis_estado_check CHECK ((estado = ANY (ARRAY['en_cola'::text, 'procesando'::text, 'exitoso'::text, 'fallido'::text])))
);


ALTER TABLE public.solicitudes_analisis OWNER TO postgres;

--
-- Name: usuarios; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.usuarios (
    id uuid NOT NULL,
    email text NOT NULL,
    contrasena_hash text,
    nombre_completo text,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);


ALTER TABLE public.usuarios OWNER TO postgres;

--
-- Name: valoraciones; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.valoraciones (
    id uuid NOT NULL,
    preperitaje_id uuid,
    valor_min numeric(12,2) NOT NULL,
    valor_max numeric(12,2) NOT NULL,
    moneda text DEFAULT 'COP'::text,
    factores_influencia text,
    creado_en timestamp with time zone DEFAULT now()
);


ALTER TABLE public.valoraciones OWNER TO postgres;

--
-- Name: vehiculos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vehiculos (
    id uuid NOT NULL,
    usuario_id uuid,
    marca text NOT NULL,
    modelo text NOT NULL,
    anio integer NOT NULL,
    kilometraje integer NOT NULL,
    placa text,
    color text,
    creado_en timestamp with time zone DEFAULT now(),
    actualizado_en timestamp with time zone DEFAULT now()
);


ALTER TABLE public.vehiculos OWNER TO postgres;

--
-- Data for Name: migraciones; Type: TABLE DATA; Schema: meta; Owner: postgres
--

COPY meta.migraciones (version, nombre, aplicado_en) FROM stdin;
202407160001	embeddings	2026-09-21 16:15:11.965+00
\.


--
-- Data for Name: vectores; Type: TABLE DATA; Schema: meta; Owner: postgres
--

COPY meta.vectores (id, creado_en, contenido, vector) FROM stdin;
\.


--
-- Data for Name: danos_detectados; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.danos_detectados (id, preperitaje_id, severidad, tipo_dano, descripcion, confianza, creado_en) FROM stdin;
\.


--
-- Data for Name: fotografias; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.fotografias (id, vehiculo_id, tipo_fotografia, ruta_archivo, url, es_principal, creado_en) FROM stdin;
\.


--
-- Data for Name: preguntas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preguntas (id, codigo, texto, tipo, obligatoria, orden, creado_en) FROM stdin;
\.


--
-- Data for Name: preperitajes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.preperitajes (id, usuario_id, vehiculo_id, estado, enviado_en, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: respuestas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.respuestas (id, preperitaje_id, pregunta_id, respuesta, respuesta_json, creado_en) FROM stdin;
\.


--
-- Data for Name: resultados_ia; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.resultados_ia (id, preperitaje_id, resumen, advertencia, confianza_ia, creado_en) FROM stdin;
\.


--
-- Data for Name: solicitudes_analisis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.solicitudes_analisis (id, preperitaje_id, estado, datos_enviados, respuesta_json, creado_en, finalizado_en) FROM stdin;
\.


--
-- Data for Name: usuarios; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.usuarios (id, email, contrasena_hash, nombre_completo, creado_en, actualizado_en) FROM stdin;
\.


--
-- Data for Name: valoraciones; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.valoraciones (id, preperitaje_id, valor_min, valor_max, moneda, factores_influencia, creado_en) FROM stdin;
\.


--
-- Data for Name: vehiculos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vehiculos (id, usuario_id, marca, modelo, anio, kilometraje, placa, color, creado_en, actualizado_en) FROM stdin;
\.


--
-- Name: vectores_id_seq; Type: SEQUENCE SET; Schema: meta; Owner: postgres
--

SELECT pg_catalog.setval('meta.vectores_id_seq', 1, false);


--
-- Name: migraciones migraciones_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.migraciones
    ADD CONSTRAINT migraciones_pkey PRIMARY KEY (version);


--
-- Name: vectores vectores_pkey; Type: CONSTRAINT; Schema: meta; Owner: postgres
--

ALTER TABLE ONLY meta.vectores
    ADD CONSTRAINT vectores_pkey PRIMARY KEY (id);


--
-- Name: danos_detectados danos_detectados_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danos_detectados
    ADD CONSTRAINT danos_detectados_pkey PRIMARY KEY (id);


--
-- Name: fotografias fotografias_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotografias
    ADD CONSTRAINT fotografias_pkey PRIMARY KEY (id);


--
-- Name: preguntas preguntas_codigo_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_codigo_key UNIQUE (codigo);


--
-- Name: preguntas preguntas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preguntas
    ADD CONSTRAINT preguntas_pkey PRIMARY KEY (id);


--
-- Name: preperitajes preperitajes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preperitajes
    ADD CONSTRAINT preperitajes_pkey PRIMARY KEY (id);


--
-- Name: respuestas respuestas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pkey PRIMARY KEY (id);


--
-- Name: resultados_ia resultados_ia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_ia
    ADD CONSTRAINT resultados_ia_pkey PRIMARY KEY (id);


--
-- Name: solicitudes_analisis solicitudes_analisis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_analisis
    ADD CONSTRAINT solicitudes_analisis_pkey PRIMARY KEY (id);


--
-- Name: usuarios usuarios_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_email_key UNIQUE (email);


--
-- Name: usuarios usuarios_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.usuarios
    ADD CONSTRAINT usuarios_pkey PRIMARY KEY (id);


--
-- Name: valoraciones valoraciones_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones
    ADD CONSTRAINT valoraciones_pkey PRIMARY KEY (id);


--
-- Name: vehiculos vehiculos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_pkey PRIMARY KEY (id);


--
-- Name: vehiculos vehiculos_placa_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_placa_key UNIQUE (placa);


--
-- Name: idx_fotografias_vehiculo_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_fotografias_vehiculo_id ON public.fotografias USING btree (vehiculo_id);


--
-- Name: idx_preperitajes_estado; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_preperitajes_estado ON public.preperitajes USING btree (estado);


--
-- Name: idx_respuestas_preperitaje_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_respuestas_preperitaje_id ON public.respuestas USING btree (preperitaje_id);


--
-- Name: idx_vehiculos_placa; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehiculos_placa ON public.vehiculos USING btree (placa);


--
-- Name: idx_vehiculos_usuario_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_vehiculos_usuario_id ON public.vehiculos USING btree (usuario_id);


--
-- Name: danos_detectados danos_detectados_preperitaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.danos_detectados
    ADD CONSTRAINT danos_detectados_preperitaje_id_fkey FOREIGN KEY (preperitaje_id) REFERENCES public.preperitajes(id) ON DELETE CASCADE;


--
-- Name: fotografias fotografias_vehiculo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.fotografias
    ADD CONSTRAINT fotografias_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id) ON DELETE CASCADE;


--
-- Name: preperitajes preperitajes_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preperitajes
    ADD CONSTRAINT preperitajes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: preperitajes preperitajes_vehiculo_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.preperitajes
    ADD CONSTRAINT preperitajes_vehiculo_id_fkey FOREIGN KEY (vehiculo_id) REFERENCES public.vehiculos(id) ON DELETE CASCADE;


--
-- Name: respuestas respuestas_pregunta_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_pregunta_id_fkey FOREIGN KEY (pregunta_id) REFERENCES public.preguntas(id) ON DELETE CASCADE;


--
-- Name: respuestas respuestas_preperitaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.respuestas
    ADD CONSTRAINT respuestas_preperitaje_id_fkey FOREIGN KEY (preperitaje_id) REFERENCES public.preperitajes(id) ON DELETE CASCADE;


--
-- Name: resultados_ia resultados_ia_preperitaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultados_ia
    ADD CONSTRAINT resultados_ia_preperitaje_id_fkey FOREIGN KEY (preperitaje_id) REFERENCES public.preperitajes(id) ON DELETE CASCADE;


--
-- Name: solicitudes_analisis solicitudes_analisis_preperitaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.solicitudes_analisis
    ADD CONSTRAINT solicitudes_analisis_preperitaje_id_fkey FOREIGN KEY (preperitaje_id) REFERENCES public.preperitajes(id) ON DELETE CASCADE;


--
-- Name: valoraciones valoraciones_preperitaje_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.valoraciones
    ADD CONSTRAINT valoraciones_preperitaje_id_fkey FOREIGN KEY (preperitaje_id) REFERENCES public.preperitajes(id) ON DELETE CASCADE;


--
-- Name: vehiculos vehiculos_usuario_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vehiculos
    ADD CONSTRAINT vehiculos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.usuarios(id) ON DELETE CASCADE;


--
-- Name: preperitajes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.preperitajes ENABLE ROW LEVEL SECURITY;

--
-- Name: usuarios; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

--
-- Name: vehiculos; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.vehiculos ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict HaJiO9JF3O6IYcKex0cEyBwGyX1N4XxVqulpITovVl1y2fysEF6KDJUU53TnFid

