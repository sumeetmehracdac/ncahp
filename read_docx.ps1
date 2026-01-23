param([string]$docxPath)

if (-not (Test-Path $docxPath)) {
    Write-Error "File not found: $docxPath"
    exit 1
}

$tempDir = Join-Path $env:TEMP ([Guid]::NewGuid().ToString())
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    # Copy docx to zip in temp
    $zipPath = Join-Path $tempDir "content.zip"
    Copy-Item -Path $docxPath -Destination $zipPath
    
    # Extract zip
    $extractDir = Join-Path $tempDir "extracted"
    Expand-Archive -Path $zipPath -DestinationPath $extractDir -Force
    
    # Read document.xml
    $xmlPath = Join-Path $extractDir "word/document.xml"
    if (Test-Path $xmlPath) {
        [xml]$xml = Get-Content $xmlPath
        # Output only the text content
        Write-Output $xml.InnerText
    } else {
        Write-Error "Could not find word/document.xml in the file."
    }
}
catch {
    Write-Error "Error processing file: $_"
}
finally {
    # Cleanup
    if (Test-Path $tempDir) {
        Remove-Item -Path $tempDir -Recurse -Force
    }
}
