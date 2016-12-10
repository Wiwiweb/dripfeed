-- Sequence: public.webcomics_id_seq

CREATE SEQUENCE public.webcomics_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.webcomics_id_seq
  OWNER TO postgres;

-- Sequence: public.pages_id_seq

CREATE SEQUENCE public.pages_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.pages_id_seq
  OWNER TO postgres;


-- Table: public.webcomics

CREATE TABLE public.webcomics
(
  id integer NOT NULL DEFAULT nextval('webcomics_id_seq'::regclass),
  name character varying,
  main_url character varying,
  description character varying,
  CONSTRAINT webcomic_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.webcomics
  OWNER TO postgres;


-- Table: public.pages

CREATE TABLE public.pages
(
  id integer NOT NULL DEFAULT nextval('pages_id_seq'::regclass),
  page_nb integer NOT NULL,
  url character varying,
  title character varying,
  webcomic_id integer NOT NULL,
  CONSTRAINT page_id PRIMARY KEY (id),
  CONSTRAINT webcomic_id FOREIGN KEY (webcomic_id)
      REFERENCES public.webcomics (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.pages
  OWNER TO postgres;

-- Index: public.fki_webcomic_id

CREATE INDEX fki_webcomic_id
  ON public.pages
  USING btree
  (webcomic_id);
