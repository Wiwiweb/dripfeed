-- Table: public.webcomics

CREATE TABLE public.webcomics
(
  id integer NOT NULL DEFAULT nextval('webcomics_id_seq'::regclass),
  name character varying,
  main_url character varying,
  CONSTRAINT webcomic_id PRIMARY KEY (id)
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.webcomics
  OWNER TO postgres;

-- Constraint: public.webcomic_id

ALTER TABLE public.webcomics
  ADD CONSTRAINT webcomic_id PRIMARY KEY(id);


-- Table: public.pages

CREATE TABLE public.pages
(
  id integer NOT NULL DEFAULT nextval('pages_id_seq'::regclass),
  page_nb integer NOT NULL,
  webcomic_id integer NOT NULL,
  url character varying,
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

-- Constraint: public.page_id

-- ALTER TABLE public.pages DROP CONSTRAINT page_id;

ALTER TABLE public.pages
ADD CONSTRAINT page_id PRIMARY KEY(id);
