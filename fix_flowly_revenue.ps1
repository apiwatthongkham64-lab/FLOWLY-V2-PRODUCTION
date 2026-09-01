$ErrorActionPreference = "Stop"

$server = "C:\FLOWLY\backend\server.js"
$backup = "C:\FLOWLY\backend\server.before-revenue-fix-3.js"

if (!(Test-Path $server)) { throw "ไม่พบ $server" }

Copy-Item -Force $server $backup

$s = [System.IO.File]::ReadAllText($server)

$startMarker = 'app.get("/api/v1/dashboard/revenue", auth, async (req, res) => {'
$endMarker = '/* Dashboard summary'

$start = $s.IndexOf($startMarker)
$end = $s.IndexOf($endMarker, $start)

if ($start -lt 0) { throw "ไม่พบ start marker ของ revenue endpoint" }
if ($end -lt 0) { throw "ไม่พบ end marker ของ revenue endpoint" }

$newEndpoint = @'
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
              WHEN b.booking_date =
                   (CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Bangkok')::date
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


'@

$s = $s.Substring(0, $start) + $newEndpoint + $s.Substring($end)

[System.IO.File]::WriteAllText($server, $s, [System.Text.UTF8Encoding]::new($false))

node --check $server

if ($LASTEXITCODE -ne 0) {
    Copy-Item -Force $backup $server
    throw "server.js syntax ไม่ผ่าน จึงกู้ไฟล์เดิมกลับแล้ว"
}

Write-Host "แก้ server.js และตรวจ syntax ผ่านแล้ว"
Write-Host "Backup: $backup"
