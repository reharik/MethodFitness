

-- DROP SCHEMA public;

GRANT ALL ON SCHEMA public TO methodfitness;
GRANT ALL ON SCHEMA public TO public;
COMMENT ON SCHEMA public
  IS 'standard public schema';

-- Table: "lastProcessedPosition"


DROP TABLE IF EXISTS "lastProcessedPosition";

CREATE TABLE "lastProcessedPosition"
(
  id uuid NOT NULL,
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
  id uuid NOT NULL,
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
  id uuid NOT NULL,
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
  id uuid NOT NULL,
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
  id uuid NOT NULL,
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
  id uuid NOT NULL,
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
  id uuid NOT NULL,
  trainer uuid NOT NULL,
  date date NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "appointment"
  OWNER TO methodfitness;


-- Table: "session"
DROP TABLE IF EXISTS "session";

CREATE TABLE "session"
(
  id uuid NOT NULL,
  used bool,
  client uuid NOT NULL,
  type varchar(50) NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "session"
  OWNER TO methodfitness;

-- Table: "purchase"

DROP TABLE IF EXISTS "purchase";

CREATE TABLE "purchase"
(
  id uuid NOT NULL,
  client uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);

ALTER TABLE "purchase"
  OWNER TO methodfitness;
