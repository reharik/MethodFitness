

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
  "handlerType" text
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "lastProcessedPosition"
  OWNER TO methodfitness;

-- Table: states

DROP TABLE IF EXISTS states;

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

DROP TABLE IF EXISTS trainer;

CREATE TABLE trainer
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE trainer
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

-- Table: "trainerSummary"

DROP TABLE IF EXISTS "trainerSummary";

CREATE TABLE "trainerSummary"
(
  id uuid NOT NULL,
  document jsonb
)
WITH (
  OIDS=FALSE
);
ALTER TABLE "trainerSummary"
  OWNER TO methodfitness;

COMMIT;