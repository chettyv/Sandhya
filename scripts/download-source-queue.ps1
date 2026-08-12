[CmdletBinding(SupportsShouldProcess = $true)]
param(
  [string]$QueuePath = "docs/source_download_queue_2026-06-19.csv",
  [string]$UserAgent = "SandhyaCorpusResearch/0.2 (local staging; nonproduction)"
)

$ErrorActionPreference = "Stop"
$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$queueFullPath = Resolve-Path (Join-Path $repoRoot $QueuePath)
$rows = Import-Csv -LiteralPath $queueFullPath
$headers = @{ "User-Agent" = $UserAgent }

foreach ($row in $rows) {
  if ([string]::IsNullOrWhiteSpace($row.download_url)) {
    Write-Host "SKIP metadata-only $($row.work_id)"
    continue
  }

  $target = Join-Path $repoRoot $row.target_path
  $targetDir = Split-Path -Parent $target
  New-Item -ItemType Directory -Force -Path $targetDir | Out-Null

  if (Test-Path -LiteralPath $target) {
    Write-Host "SKIP existing $($row.target_path)"
    continue
  }

  if ($PSCmdlet.ShouldProcess($row.download_url, "Download to $target")) {
    Write-Host "DOWNLOAD $($row.work_id)"
    Invoke-WebRequest `
      -Uri $row.download_url `
      -OutFile $target `
      -Headers $headers `
      -MaximumRedirection 10
  }
}
