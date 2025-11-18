import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

// .env.localファイルから環境変数を読み込む
config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
