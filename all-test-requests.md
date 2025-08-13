# ============================
# Holy Move — тестовые запросы API
# ============================

# --- 1. Клиент ---
Write-Host "`n=== 1. Клиент ===" -ForegroundColor Cyan
$t = (Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/auth/login' `
    -ContentType 'application/json' `
    -Body '{"email":"client@example.com","password":"client123"}').token
Write-Host "TOKEN клиента: $t" -ForegroundColor Yellow
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/chat' `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $t"} `
    -Body '{"from":"Los Angeles, CA","to":"San Diego, CA","date":"2025-08-20","volume":12,"needHelpers":true}' | ConvertTo-Json -Depth 6

# --- 2. Владелец грузовика ---
Write-Host "`n=== 2. Владелец грузовика ===" -ForegroundColor Cyan
$t = (Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/auth/login' `
    -ContentType 'application/json' `
    -Body '{"email":"truckowner@example.com","password":"truck123"}').token
Write-Host "TOKEN владельца грузовика: $t" -ForegroundColor Yellow
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/chat' `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $t"} `
    -Body '{"from":"Los Angeles, CA","to":"Las Vegas, NV","date":"2025-08-21","volume":20,"needHelpers":false}' | ConvertTo-Json -Depth 6

# --- 3. Переездчик (Helper/Loader) ---
Write-Host "`n=== 3. Переездчик (Helper/Loader) ===" -ForegroundColor Cyan
$t = (Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/auth/login' `
    -ContentType 'application/json' `
    -Body '{"email":"helper@example.com","password":"helper123"}').token
Write-Host "TOKEN переездчика: $t" -ForegroundColor Yellow
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/chat' `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $t"} `
    -Body '{"from":"Los Angeles, CA","to":"Phoenix, AZ","date":"2025-08-22","volume":15,"needHelpers":false}' | ConvertTo-Json -Depth 6

# --- 4. Мувинговая компания ---
Write-Host "`n=== 4. Мувинговая компания ===" -ForegroundColor Cyan
$t = (Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/auth/login' `
    -ContentType 'application/json' `
    -Body '{"email":"movingcompany@example.com","password":"company123"}').token
Write-Host "TOKEN мувинговой компании: $t" -ForegroundColor Yellow
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/chat' `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $t"} `
    -Body '{"from":"Los Angeles, CA","to":"San Francisco, CA","date":"2025-08-23","volume":30,"needHelpers":true}' | ConvertTo-Json -Depth 6

# --- 5. Агент ---
Write-Host "`n=== 5. Агент ===" -ForegroundColor Cyan
$t = (Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/auth/login' `
    -ContentType 'application/json' `
    -Body '{"email":"agent@example.com","password":"agent123"}').token
Write-Host "TOKEN агента: $t" -ForegroundColor Yellow
Invoke-RestMethod -Method Post -Uri 'http://localhost:3001/api/chat' `
    -ContentType 'application/json' `
    -Headers @{Authorization="Bearer $t"} `
    -Body '{"from":"Los Angeles, CA","to":"Seattle, WA","date":"2025-08-24","volume":25,"needHelpers":true}' | ConvertTo-Json -Depth 6

