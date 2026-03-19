import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { config } from "dotenv";

// prisma.config.ts 評価時に .env を手動ロード
config();

const url = process.env.DATABASE_URL!;

export default defineConfig({
  datasource: {
    url,
    adapter: new PrismaPg({ connectionString: url }),
  },
});
