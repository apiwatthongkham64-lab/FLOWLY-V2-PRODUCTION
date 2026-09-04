require("dotenv").config();

const bcrypt = require("bcryptjs");
const { query, pool } = require("./db");

async function main(){

  const email = "owner@flowly.local";
  const newPassword = "Flowly@12345";

  const hash = await bcrypt.hash(newPassword,10);

  await query(
    `
    UPDATE users
    SET password_hash=$1,
        updated_at=NOW()
    WHERE email=$2
    `,
    [hash,email]
  );

  console.log("RESET COMPLETE");
  console.log("EMAIL:",email);
  console.log("PASSWORD:",newPassword);

  await pool.end();
}

main().catch(err=>{
 console.error(err);
 process.exit(1);
});