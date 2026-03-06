import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "bitespeed",
  password: "Sharan@2003",
  port: 5433
});

export default pool;