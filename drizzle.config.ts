import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./shared/schema.ts", // ajuste se estiver em outra pasta
  out: "./migrations",
  dialect: "sqlite",
  dbCredentials: {
    url: "file:./banco.db",
  },
});