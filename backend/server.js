require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const { pool, query } = require("./db");
const {
  hashPassword,
  verifyPassword,
  signSession,
  verifySession
} = require("./auth");

const app = express();
app.use((req,res,next)=>{

  res.header(
    "Access-Control-Allow-Origin",
    "https://flowly-landing-v1.apiwatthongkham64.workers.dev"
  );

  res.header(
    "Access-Control-Allow-Credentials",
    "true"
  );

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,DELETE,OPTIONS"
  );

  if(req.method==="OPTIONS"){
    return res.sendStatus(200);
  }

  next();

});

app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(express.static(path.resolve(__dirname, "..")));

const COOKIE = "flowly_session";

const ok = data => ({
  data,
  error: null
});

const fail = (code, message) => ({
  data: null,
  error: {
    code,
    message
  }
});

const setSession = (res, payload) =>
  res.cookie(
    COOKIE,
    signSession(payload),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production"
          ? "none"
          : "lax",
      maxAge: 28800000,
      path: "/"
    }
  );

function auth(req, res, next) {
  const token = req.cookies[COOKIE];

  if (!token) {
    return res
      .status(401)
      .json(fail("UNAUTHORIZED", "Login required"));
  }

  try {
    req.user = verifySession(token);
    next();
  } catch {
    return res
      .status(401)
      .json(fail("UNAUTHORIZED", "Invalid or expired session"));
  }
}


/* =========================================================
   DASHBOARD
   ========================================================= */

/* Today's bookings เนโฌโ€ เน€เธยเน€เธยเน€เธยเน€เธเธเน€เธเธ‘เน€เธยเน€เธโ€”เน€เธเธ•เน€เธยเน€เธยเน€เธเธเน€เธเธเน€เธโฌเน€เธโ€”เน€เธเธเน€เธยเน€เธโ€”เน€เธเธเน€เธยเน€เธโ€เน€เธเธเน€เธโ€ขเน€เธเธเน€เธย */
app.get("/api/v1/dashboard/today", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        b.id,
        b.customer_id,
        b.service_id,
        b.booking_date,
        b.booking_time,
        b.status,
        c.name AS customer_name,
        c.phone AS customer_phone,
        s.name AS service_name,
        s.duration_minutes,
        s.price
      FROM bookings b
      JOIN customers c
        ON c.id = b.customer_id
       AND c.business_id = b.business_id
      JOIN services s
        ON s.id = b.service_id
       AND s.business_id = b.business_id
      WHERE b.business_id = $1
        AND b.booking_date =
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
      ORDER BY b.booking_time ASC
      `,
      [req.user.businessId]
    );

    res.json(ok(r.rows));
  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to load today's bookings"
        )
      );
  }
});


/* Revenue trend เนโฌโ€ 30 เน€เธเธเน€เธเธ‘เน€เธยเน€เธเธ…เน€เธยเน€เธเธ’เน€เธเธเน€เธเธเน€เธโ€ เน€เธโ€ขเน€เธเธ’เน€เธเธเน€เธเธเน€เธเธ‘เน€เธยเน€เธโ€”เน€เธเธ•เน€เธยเน€เธยเน€เธเธเน€เธเธเน€เธโฌเน€เธโ€”เน€เธเธเน€เธยเน€เธโ€”เน€เธเธ */
app.get("/api/v1/dashboard/revenue/trend", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        TO_CHAR(b.booking_date, 'YYYY-MM-DD') AS date,
        COALESCE(SUM(s.price), 0)::numeric(14,2) AS revenue,
        COUNT(*)::int AS completed_bookings
      FROM bookings b
      JOIN services s
        ON s.id = b.service_id
       AND s.business_id = b.business_id
      WHERE b.business_id = $1
        AND b.status IN ('confirmed', 'completed')
        AND b.booking_date >=
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
            - INTERVAL '30 days'
        AND b.booking_date <
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
            + INTERVAL '1 day'
      GROUP BY b.booking_date
      ORDER BY b.booking_date
      `,
      [req.user.businessId]
    );

    res.json(ok(r.rows));
  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to load revenue trend"
        )
      );
  }
});


/* Revenue summary เนโฌโ€ 30 เน€เธเธเน€เธเธ‘เน€เธยเน€เธเธ…เน€เธยเน€เธเธ’เน€เธเธเน€เธเธเน€เธโ€ เน€เธโ€ขเน€เธเธ’เน€เธเธเน€เธเธเน€เธเธ‘เน€เธยเน€เธโ€”เน€เธเธ•เน€เธยเน€เธยเน€เธเธเน€เธเธเน€เธโฌเน€เธโ€”เน€เธเธเน€เธยเน€เธโ€”เน€เธเธ */
app.get("/api/v1/dashboard/revenue", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        COALESCE(
          SUM(
            CASE
              WHEN status IN ('confirmed', 'completed')
              THEN s.price
              ELSE 0
            END
          ),
          0
        )::numeric(14,2) AS confirmed_revenue,

        COALESCE(
          SUM(
            CASE
              WHEN status = 'completed'
              THEN s.price
              ELSE 0
            END
          ),
          0
        )::numeric(14,2) AS completed_revenue,

        COALESCE(
          SUM(
            CASE
              WHEN b.booking_date::date = (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
               AND status IN ('confirmed', 'completed')
              THEN s.price
              ELSE 0
            END
          ),
          0
        )::numeric(14,2) AS today_revenue,

        COUNT(*) FILTER (
          WHERE status IN ('confirmed', 'completed')
        )::int AS paid_or_confirmed_bookings,

        COUNT(*) FILTER (
          WHERE status = 'completed'
        )::int AS completed_bookings

      FROM bookings b
      JOIN services s
        ON s.id = b.service_id
       AND s.business_id = b.business_id

      WHERE b.business_id = $1
        AND b.booking_date >=
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
            - INTERVAL '30 days'
        AND b.booking_date <
            (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
            + INTERVAL '1 day'
      `,
      [req.user.businessId]
    );

    res.json(ok(r.rows[0]));
  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to load revenue summary"
        )
      );
  }
});

/* Dashboard summary เนโฌโ€ เน€เธเธเน€เธเธ‘เน€เธยเน€เธโ€”เน€เธเธ•เน€เธยเน€เธยเน€เธโ€”เน€เธเธ */
app.get("/api/v1/dashboard/summary", auth, async (req, res) => {
  try {
    const businessId = req.user.businessId;

    const r = await query(
      `
      SELECT

        (
          SELECT COUNT(*)::int
          FROM customers
          WHERE business_id = $1
        ) AS customers,

        (
          SELECT COUNT(*)::int
          FROM services
          WHERE business_id = $1
            AND active = true
        ) AS active_services,

        (
          SELECT COUNT(*)::int
          FROM bookings
          WHERE business_id = $1
            AND booking_date =
                (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
            AND status IN ('pending', 'confirmed')
        ) AS today_bookings,

        (
          SELECT COUNT(*)::int
          FROM bookings
          WHERE business_id = $1
            AND booking_date >=
                (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
            AND booking_date <
                (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
                + INTERVAL '7 days'
            AND status IN ('pending', 'confirmed')
        ) AS upcoming_bookings

      `,
      [businessId]
    );

    res.json(ok(r.rows[0]));
  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to load dashboard summary"
        )
      );
  }
});


/* =========================================================
   HEALTH
   ========================================================= */

app.get("/api/v1/health", async (req, res) => {
  try {
    await query("SELECT 1");

    res.json(
      ok({
        status: "ok",
        database: "reachable"
      })
    );
  } catch {
    res
      .status(503)
      .json(
        fail(
          "DATABASE_UNAVAILABLE",
          "Database is not reachable"
        )
      );
  }
});


/* =========================================================
   AUTH
   ========================================================= */

app.post("/api/v1/auth/register", async (req, res) => {
  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const password =
    typeof req.body?.password === "string"
      ? req.body.password
      : "";

  const businessName =
    typeof req.body?.businessName === "string"
      ? req.body.businessName.trim()
      : "";

  if (
    !name ||
    !email ||
    !businessName ||
    password.length < 8
  ) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "name, email, businessName and password (8+ chars) are required"
        )
      );
  }

  try {
    const hash = await hashPassword(password);
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      const b = await client.query(
        `
        INSERT INTO businesses(id, name)
        VALUES(gen_random_uuid(), $1)
        RETURNING id, name
        `,
        [businessName]
      );

      const exists = await client.query(
        `
        SELECT id
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email]
      );

      if (exists.rows[0]) {
        await client.query("ROLLBACK");

        return res
          .status(409)
          .json(
            fail(
              "EMAIL_EXISTS",
              "Email is already registered"
            )
          );
      }

      const u = await client.query(
        `
        INSERT INTO users(
          id,
          business_id,
          name,
          email,
          password_hash,
          role
        )
        VALUES(
          gen_random_uuid(),
          $1,
          $2,
          $3,
          $4,
          'owner'
        )
        RETURNING
          id,
          business_id,
          name,
          email,
          role
        `,
        [
          b.rows[0].id,
          name,
          email,
          hash
        ]
      );

      await client.query("COMMIT");

      setSession(res, {
        userId: u.rows[0].id,
        businessId: u.rows[0].business_id,
        role: "owner"
      });

      return res
        .status(201)
        .json(ok(u.rows[0]));

    } catch (e) {
      try {
        await client.query("ROLLBACK");
      } catch {}

      if (e.code === "23505") {
        return res
          .status(409)
          .json(
            fail(
              "EMAIL_EXISTS",
              "Email is already registered"
            )
          );
      }

      return res
        .status(500)
        .json(
          fail(
            "AUTH_ERROR",
            "Unable to create account"
          )
        );

    } finally {
      client.release();
    }

  } catch {
    return res
      .status(500)
      .json(
        fail(
          "AUTH_ERROR",
          "Unable to process registration"
        )
      );
  }
});


app.post("/api/v1/auth/login", async (req, res) => {
  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  const password =
    typeof req.body?.password === "string"
      ? req.body.password
      : "";

  if (!email || !password) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "email and password are required"
        )
      );
  }

  try {
    const r = await query(
      `
      SELECT
        id,
        business_id,
        name,
        email,
        password_hash,
        role
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email]
    );

    const u = r.rows[0];

    if (
      !u ||
      !(await verifyPassword(password, u.password_hash))
    ) {
      return res
        .status(401)
        .json(
          fail(
            "INVALID_CREDENTIALS",
            "Invalid email or password"
          )
        );
    }

    setSession(res, {
      userId: u.id,
      businessId: u.business_id,
      role: u.role
    });

    res.json(
      ok({
        id: u.id,
        businessId: u.business_id,
        name: u.name,
        email: u.email,
        role: u.role
      })
    );

  } catch {
    res
      .status(500)
      .json(
        fail(
          "AUTH_ERROR",
          "Unable to login"
        )
      );
  }
});

app.post("/api/v1/auth/forgot-password", async (req, res) => {

  const email =
    typeof req.body?.email === "string"
      ? req.body.email.trim().toLowerCase()
      : "";

  if (!email) {
    return res.status(400).json(
      fail(
        "VALIDATION_ERROR",
        "email is required"
      )
    );
  }

  try {
    const r = await query(
      `
      SELECT id
      FROM users
      WHERE email = $1
      LIMIT 1
      `,
      [email]
    );

    const user = r.rows[0];

    if (!user) {
      return res.json(
        ok({
          message: "If email exists, reset token created"
        })
      );
    }

    const token = require("crypto")
      .randomUUID();

    await query(
      `
      INSERT INTO password_reset_tokens
      (
        user_id,
        token,
        expires_at
      )
      VALUES
      (
        $1,
        $2,
        now() + interval '30 minutes'
      )
      `,
      [
        user.id,
        token
      ]
    );

    res.json(
      ok({
        message: "Reset token created",
        token
      })
    );

  } catch {
    res.status(500).json(
      fail(
        "RESET_ERROR",
        "Unable to create reset token"
      )
    );
  }
});

app.post("/api/v1/auth/reset-password", async (req, res) => {

  const token = req.body?.token || "";
  const newPassword = req.body?.newPassword || "";

  if (!token || !newPassword) {
    return res.status(400).json(
      fail(
        "VALIDATION_ERROR",
        "token and newPassword are required"
      )
    );
  }

  if (newPassword.length < 8) {
    return res.status(400).json(
      fail(
        "VALIDATION_ERROR",
        "Password must be at least 8 characters"
      )
    );
  }

  try {

    const r = await query(
      `
      SELECT user_id
      FROM password_reset_tokens
      WHERE token = $1
      AND used_at IS NULL
      AND expires_at > now()
      LIMIT 1
      `,
      [token]
    );

    const reset = r.rows[0];

    if (!reset) {
      return res.status(400).json(
        fail(
          "INVALID_TOKEN",
          "Reset token invalid or expired"
        )
      );
    }

    const hash = await hashPassword(newPassword);

    await query(
      `
      UPDATE users
      SET password_hash = $1,
          updated_at = now()
      WHERE id = $2
      `,
      [
        hash,
        reset.user_id
      ]
    );

    await query(
      `
      UPDATE password_reset_tokens
      SET used_at = now()
      WHERE token = $1
      `,
      [token]
    );

    res.json(
      ok({
        message: "Password reset successfully"
      })
    );

  } catch {
    res.status(500).json(
      fail(
        "RESET_ERROR",
        "Unable to reset password"
      )
    );
  }
});
app.patch("/api/v1/auth/password", auth, async (req, res) => {

  const oldPassword = req.body?.oldPassword || "";
  const newPassword = req.body?.newPassword || "";

  if (!oldPassword || !newPassword) {
    return res.status(400).json(
      fail(
        "VALIDATION_ERROR",
        "oldPassword and newPassword are required"
      )
    );
  }

  if (newPassword.length < 8) {
    return res.status(400).json(
      fail(
        "VALIDATION_ERROR",
        "Password must be at least 8 characters"
      )
    );
  }

  try {

    const r = await query(
      `
      SELECT password_hash
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.userId]
    );

    const user = r.rows[0];

    if (
      !user ||
      !(await verifyPassword(oldPassword, user.password_hash))
    ) {
      return res.status(401).json(
        fail(
          "INVALID_PASSWORD",
          "Current password is incorrect"
        )
      );
    }

    const hash = await hashPassword(newPassword);

    await query(
      `
      UPDATE users
      SET password_hash = $1
      WHERE id = $2
      `,
      [
        hash,
        req.user.userId
      ]
    );

    res.json(
      ok({
        message: "Password updated successfully"
      })
    );

  } catch (error) {

    console.error(error);

    res.status(500).json(
      fail(
        "AUTH_ERROR",
        "Unable to update password"
      )
    );
  }

});

app.get("/api/v1/auth/me", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        id,
        business_id,
        name,
        email,
        role
      FROM users
      WHERE id = $1
      LIMIT 1
      `,
      [req.user.userId]
    );

    const u = r.rows[0];

    if (!u) {
      return res
        .status(404)
        .json(
          fail(
            "USER_NOT_FOUND",
            "User not found"
          )
        );
    }

    res.json(
      ok({
        id: u.id,
        businessId: u.business_id,
        name: u.name,
        email: u.email,
        role: u.role
      })
    );

  } catch {
    res
      .status(500)
      .json(
        fail(
          "AUTH_ERROR",
          "Unable to load profile"
        )
      );
  }
});
app.get("/api/v1/business/profile", auth, async (req, res) => {

  try {

    const r = await query(
      `
      SELECT
        id,
        name,
        phone,
        created_at
      FROM businesses
      WHERE id = $1
      LIMIT 1
      `,
      [
        req.user.businessId
      ]
    );

    const business = r.rows[0];

    if (!business) {
      return res.status(404).json(
        fail(
          "NOT_FOUND",
          "Business not found"
        )
      );
    }

    res.json(
      ok({
        id: business.id,
        name: business.name,
        phone: business.phone,
        createdAt: business.created_at
      })
    );

  } catch {

    res.status(500).json(
      fail(
        "BUSINESS_ERROR",
        "Unable to load business profile"
      )
    );

  }

});
app.post("/api/v1/auth/logout", (req, res) => {
  res.clearCookie(
    COOKIE,
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/"
    }
  );

  res.json(
    ok({
      loggedOut: true
    })
  );
});


app.get("/api/v1/me", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        id,
        business_id,
        name,
        email,
        role
      FROM users
      WHERE id = $1
        AND business_id = $2
      `,
      [
        req.user.userId,
        req.user.businessId
      ]
    );

    if (!r.rows[0]) {
      return res
        .status(401)
        .json(
          fail(
            "UNAUTHORIZED",
            "Session user not found"
          )
        );
    }

    res.json(ok(r.rows[0]));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to read session user"
        )
      );
  }
});


/* =========================================================
   SERVICES
   ========================================================= */

app.get("/api/v1/services", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        id,
        name,
        duration_minutes,
        price,
        active,
        created_at,
        updated_at
      FROM services
      WHERE business_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.businessId]
    );

    res.json(ok(r.rows));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to read services"
        )
      );
  }
});


app.post("/api/v1/services", auth, async (req, res) => {
  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

  const duration =
    Number(req.body?.duration_minutes);

  const price =
    Number(req.body?.price);

  if (
    !name ||
    !Number.isInteger(duration) ||
    duration <= 0 ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "name, positive duration and non-negative price are required"
        )
      );
  }

  try {
    const r = await query(
      `
      INSERT INTO services(
        id,
        business_id,
        name,
        duration_minutes,
        price,
        active
      )
      VALUES(
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        true
      )
      RETURNING
        id,
        name,
        duration_minutes,
        price,
        active,
        created_at,
        updated_at
      `,
      [
        req.user.businessId,
        name,
        duration,
        price
      ]
    );

    res
      .status(201)
      .json(ok(r.rows[0]));

  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(409)
        .json(
          fail(
            "SERVICE_EXISTS",
            "Service name already exists"
          )
        );
    }

    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to create service"
        )
      );
  }
});


app.put("/api/v1/services/:id", auth, async (req, res) => {
  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

  const duration =
    Number(req.body?.duration_minutes);

  const price =
    Number(req.body?.price);

  const active =
    typeof req.body?.active === "boolean"
      ? req.body.active
      : true;

  if (
    !name ||
    !Number.isInteger(duration) ||
    duration <= 0 ||
    !Number.isFinite(price) ||
    price < 0
  ) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "name, positive duration and non-negative price are required"
        )
      );
  }

  try {
    const r = await query(
      `
      UPDATE services
      SET
        name = $1,
        duration_minutes = $2,
        price = $3,
        active = $4,
        updated_at = NOW()
      WHERE id = $5
        AND business_id = $6
      RETURNING
        id,
        name,
        duration_minutes,
        price,
        active,
        created_at,
        updated_at
      `,
      [
        name,
        duration,
        price,
        active,
        req.params.id,
        req.user.businessId
      ]
    );

    if (!r.rows[0]) {
      return res
        .status(404)
        .json(
          fail(
            "NOT_FOUND",
            "Service not found"
          )
        );
    }

    res.json(ok(r.rows[0]));

  } catch (e) {
    if (e.code === "23505") {
      return res
        .status(409)
        .json(
          fail(
            "SERVICE_EXISTS",
            "Service name already exists"
          )
        );
    }

    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to update service"
        )
      );
  }
});


app.delete("/api/v1/services/:id", auth, async (req, res) => {
  try {
    const used = await query(
      `
      SELECT 1
      FROM bookings
      WHERE service_id = $1
        AND business_id = $2
      LIMIT 1
      `,
      [
        req.params.id,
        req.user.businessId
      ]
    );

    if (used.rows[0]) {
      return res
        .status(409)
        .json(
          fail(
            "SERVICE_HAS_BOOKINGS",
            "Service cannot be deleted while bookings exist"
          )
        );
    }

    const r = await query(
      `
      DELETE FROM services
      WHERE id = $1
        AND business_id = $2
      RETURNING id
      `,
      [
        req.params.id,
        req.user.businessId
      ]
    );

    if (!r.rows[0]) {
      return res
        .status(404)
        .json(
          fail(
            "NOT_FOUND",
            "Service not found"
          )
        );
    }

    res.status(204).end();

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to delete service"
        )
      );
  }
});


/* =========================================================
   BOOKINGS
   ========================================================= */

app.patch("/api/v1/bookings/:id/status", auth, async (req, res) => {
  const next =
    typeof req.body?.status === "string"
      ? req.body.status
      : "";

  const allowed = [
    "pending",
    "confirmed",
    "completed",
    "cancelled"
  ];

  if (!allowed.includes(next)) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "Invalid booking status"
        )
      );
  }

  try {
    const current = await query(
      `
      SELECT status
      FROM bookings
      WHERE id = $1
        AND business_id = $2
      `,
      [
        req.params.id,
        req.user.businessId
      ]
    );

    if (!current.rows[0]) {
      return res
        .status(404)
        .json(
          fail(
            "NOT_FOUND",
            "Booking not found"
          )
        );
    }

    const prev = current.rows[0].status;

    const transitions = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: []
    };

    if (
      prev === next ||
      !transitions[prev].includes(next)
    ) {
      return res
        .status(409)
        .json(
          fail(
            "INVALID_STATUS_TRANSITION",
            `Cannot change booking from ${prev} to ${next}`
          )
        );
    }

    const r = await query(
      `
      UPDATE bookings
      SET
        status = $1,
        updated_at = NOW()
      WHERE id = $2
        AND business_id = $3
      RETURNING
        id,
        customer_id,
        service_id,
        booking_date,
        booking_time,
        status,
        created_at,
        updated_at
      `,
      [
        next,
        req.params.id,
        req.user.businessId
      ]
    );

    res.json(ok(r.rows[0]));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to update booking status"
        )
      );
  }
});


app.get("/api/v1/bookings", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        b.id,
        b.customer_id,
        b.service_id,
        b.staff_id,
        TO_CHAR(b.booking_date, 'YYYY-MM-DD') AS booking_date,
        TO_CHAR(b.booking_time, 'HH24:MI') AS booking_time,
        b.status,
        c.name AS customer_name,
        s.name AS service_name,
        st.name AS staff_name,
        s.duration_minutes,
        s.price
      FROM bookings b
      JOIN customers c
        ON c.id = b.customer_id
       AND c.business_id = b.business_id
      JOIN services s
        ON s.id = b.service_id
       AND s.business_id = b.business_id
      LEFT JOIN staff st
        ON st.id = b.staff_id
       AND st.business_id = b.business_id
      WHERE b.business_id = $1
      ORDER BY
        b.booking_date DESC,
        b.booking_time DESC
      `,
      [req.user.businessId]
    );

    res.json(ok(r.rows));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to read bookings"
        )
      );
  }
});


app.post("/api/v1/bookings", auth, async (req, res) => {
  const customerId =
    typeof req.body?.customer_id === "string"
      ? req.body.customer_id
      : "";

  const serviceId =
    typeof req.body?.service_id === "string"
      ? req.body.service_id
      : "";

  const staffId =
    typeof req.body?.staff_id === "string" &&
    req.body.staff_id.trim()
      ? req.body.staff_id.trim()
      : null;

  const uuidPattern =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (staffId && !uuidPattern.test(staffId)) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "staff_id must be a valid UUID"
        )
      );
  }

  const date =
    typeof req.body?.booking_date === "string"
      ? req.body.booking_date
      : "";

  const time =
    typeof req.body?.booking_time === "string"
      ? req.body.booking_time
      : "";

  if (
    !customerId ||
    !serviceId ||
    !date ||
    !time
  ) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "customer_id, service_id, booking_date and booking_time are required"
        )
      );
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    /*
      Serialize booking creation per business
      so two simultaneous requests cannot both
      pass the overlap check.
    */
    await client.query(
      `
      SELECT pg_advisory_xact_lock(
        hashtextextended($1, 0)
      )
      `,
      [req.user.businessId]
    );

    const refs = await client.query(
      `
      SELECT
        EXISTS(
          SELECT 1
          FROM customers
          WHERE id = $1
            AND business_id = $3
        ) AS customer_ok,

        EXISTS(
          SELECT 1
          FROM services
          WHERE id = $2
            AND business_id = $3
            AND active = true
        ) AS service_ok,

        (
          $4::uuid IS NULL
          OR EXISTS(
            SELECT 1
            FROM staff
            WHERE id = $4
              AND business_id = $3
              AND active = true
          )
        ) AS staff_ok
      `,
      [
        customerId,
        serviceId,
        req.user.businessId,
        staffId
      ]
    );

    if (!refs.rows[0].customer_ok) {
      await client.query("ROLLBACK");

      return res
        .status(404)
        .json(
          fail(
            "CUSTOMER_NOT_FOUND",
            "Customer not found"
          )
        );
    }

    if (!refs.rows[0].service_ok) {
      await client.query("ROLLBACK");

      return res
        .status(404)
        .json(
          fail(
            "SERVICE_NOT_FOUND",
            "Active service not found"
          )
        );
    }

    if (!refs.rows[0].staff_ok) {
      await client.query("ROLLBACK");

      return res
        .status(404)
        .json(
          fail(
            "STAFF_NOT_FOUND",
            "Active staff not found"
          )
        );
    }

    const conflict = await client.query(
      `
      SELECT 1
      FROM bookings b

      JOIN services existing_s
        ON existing_s.id = b.service_id
       AND existing_s.business_id = b.business_id

      JOIN services new_s
        ON new_s.id = $4
       AND new_s.business_id = $1

      WHERE b.business_id = $1
        AND b.booking_date = $2
        AND b.status IN ('pending', 'confirmed')

        AND $3::time <
            (
              b.booking_time
              + (
                  existing_s.duration_minutes
                  * INTERVAL '1 minute'
                )
            )

        AND b.booking_time <
            (
              $3::time
              + (
                  new_s.duration_minutes
                  * INTERVAL '1 minute'
                )
            )

        AND (
          $5::uuid IS NULL
          OR b.staff_id = $5
          OR b.staff_id IS NULL
        )

      LIMIT 1
      `,
      [
        req.user.businessId,
        date,
        time,
        serviceId,
        staffId
      ]
    );

    if (conflict.rows[0]) {
      await client.query("ROLLBACK");

      return res
        .status(409)
        .json(
          fail(
            "BOOKING_CONFLICT",
            "This time slot is already booked"
          )
        );
    }

    const r = await client.query(
      `
      INSERT INTO bookings(
        id,
        business_id,
        customer_id,
        service_id,
        staff_id,
        booking_date,
        booking_time,
        status
      )
      VALUES(
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        'pending'
      )
      RETURNING
        id,
        customer_id,
        service_id,
        staff_id,
        booking_date,
        booking_time,
        status,
        created_at,
        updated_at
      `,
      [
        req.user.businessId,
        customerId,
        serviceId,
        staffId,
        date,
        time
      ]
    );

    await client.query("COMMIT");

    res
      .status(201)
      .json(ok(r.rows[0]));

  } catch (e) {
    try {
      await client.query("ROLLBACK");
    } catch {}

    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to create booking"
        )
      );

  } finally {
    client.release();
  }
});


/* =========================================================
   CUSTOMERS
   ========================================================= */

app.get("/api/v1/customers", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        id,
        name,
        phone,
        created_at,
        updated_at
      FROM customers
      WHERE business_id = $1
      ORDER BY created_at DESC
      `,
      [req.user.businessId]
    );

    res.json(ok(r.rows));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to read customers"
        )
      );
  }
});


app.post("/api/v1/customers", auth, async (req, res) => {
  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

  const phone =
    typeof req.body?.phone === "string"
      ? req.body.phone.trim()
      : "";

  if (!name) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "name is required"
        )
      );
  }

  try {
    const r = await query(
      `
      INSERT INTO customers(
        id,
        business_id,
        name,
        phone
      )
      VALUES(
        gen_random_uuid(),
        $1,
        $2,
        $3
      )
      RETURNING
        id,
        name,
        phone,
        created_at,
        updated_at
      `,
      [
        req.user.businessId,
        name,
        phone || null
      ]
    );

    res
      .status(201)
      .json(ok(r.rows[0]));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to create customer"
        )
      );
  }
});


app.get("/api/v1/customers/:id", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        id,
        name,
        phone,
        created_at,
        updated_at
      FROM customers
      WHERE id = $1
        AND business_id = $2
      `,
      [
        req.params.id,
        req.user.businessId
      ]
    );

    if (!r.rows[0]) {
      return res
        .status(404)
        .json(
          fail(
            "NOT_FOUND",
            "Customer not found"
          )
        );
    }

    res.json(ok(r.rows[0]));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to read customer"
        )
      );
  }
});


app.put("/api/v1/customers/:id", auth, async (req, res) => {
  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

  const phone =
    typeof req.body?.phone === "string"
      ? req.body.phone.trim()
      : "";

  if (!name) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "name is required"
        )
      );
  }

  try {
    const r = await query(
      `
      UPDATE customers
      SET
        name = $1,
        phone = $2,
        updated_at = NOW()
      WHERE id = $3
        AND business_id = $4
      RETURNING
        id,
        name,
        phone,
        created_at,
        updated_at
      `,
      [
        name,
        phone || null,
        req.params.id,
        req.user.businessId
      ]
    );

    if (!r.rows[0]) {
      return res
        .status(404)
        .json(
          fail(
            "NOT_FOUND",
            "Customer not found"
          )
        );
    }

    res.json(ok(r.rows[0]));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to update customer"
        )
      );
  }
});


app.delete("/api/v1/customers/:id", auth, async (req, res) => {
  try {
    const c = await query(
      `
      SELECT 1
      FROM bookings
      WHERE customer_id = $1
        AND business_id = $2
      LIMIT 1
      `,
      [
        req.params.id,
        req.user.businessId
      ]
    );

    if (c.rows[0]) {
      return res
        .status(409)
        .json(
          fail(
            "CUSTOMER_HAS_BOOKINGS",
            "Customer cannot be deleted while bookings exist"
          )
        );
    }

    const r = await query(
      `
      DELETE FROM customers
      WHERE id = $1
        AND business_id = $2
      RETURNING id
      `,
      [
        req.params.id,
        req.user.businessId
      ]
    );

    if (!r.rows[0]) {
      return res
        .status(404)
        .json(
          fail(
            "NOT_FOUND",
            "Customer not found"
          )
        );
    }

    res.status(204).end();

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to delete customer"
        )
      );
  }
});


app.get(
  "/api/v1/customers/:id/bookings",
  auth,
  async (req, res) => {
    try {
      const r = await query(
        `
        SELECT
          id,
          service_id,
          booking_date,
          booking_time,
          status,
          created_at,
          updated_at
        FROM bookings
        WHERE customer_id = $1
          AND business_id = $2
        ORDER BY
          booking_date DESC,
          booking_time DESC
        `,
        [
          req.params.id,
          req.user.businessId
        ]
      );

      res.json(ok(r.rows));

    } catch {
      res
        .status(500)
        .json(
          fail(
            "DATABASE_ERROR",
            "Unable to read booking history"
          )
        );
    }
  }
);

/* =========================================================
   STAFF
   ========================================================= */

app.get("/api/v1/staff", auth, async (req, res) => {
  try {
    const r = await query(
      `
      SELECT
        id,
        name,
        phone,
        role,
        active,
        created_at,
        updated_at
      FROM staff
      WHERE business_id = $1
      ORDER BY created_at DESC
      `,
      [
        req.user.businessId
      ]
    );

    res.json(ok(r.rows));

  } catch (err) {
    console.error(err);

    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          err.message
        )
      );
  }
});


app.post("/api/v1/staff", auth, async (req, res) => {
  const name =
    typeof req.body?.name === "string"
      ? req.body.name.trim()
      : "";

  const phone =
    typeof req.body?.phone === "string"
      ? req.body.phone.trim()
      : "";

  const role =
    typeof req.body?.role === "string"
      ? req.body.role.trim()
      : "staff";


  if (!name) {
    return res
      .status(400)
      .json(
        fail(
          "VALIDATION_ERROR",
          "name is required"
        )
      );
  }


  try {
    const r = await query(
      `
      INSERT INTO staff(
        id,
        business_id,
        name,
        phone,
        role
      )
      VALUES(
        gen_random_uuid(),
        $1,
        $2,
        $3,
        $4
      )
      RETURNING
        id,
        name,
        phone,
        role,
        active,
        created_at,
        updated_at
      `,
      [
        req.user.businessId,
        name,
        phone || null,
        role || "staff"
      ]
    );


    res
      .status(201)
      .json(ok(r.rows[0]));

  } catch {
    res
      .status(500)
      .json(
        fail(
          "DATABASE_ERROR",
          "Unable to create staff"
        )
      );
  }
});
/* =========================================================
   404
   ========================================================= */

app.use((req, res) => {
  res
    .status(404)
    .json(
      fail(
        "NOT_FOUND",
        "Endpoint not found"
      )
    );
});


/* =========================================================
   SERVER
   ========================================================= */

app.listen(
  process.env.PORT || 3000,
  () =>
    console.log(
      "FLOWLY API listening on port",
      process.env.PORT || 3000
    )
);

