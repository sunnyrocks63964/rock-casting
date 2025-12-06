-- AlterTable
ALTER TABLE "users" ADD COLUMN     "organization_id" UUID;

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL,
    "company_name" TEXT,
    "industry" TEXT,
    "company_overview" TEXT,
    "website_url" TEXT,
    "desired_work_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "desired_occupations" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "users_organization_id_idx" ON "users"("organization_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
