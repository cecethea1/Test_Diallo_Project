BEGIN;

--Created in configuration file
CREATE EXTENSION IF NOT EXISTS hstore;
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS timescaledb;

DROP TABLE IF EXISTS measures CASCADE;
DROP TABLE IF EXISTS sensors CASCADE;
DROP TABLE IF EXISTS sites CASCADE;
DROP TABLE IF EXISTS media CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS projects_companies CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS alert_logs CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS alert_contact CASCADE;
DROP TABLE IF EXISTS site_gateway CASCADE;
DROP TABLE IF EXISTS gateways CASCADE;
DROP TABLE IF EXISTS config_graph CASCADE;
DROP TABLE IF EXISTS config CASCADE;
DROP TABLE IF EXISTS metric CASCADE;
DROP TABLE IF EXISTS thresholds CASCADE;
DROP TABLE IF EXISTS dashboards CASCADE;
DROP TABLE IF EXISTS dashboard_components CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS users_logs CASCADE;
DROP TYPE IF EXISTS industry_type CASCADE;
DROP TYPE IF EXISTS site_type CASCADE;
DROP TYPE IF EXISTS company_role CASCADE;
DROP TYPE IF EXISTS graph_type CASCADE;
DROP TYPE IF EXISTS transfer_protocole CASCADE;
DROP TYPE IF EXISTS sensor_types CASCADE;
DROP TYPE IF EXISTS sensor_groups CASCADE;


CREATE TYPE industry_type AS ENUM ('BTP', 'PETROLE', 'MONITORING', 'AERONAUTIQUE', 'MILITAIRE', 'TOPOGRAPHIE', 'HYDRAULIQUE');
CREATE TYPE site_type AS ENUM ('GARE', 'OA', 'SNCF', 'TRAM');
CREATE TYPE company_role as ENUM ('client', 'supplier');
CREATE TYPE graph_type as ENUM ('timeseries', 'cumulative');
CREATE TYPE transfer_protocole as ENUM ('FTP', 'HTTP');
-- Store companies
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT,
  type industry_type, -- secteur d'activité du client
  groupe TEXT, -- si elle est une filiale d'une autre entreprise
  address TEXT,
  city TEXT,
  postcode TEXT,
  country TEXT,
  geom GEOMETRY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS _index_name_companies ON companies (name);

-- Store users
-- DROP TABLE IF EXISTS users; 
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE,
  password TEXT,
  first_name TEXT,
  last_name TEXT,
  push_sub TEXT,
  pw_change_token TEXT,
  country TEXT,
  city TEXT,
  phone_number TEXT,
  position TEXT,
  company_id INTEGER REFERENCES companies(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS _index_users_email ON users (email);


-- Store Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  project_photo TEXT,
  name TEXT,
  country TEXT,
  client_comapany_name TEXT,
  time_zone TEXT,
  city TEXT,
  start_date DATE,
  description TEXT, -- description brève du projet
  amount FLOAT, -- montant du projet
  previsional_end DATE, -- date de la fin prévisionnelle du projet
  geom GEOMETRY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS _index_name_projects ON projects (name);

-- A project can have multiple clients. Also, it can be managed by multiple companies
CREATE TABLE projects_companies (
  project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES companies(id) ON DELETE CASCADE,
  role company_role, -- whether the company is a client or a supplier
  PRIMARY KEY (project_id, company_id)
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  type TEXT, -- MIME type exemple image/png
  name TEXT,
  description TEXT ,
  url TEXT,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store Sites
CREATE TABLE sites (
  id SERIAL PRIMARY KEY,
  name TEXT,
  type SITE_TYPE, -- A site can be a Station / "Ouvrage annexe" / Dam...
  extent GEOMETRY, -- emprise de l'ouvrage
  start_date DATE,
  previsional_end DATE,
  project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS _index_name_sites ON sites (name);

--store boxes that manage the sensors on site
CREATE TABLE gateways (
  id SERIAL PRIMARY KEY,
  file_name TEXT,
  gateway_name TEXT  NOT NULL,
  serial_number varchar(40) NOT NULL,
  project_name varchar(40) ,
  type transfer_protocole,
  power_supply varchar(30),
  installation_date DATE ,
  operating_team varchar(40),
  X double precision,
  Y double precision,
  Z double precision
);
CREATE INDEX IF NOT EXISTS _index_name_gateway ON gateways (gateway_name);


CREATE TABLE site_gateway (
  id SERIAL PRIMARY KEY,
  site_id INTEGER REFERENCES sites(id),
  gateway_id INTEGER REFERENCES gateways(id)
);


-- Store configuration table that is the main link with ETL
CREATE TABLE config (
  id SERIAL PRIMARY KEY,
  file_name TEXT,
  last_treatment  TIMESTAMPTZ NOT NULL,
  ftp_ip TEXT,
  ftp_directory TEXT,
  config JSONB,
  gateway_id INTEGER REFERENCES gateways(id)
);
CREATE INDEX IF NOT EXISTS _index_name_Configuration ON Config (file_name);



-- Store sensors groups
CREATE TABLE sensor_groups
        ( id INTEGER NOT NULL PRIMARY KEY
        , group_name varchar NOT NULL
        , priority INTEGER NOT NULL
        , flipflag boolean NOT NULL default false);

-- Store sensors type
create table sensor_types(
  id serial PRIMARY KEY,
  type_name text ,
  type_description text,
  type_groups INTEGER REFERENCES sensor_groups(id),
  extra_data hstore,
  specifique_extra_data hstore,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Store sensors that contain all active sensors unless prisms
CREATE TABLE sensors (
  id SERIAL PRIMARY KEY,
  sensor_name varchar(30),
  point_x double precision,
  point_y double precision,
  point_z double precision,
  installation_date date,
  uninstallation_date date,
  operator_name TEXT,
  serial_number TEXT,
  installation_sheet TEXT,
  id_sites JSONB,
  id_sub_site INTEGER,
  initial_frequency INTEGER, -- la fréquence initiale d'acquisition de données par le capteur en Minutes
  sensor_type INTEGER REFERENCES sensor_types(id),
  sensor_tags hstore,
  gateway_id INTEGER REFERENCES site_gateway(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS _index_name_sensors ON sites (name);


-- store metrics
CREATE TABLE metric (
    id SERIAL PRIMARY KEY,
    metric text,
	  Unit text
	);
-- store measures
CREATE TABLE measures (
  timestamp TIMESTAMPTZ  NOT NULL,
  value double precision,
  sensor_id INTEGER REFERENCES sensors(id),
	metric_id INTEGER REFERENCES Metric(id),
  checked BOOLEAN default false
);
CREATE INDEX IF NOT EXISTS _index_value ON measures (timestamp DESC,value );
-- SELECT create_hypertable('Measures', 'timestamp');

--create  table that contains thresholds as hstore
CREATE TABLE thresholds (
   threshold hstore,
   sensor_id INTEGER REFERENCES sensors(id),
   metric_id INTEGER REFERENCES Metric(id)
	);


--store alerts
CREATE TABLE alert_contact
(
    id SERIAL PRIMARY KEY,
    type text,
    email text,
    phone_number text,
    sensor_id INTEGER  REFERENCES sensors (id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alert_logs
(
    id SERIAL PRIMARY KEY,
    count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE alerts
(
    id SERIAL PRIMARY KEY,
    type text,
    payload hstore, -- exp:  "sensor_id"=>1, "timestamp"=>"2013-06-05 04:00:00.000000 +00:00", "metric"=>deformation, "unit"=>"mm", "threshold"=>"LLL",  "measured_value"=>12.2, "threshold_value"=>12.5
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dashboards
(
    id         SERIAL PRIMARY KEY,
    name       TEXT,
    payload    jsonb,
    user_id    INTEGER     REFERENCES users (id),
    project_id INTEGER     REFERENCES projects (id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dashboard_components
(
    id           SERIAL PRIMARY KEY,
    type         text,
    project_id   INTEGER     REFERENCES projects (id),
    payload      jsonb,
    created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE users_logs(
  id SERIAL PRIMARY KEY,
  login TIMESTAMPTZ NOT NULL,
  logout TIMESTAMPTZ,
  token VARCHAR(500), 
  user_id INTEGER REFERENCES users(id)
);


-- store the graph table
CREATE TABLE config_graph (
  id SERIAL PRIMARY KEY,
  name varchar(30),
  type  graph_type,
  metric  INTEGER REFERENCES metric(id) ON DELETE SET NULL,
  min_x double precision,
  max_x double precision,
  min_y double precision,
  max_y double precision,
  site_id INTEGER REFERENCES sites (id) ON DELETE SET NULL,
  sensors_id INTEGER[]
);

-- add notifications for conserned users when alert detected
CREATE TABLE notifications
(
    id         SERIAL,
    receiver   INTEGER REFERENCES users (id),
    read       BOOLEAN DEFAULT FALSE,
    payload    hstore,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

COMMIT;

