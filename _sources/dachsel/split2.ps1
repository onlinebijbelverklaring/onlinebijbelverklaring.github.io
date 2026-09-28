# Define your parameters
$filePath = "Haggai.txt" # Path to your huge text file
$delimiter = "--HOOFDSTUK--" # Your delimiter
$baseOutputPath = "Haggai" # Base path and filename for output files

# Initialize variables
$fileCounter = 0
$currentContent = [System.Collections.Generic.List[string]]::new()

# Read the file line by line with UTF-8 encoding
Get-Content -Path $filePath -Encoding utf8 | ForEach-Object {
    if ($_ -match $delimiter -and $currentContent.Count -gt 0) {
        # Define output path
        $outputPath = "$baseOutputPath$fileCounter.md"
        
        # Write content (PowerShell 7 writes UTF-8 WITHOUT BOM by default)
        $currentContent | Set-Content -Path $outputPath -Encoding utf8
        
        # Increment the file counter and reset the current content
        $fileCounter++
        $currentContent.Clear()
    }
    $currentContent.Add($_)
}

# Don't forget to output the last chunk if it exists
if ($currentContent.Count -gt 0) {
    $outputPath = "$baseOutputPath$fileCounter.md"
    $currentContent | Set-Content -Path $outputPath -Encoding utf8
}