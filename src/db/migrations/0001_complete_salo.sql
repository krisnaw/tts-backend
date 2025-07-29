CREATE TABLE "records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"content" text NOT NULL,
	"pitch" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"volume" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"rate" numeric(5, 2) DEFAULT '1.0' NOT NULL,
	"voice" text NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
