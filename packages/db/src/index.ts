import { drizzle } from "drizzle-orm/postgres-js";
import { env } from "@invoicely/utilities";
import * as schema from "./schema";
import postgres from "postgres";

const sql = postgres(env.DATABASE_URL);
const db = drizzle(sql, { schema });

export { db, sql, schema };
