-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caster_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" TEXT,
    "area" TEXT,
    "occupation" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "caster_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orderer_profiles" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "full_name" TEXT,
    "website_url" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "desired_work_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "desired_occupations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "orderer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "caster_profiles_user_id_key" ON "caster_profiles"("user_id");

-- CreateIndex
CREATE INDEX "caster_profiles_user_id_idx" ON "caster_profiles"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "orderer_profiles_user_id_key" ON "orderer_profiles"("user_id");

-- CreateIndex
CREATE INDEX "orderer_profiles_user_id_idx" ON "orderer_profiles"("user_id");

-- AddForeignKey
ALTER TABLE "caster_profiles" ADD CONSTRAINT "caster_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderer_profiles" ADD CONSTRAINT "orderer_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
