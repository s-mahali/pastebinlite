CREATE TABLE "pastes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"content" text NOT NULL,
	"max_views" integer,
	"remaining_views" integer,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
