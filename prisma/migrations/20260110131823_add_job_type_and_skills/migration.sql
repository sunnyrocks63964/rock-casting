-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('photographer', 'model', 'artist', 'creator');

-- CreateTable
CREATE TABLE "caster_job_types" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "caster_profile_id" UUID NOT NULL,
    "job_type" "JobType" NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "caster_job_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caster_job_skills" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "job_type_id" UUID NOT NULL,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "caster_job_skills_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "caster_job_types_caster_profile_id_idx" ON "caster_job_types"("caster_profile_id");

-- CreateIndex
CREATE INDEX "caster_job_types_job_type_idx" ON "caster_job_types"("job_type");

-- CreateIndex
CREATE INDEX "caster_job_skills_job_type_id_idx" ON "caster_job_skills"("job_type_id");

-- CreateIndex
CREATE INDEX "caster_job_skills_category_idx" ON "caster_job_skills"("category");

-- AddForeignKey
ALTER TABLE "caster_job_types" ADD CONSTRAINT "caster_job_types_caster_profile_id_fkey" FOREIGN KEY ("caster_profile_id") REFERENCES "caster_profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caster_job_skills" ADD CONSTRAINT "caster_job_skills_job_type_id_fkey" FOREIGN KEY ("job_type_id") REFERENCES "caster_job_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

