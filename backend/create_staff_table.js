require("dotenv").config();

const { query, pool } = require("./db");

async function main() {
  await query(`
    CREATE TABLE IF NOT EXISTS staff (
      id UUID PRIMARY KEY,
      business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
      name VARCHAR(160) NOT NULL,
      phone VARCHAR(40),
      role VARCHAR(50) NOT NULL DEFAULT 'staff',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX IF NOT EXISTS idx_staff_business_active
    ON staff(business_id, active);
  `);

  console.log("staff migration complete");

  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});