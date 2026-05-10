import pool from "../src/config/database.js";

async function migrate() {
  try {
    await pool.query("ALTER TYPE teacher_grade ADD VALUE IF NOT EXISTS 'autres'");
    console.log("Migration successful: added 'autres' to teacher_grade enum");
    process.exit(0);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exit(1);
  }
}

migrate();
