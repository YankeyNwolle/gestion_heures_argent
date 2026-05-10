import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORTDB,
});

pool.on("connect", () => {
  console.log("✅ Connexion à la base de données réussie");
});

pool.on("error", (err) => {
  console.error("❌ Erreur inattendue du pool de connexion PostgreSQL :", err);
  process.exit(-1);
});

export default pool;