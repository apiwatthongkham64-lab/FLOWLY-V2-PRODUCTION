$ErrorActionPreference = "Stop"

$server = "C:\FLOWLY\backend\server.js"
$dashboard = "C:\FLOWLY\dashboard.html"

$serverBackup = "C:\FLOWLY\backend\server.before-revenue-fix-5.js"
$dashboardBackup = "C:\FLOWLY\dashboard.before-revenue-fix-5.html"

if (!(Test-Path $server)) { throw "server.js not found" }
if (!(Test-Path $dashboard)) { throw "dashboard.html not found" }

Copy-Item -Force $server $serverBackup
Copy-Item -Force $dashboard $dashboardBackup

try {
    # ---------- BACKEND ----------
    $s = [System.IO.File]::ReadAllText($server)

    $startMarker = 'app.get("/api/v1/dashboard/revenue", auth, async (req, res) => {'
    $endMarker = '/* Dashboard summary'

    $start = $s.IndexOf($startMarker)
    $end = $s.IndexOf($endMarker, $start)

    if ($start -lt 0) { throw "Revenue endpoint start marker not found" }
    if ($end -lt 0) { throw "Revenue endpoint end marker not found" }

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

    # ---------- FRONTEND ----------
    $d = [System.IO.File]::ReadAllText($dashboard)

    # Replace ONLY the assignment for today's revenue, regardless of spacing/line endings.
    $pattern = '(?m)(\$\("todayRevenue"\)\.textContent\s*=\s*)money\(revenue\.confirmed_revenue\);'
    $replacement = '${1}money(revenue.today_revenue);'

    $newD = [regex]::Replace($d, $pattern, $replacement)

    if ($newD -eq $d) {
        throw "todayRevenue assignment was not found"
    }

    [System.IO.File]::WriteAllText($dashboard, $newD, [System.Text.UTF8Encoding]::new($false))

    # ---------- VALIDATE ----------
    Push-Location "C:\FLOWLY\backend"
    node --check server.js
    $nodeExit = $LASTEXITCODE
    Pop-Location

    if ($nodeExit -ne 0) {
        throw "server.js syntax check failed"
    }

    Write-Host ""
    Write-Host "SUCCESS"
    Write-Host "Revenue endpoint fixed."
    Write-Host "Today's Revenue now uses today_revenue."
    Write-Host ""
    Write-Host "Server backup: $serverBackup"
    Write-Host "Dashboard backup: $dashboardBackup"
    Write-Host ""
    Write-Host "Restart node server.js before testing."
}
catch {
    Copy-Item -Force $serverBackup $server
    Copy-Item -Force $dashboardBackup $dashboard
    Write-Host ""
    Write-Host "FAILED - original files restored."
    Write-Host $_.Exception.Message
    Write-Host ""
    exit 1
}
