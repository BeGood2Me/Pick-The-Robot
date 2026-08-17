# Local API smoke test (PowerShell)
# Run: npm run dev
# Then: powershell -File scripts/test-api.ps1

$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$base = if ($env:API_BASE_URL) { $env:API_BASE_URL } else { "http://localhost:3005" }
$sample = Join-Path $PSScriptRoot "api-samples/match-cleaning.json"

Write-Host "GET $base/api/v1/vendors?category=cleaning&region=US"
curl.exe -s "$base/api/v1/vendors?category=cleaning&region=US" | ConvertFrom-Json | ConvertTo-Json -Depth 6
Write-Host ""

Write-Host "GET $base/api/v1/openapi.json (title only)"
$openapi = Invoke-RestMethod -Uri "$base/api/v1/openapi.json"
Write-Host $openapi.info.title $openapi.info.version
Write-Host ""

Write-Host "POST $base/api/v1/match"
curl.exe -s -X POST "$base/api/v1/match" -H "Content-Type: application/json" --data-binary "@$sample"
