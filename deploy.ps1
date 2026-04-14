# deploy.ps1 — Build and push site to DreamHost
# Usage: npm run deploy
#   OR:  powershell -ExecutionPolicy Bypass -File deploy.ps1

# Load credentials from .env
$envFile = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envFile)) {
    Write-Error ".env file not found. Create one from .env.example."
    exit 1
}
Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*([^#][^=]+)=(.+)$') {
        [System.Environment]::SetEnvironmentVariable($Matches[1].Trim(), $Matches[2].Trim())
    }
}

$pw      = $env:DEPLOY_PASS
$key     = $env:DEPLOY_HOSTKEY
$remote  = "$($env:DEPLOY_USER)@$($env:DEPLOY_HOST)"
$root    = $env:DEPLOY_ROOT
$pscp    = "C:\Program Files\PuTTY\pscp.exe"

function Upload($local, $remotePath) {
    Write-Host "Uploading $local ..." -NoNewline
    & $pscp -batch -pw $pw -hostkey $key $local "${remote}:${root}/${remotePath}"
    if ($LASTEXITCODE -eq 0) { Write-Host " OK" -ForegroundColor Green }
    else                     { Write-Host " FAILED" -ForegroundColor Red; exit 1 }
}

# ── Assets ────────────────────────────────────────────────────────────────────
Upload "assets\dist\js\main.js"   "assets/dist/js/main.js"
Upload "assets\dist\css\main.css" "assets/dist/css/main.css"

# ── Config ────────────────────────────────────────────────────────────────────
Upload ".htaccess" ".htaccess"

# ── HTML pages ────────────────────────────────────────────────────────────────
$htmlFiles = @(
    "contact.html",
    "events.html",
    "index.html",
    "ministries.html",
    "our-beliefs.html",
    "preparedness.html",
    "sermons.html",
    "serve.html",
    "armor\faith.html",
    "armor\preparedness.html",
    "armor\righteousness.html",
    "armor\salvation.html",
    "armor\truth.html",
    "armor\word.html",
    "ministries\awana.html",
    "ministries\relevant-belief.html",
    "ministries\youth.html",
    "resources\bible-study.html",
    "resources\souls-training-ground.html",
    "resources\souls-training-ground\index.html"
)

foreach ($f in $htmlFiles) {
    Upload $f ($f.Replace("\", "/"))
}

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Cyan
