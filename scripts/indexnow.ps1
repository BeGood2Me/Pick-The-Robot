# IndexNow submit helper (PowerShell)
# 1) Deploy so https://picktherobot.com/<key>.txt is live
# 2) Run:  powershell -File scripts/indexnow.ps1

$key = "6662e166-5a66-4ac6-abc7-7fcc9a30b510"
$hostName = "picktherobot.com"
$urls = @(
  "https://picktherobot.com/best/amr/ecommerce-warehouse",
  "https://picktherobot.com/integrations/locus-robotics/sap-ewm",
  "https://picktherobot.com/robot-leasing-vs-buying",
  "https://picktherobot.com/restaurant-robots",
  "https://picktherobot.com/cleaning-robots-as-a-service",
  "https://picktherobot.com/raas-pricing",
  "https://picktherobot.com/vendors/mir-mobile-industrial-robots"
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
