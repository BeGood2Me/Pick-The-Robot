# IndexNow submit helper (PowerShell)
# 1) Deploy so https://picktherobot.com/<key>.txt is live
# 2) Run:  powershell -File scripts/indexnow.ps1

$key = "6662e166-5a66-4ac6-abc7-7fcc9a30b510"
$hostName = "picktherobot.com"
$urls = @(
  "https://picktherobot.com/blog/restaurant-serving-robot-cost",
  "https://picktherobot.com/restaurant-robot-vs-runner",
  "https://picktherobot.com/best/amr/ecommerce-warehouse",
  "https://picktherobot.com/robot-leasing-vs-buying",
  "https://picktherobot.com/robotics-as-a-service",
  "https://picktherobot.com/amr-vs-agv",
  "https://picktherobot.com/warehouse-robot-cost",
  "https://picktherobot.com/blog/warehouse-robot-cost-2026"
)

$bodyObj = @{
  host        = $hostName
  key         = $key
  keyLocation = "https://$hostName/$key.txt"
  urlList     = $urls
}
$body = $bodyObj | ConvertTo-Json -Depth 5

Write-Host "Submitting $($urls.Count) URLs to IndexNow..."
Invoke-RestMethod -Method Post -Uri "https://api.indexnow.org/indexnow" `
  -ContentType "application/json; charset=utf-8" `
  -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
Write-Host "Done (HTTP 200 = accepted)."
