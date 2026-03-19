import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

export default defineConfig({
  datasource: {
    // url: CLIコマンド（db push / migrate）用
    url: process.env.DATABASE_URL!,
    // adapter: ランタイム（PrismaClient）用
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    }),
  },
});
