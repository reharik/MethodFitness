

GRANT ALL ON SCHEMA public TO methodfitness;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public
  IS 'standard public schema';

-- Table: "lastProcessedPosition"


DROP TABLE IF EXISTS "lastProcessedPosition";

CREATE TABLE "lastProcessedPosition"
(
  id uuid PRIMARY KEY,
  "commitPosition" bigint,
  "preparePosition" bigint,
  "handlerType" text UNIQUE
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "lastProcessedPosition"
  OWNER TO methodfitness;

-- Table: states


DROP TABLE IF EXISTS "states";

CREATE TABLE states
(
  id uuid PRIMARY KEY,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE states
  OWNER TO methodfitness;

-- Table: trainer

DROP TABLE IF EXISTS "trainer";
CREATE TABLE trainer
(
  id uuid PRIMARY KEY,
  archived boolean DEFAULT false,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE trainer
  OWNER TO methodfitness;

-- Table: client

DROP TABLE IF EXISTS "client";

CREATE TABLE client
(
  id uuid PRIMARY KEY,
  archived boolean DEFAULT false,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE client
  OWNER TO methodfitness;

-- Table: "trainerLoggedIn"

DROP TABLE IF EXISTS "trainerLoggedIn";

CREATE TABLE "trainerLoggedIn"
(
  id uuid PRIMARY KEY,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "trainerLoggedIn"
  OWNER TO methodfitness;

-- Table: "user"

DROP TABLE IF EXISTS "user";

CREATE TABLE "user"
(
  id uuid PRIMARY KEY,
  archived boolean DEFAULT false,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "user"
  OWNER TO methodfitness;

-- Table: "appointment"

DROP TABLE IF EXISTS "appointment";

CREATE TABLE "appointment"
(
  id uuid PRIMARY KEY,
  trainer uuid NOT NULL,
  date date NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "appointment"
  OWNER TO methodfitness;


-- Table: "clientSessions"
DROP TABLE IF EXISTS "clientSessions";

CREATE TABLE "clientSessions"
(
  id uuid PRIMARY KEY,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "clientSessions"
  OWNER TO methodfitness;

-- Table: "purchase"

DROP TABLE IF EXISTS "purchase";

CREATE TABLE "purchase"
(
  id uuid PRIMARY KEY,
  client uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "purchase"
  OWNER TO methodfitness;

DROP TABLE IF EXISTS "unpaidAppointments";

CREATE TABLE "unpaidAppointments"
(
  id uuid PRIMARY KEY,
  meta jsonb,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "unpaidAppointments"
  OWNER TO methodfitness;

DROP TABLE IF EXISTS "trainerPayments";

CREATE TABLE "trainerPayments"
(
  id uuid PRIMARY KEY,
  meta jsonb,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "trainerPayments"
  OWNER TO methodfitness;
