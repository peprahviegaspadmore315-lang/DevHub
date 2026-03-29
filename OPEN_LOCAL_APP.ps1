$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendDir = Join-Path $repoRoot 'frontend'
$backendDir = Join-Path $repoRoot 'backend'
$backendEnvFile = Join-Path $backendDir '.env'

$frontendPort = 5174
$staleFrontendPorts = @(5173, 5175, 5176)
$backendPort = 9090
$frontendUrl = "http://localhost:$frontendPort"
$backendTimeoutSeconds = 120
$frontendTimeoutSeconds = 120

function Test-LocalPort {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port
    )

    foreach ($hostName in @('127.0.0.1', 'localhost', '::1')) {
        $client = New-Object System.Net.Sockets.TcpClient

        try {
            $asyncResult = $client.BeginConnect($hostName, $Port, $null, $null)
            $connected = $asyncResult.AsyncWaitHandle.WaitOne(400)

            if (-not $connected) {
                continue
            }

            $client.EndConnect($asyncResult) | Out-Null
            return $true
        }
        catch {
            continue
        }
        finally {
            $client.Dispose()
        }
    }

    return $false
}

function Get-ListeningProcessIds {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$Ports
    )

    $processIds = New-Object System.Collections.Generic.HashSet[int]

    foreach ($port in $Ports) {
        try {
            $connections = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction Stop
            foreach ($connection in $connections) {
                [void]$processIds.Add([int]$connection.OwningProcess)
            }
        }
        catch {
            $netstatMatches = netstat -ano | Select-String -Pattern "[:\.]$port\s+.*LISTENING\s+(\d+)"
            foreach ($match in $netstatMatches) {
                $parts = ($match.Line -split '\s+') | Where-Object { $_ }
                if ($parts.Count -ge 5) {
                    [void]$processIds.Add([int]$parts[-1])
                }
            }
        }
    }

    return @($processIds)
}

function Stop-ProcessesOnPorts {
    param(
        [Parameter(Mandatory = $true)]
        [int[]]$Ports,

        [Parameter(Mandatory = $true)]
        [string]$Label
    )

    $processIds = Get-ListeningProcessIds -Ports $Ports

    if (-not $processIds -or $processIds.Count -eq 0) {
        return
    }

    Write-Host "Stopping stale $Label process(es) on port(s): $($Ports -join ', ')" -ForegroundColor Yellow

    foreach ($processId in $processIds) {
        try {
            $process = Get-Process -Id $processId -ErrorAction Stop
            Write-Host " - Stopping PID $processId ($($process.ProcessName))" -ForegroundColor DarkYellow
            Stop-Process -Id $processId -Force -ErrorAction Stop
        }
        catch {
            Write-Warning "Could not stop PID $processId on ports $($Ports -join ', ')."
        }
    }

    Start-Sleep -Seconds 2
}

function Wait-ForPort {
    param(
        [Parameter(Mandatory = $true)]
        [int]$Port,

        [Parameter(Mandatory = $true)]
        [int]$TimeoutSeconds,

        [Parameter(Mandatory = $true)]
        [string]$Name
    )

    for ($attempt = 1; $attempt -le $TimeoutSeconds; $attempt++) {
        if (Test-LocalPort -Port $Port) {
            Write-Host "$Name is ready on port $Port." -ForegroundColor Green
            return $true
        }

        if ($attempt -eq 1 -or $attempt % 10 -eq 0) {
            Write-Host "Waiting for $Name on port $Port..." -ForegroundColor Cyan
        }

        Start-Sleep -Seconds 1
    }

    return $false
}

function Assert-CommandAvailable {
    param(
        [Parameter(Mandatory = $true)]
        [string]$CommandName,

        [Parameter(Mandatory = $true)]
        [string]$FriendlyName
    )

    if (-not (Get-Command $CommandName -ErrorAction SilentlyContinue)) {
        throw "$FriendlyName was not found in PATH. Please install it or open a terminal where it is available."
    }
}

function Get-SecretState {
    param(
        [string]$Value
    )

    if ([string]::IsNullOrWhiteSpace($Value)) {
        return 'missing'
    }

    $normalized = $Value.Trim().ToLowerInvariant()
    if (
        $normalized.StartsWith('dummy') -or
        $normalized.Contains('your_') -or
        $normalized.Contains('_here') -or
        $normalized.Contains('replace_me')
    ) {
        return 'placeholder'
    }

    return 'configured'
}

function Import-EnvFile {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path
    )

    if (-not (Test-Path -LiteralPath $Path)) {
        Write-Warning "No backend .env file was found at $Path."
        return
    }

    Write-Host "Loading environment from $Path" -ForegroundColor Cyan

    foreach ($line in Get-Content -LiteralPath $Path) {
        $trimmed = $line.Trim()
        if ([string]::IsNullOrWhiteSpace($trimmed) -or $trimmed.StartsWith('#')) {
            continue
        }

        $separatorIndex = $trimmed.IndexOf('=')
        if ($separatorIndex -lt 1) {
            continue
        }

        $name = $trimmed.Substring(0, $separatorIndex).Trim()
        $value = $trimmed.Substring($separatorIndex + 1)

        if (
            ($value.StartsWith('"') -and $value.EndsWith('"')) -or
            ($value.StartsWith("'") -and $value.EndsWith("'"))
        ) {
            $value = $value.Substring(1, $value.Length - 2)
        }

        Set-Item -Path "Env:$name" -Value $value
    }
}

function Convert-SecureStringToPlainText {
    param(
        [Parameter(Mandatory = $true)]
        [Security.SecureString]$SecureString
    )

    $pointer = [IntPtr]::Zero

    try {
        $pointer = [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureString)
        return [Runtime.InteropServices.Marshal]::PtrToStringBSTR($pointer)
    }
    finally {
        if ($pointer -ne [IntPtr]::Zero) {
            [Runtime.InteropServices.Marshal]::ZeroFreeBSTR($pointer)
        }
    }
}

function Update-EnvFileValue {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Path,

        [Parameter(Mandatory = $true)]
        [string]$Name,

        [Parameter(Mandatory = $true)]
        [string]$Value
    )

    $lines = @()
    if (Test-Path -LiteralPath $Path) {
        $lines = Get-Content -LiteralPath $Path
    }

    $pattern = '^\s*' + [regex]::Escape($Name) + '\s*='
    $updated = $false

    for ($index = 0; $index -lt $lines.Count; $index++) {
        if ($lines[$index] -match $pattern) {
            $lines[$index] = "$Name=$Value"
            $updated = $true
        }
    }

    if (-not $updated) {
        $lines += "$Name=$Value"
    }

    Set-Content -LiteralPath $Path -Value $lines
}

function Resolve-AIProviderPreference {
    $openAiState = Get-SecretState $env:OPENAI_API_KEY
    $geminiState = Get-SecretState $env:GEMINI_API_KEY

    $env:AI_PROVIDER = 'gemini'
    if ([string]::IsNullOrWhiteSpace($env:GEMINI_MODEL) -or $env:GEMINI_MODEL -eq 'gemini-1.5-flash') {
        $env:GEMINI_MODEL = 'gemini-2.5-flash'
    }

    if ($geminiState -eq 'configured') {
        Write-Host 'Live AI preference: Gemini online.' -ForegroundColor Green
        return
    }

    if ($openAiState -eq 'configured') {
        Write-Host 'OpenAI is configured, but this launcher now prefers Gemini so your default AI flow can stay on the free-tier path.' -ForegroundColor DarkYellow
    }

    if ($geminiState -eq 'placeholder') {
        Write-Warning 'Gemini is not connected yet. The current GEMINI_API_KEY is still a placeholder, so DevHub will use the local fallback until you replace it in backend/.env.'
        return
    }

    Write-Warning 'Gemini is not connected yet. DevHub will use the local fallback until you add a real GEMINI_API_KEY in backend/.env.'
}

function Ensure-MailSenderConfiguration {
    $mailUsernameState = Get-SecretState $env:MAIL_USERNAME
    $mailPasswordState = Get-SecretState $env:MAIL_PASSWORD
    $mailFromState = Get-SecretState $env:MAIL_FROM

    if ($mailUsernameState -eq 'configured' -and $mailPasswordState -eq 'configured') {
        if ($mailFromState -ne 'configured') {
            $env:MAIL_FROM = $env:MAIL_USERNAME
            Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_FROM' -Value $env:MAIL_FROM
        }

        if ((Get-SecretState $env:MAIL_HOST) -ne 'configured') {
            $env:MAIL_HOST = 'smtp.gmail.com'
            Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_HOST' -Value $env:MAIL_HOST
        }

        if ((Get-SecretState $env:MAIL_PORT) -ne 'configured') {
            $env:MAIL_PORT = '587'
            Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_PORT' -Value $env:MAIL_PORT
        }

        Write-Host 'Password reset email sender is configured.' -ForegroundColor Green
        return
    }

    Write-Warning 'Password reset email sender is not configured yet. DevHub can prompt for a Gmail sender now so users receive recovery codes by email instead of seeing a local preview.'
    $setupChoice = Read-Host 'Configure Gmail sender now? (Y/N)'

    if ([string]::IsNullOrWhiteSpace($setupChoice) -or $setupChoice.Trim().ToUpperInvariant() -ne 'Y') {
        Write-Warning 'Skipping Gmail sender setup for now. Forgot-password will keep using the local recovery-code preview until you configure it.'
        return
    }

    $senderEmail = (Read-Host 'Enter the Gmail address DevHub should send password reset codes from').Trim()
    if ([string]::IsNullOrWhiteSpace($senderEmail)) {
        Write-Warning 'No Gmail sender address was entered. Keeping local recovery-code preview mode.'
        return
    }

    $appPasswordSecure = Read-Host 'Enter the Gmail App Password for that sender account' -AsSecureString
    $appPassword = Convert-SecureStringToPlainText -SecureString $appPasswordSecure

    if ([string]::IsNullOrWhiteSpace($appPassword)) {
        Write-Warning 'No Gmail App Password was entered. Keeping local recovery-code preview mode.'
        return
    }

    if ($appPassword -match '^\d+$') {
        Write-Warning 'That entry looks like a normal numeric password, not a Gmail App Password.'
        Write-Host 'Google SMTP requires a Google-generated App Password after enabling 2-Step Verification.' -ForegroundColor Yellow
        Write-Host 'Create one here: https://myaccount.google.com/apppasswords' -ForegroundColor Cyan
        Write-Warning 'Keeping local recovery-code preview mode until a real Gmail App Password is provided.'
        return
    }

    $env:MAIL_HOST = 'smtp.gmail.com'
    $env:MAIL_PORT = '587'
    $env:MAIL_USERNAME = $senderEmail
    $env:MAIL_PASSWORD = $appPassword
    $env:MAIL_FROM = $senderEmail

    Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_HOST' -Value $env:MAIL_HOST
    Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_PORT' -Value $env:MAIL_PORT
    Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_USERNAME' -Value $env:MAIL_USERNAME
    Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_PASSWORD' -Value $env:MAIL_PASSWORD
    Update-EnvFileValue -Path $backendEnvFile -Name 'MAIL_FROM' -Value $env:MAIL_FROM

    Write-Host "Saved Gmail sender settings for $senderEmail." -ForegroundColor Green
}

function Start-DevWindow {
    param(
        [Parameter(Mandatory = $true)]
        [string]$Title,

        [Parameter(Mandatory = $true)]
        [string]$WorkingDir,

        [Parameter(Mandatory = $true)]
        [string]$Command
    )

    $escapedTitle = $Title.Replace('"', '""')
    $escapedDir = $WorkingDir.Replace('"', '""')
    $launchCommand = "title $escapedTitle && cd /d `"$escapedDir`" && $Command"

    Start-Process -FilePath $env:ComSpec `
        -WorkingDirectory $WorkingDir `
        -ArgumentList @('/k', $launchCommand) | Out-Null
}

Assert-CommandAvailable -CommandName 'npm' -FriendlyName 'Node/npm'
Assert-CommandAvailable -CommandName 'mvn' -FriendlyName 'Maven'

Import-EnvFile -Path $backendEnvFile
Resolve-AIProviderPreference
Ensure-MailSenderConfiguration

Write-Host 'Checking local dev servers...' -ForegroundColor Cyan

Stop-ProcessesOnPorts -Ports @($backendPort) -Label 'backend'
Stop-ProcessesOnPorts -Ports (@($frontendPort) + $staleFrontendPorts) -Label 'frontend'

Write-Host "Starting backend on port $backendPort..." -ForegroundColor Yellow
Start-DevWindow `
    -Title 'Learning Platform Backend' `
    -WorkingDir $backendDir `
    -Command 'call mvn spring-boot:run -Dspring-boot.run.profiles=dev'
$backendReady = Wait-ForPort -Port $backendPort -TimeoutSeconds $backendTimeoutSeconds -Name 'Backend'

Write-Host "Starting frontend on port $frontendPort..." -ForegroundColor Yellow
Start-DevWindow `
    -Title 'Learning Platform Frontend' `
    -WorkingDir $frontendDir `
    -Command "call npm run dev -- --host localhost --port $frontendPort --strictPort"
$frontendReady = Wait-ForPort -Port $frontendPort -TimeoutSeconds $frontendTimeoutSeconds -Name 'Frontend'

if ($backendReady -and $frontendReady) {
    Write-Host "Opening $frontendUrl" -ForegroundColor Green
    Start-Process $frontendUrl | Out-Null
}
else {
    if (-not $backendReady) {
        Write-Warning "Backend did not become ready on port $backendPort. Check the backend terminal window."
    }

    if (-not $frontendReady) {
        Write-Warning "Frontend did not become ready on port $frontendPort. Check the frontend terminal window."
    }

    exit 1
}




