# Define your parameters
$filePath = "C:\temp\jesaja.txt" # Path to your huge text file
$delimiter = "--HOOFDSTUK--" # Your delimiter
$baseOutputPath = "C:\temp\Jesaja" # Base path and filename for output files

# Initialize variables
$fileCounter = 0
$currentContent = @()

# Read the file line by line
Get-Content -Path $filePath | ForEach-Object {
if ($_ -match $delimiter -and $currentContent.Count -gt 0) {
# Output the current content to a file
$currentContent | Out-File -encoding "ASCII" -FilePath ($baseOutputPath + $fileCounter + ".md")
# Increment the file counter and reset the current content
$fileCounter++
$currentContent = @()
}
$currentContent += $_
}

# Don't forget to output the last chunk if it exists
if ($currentContent.Count -gt 0) {
$currentContent | Out-File -encoding "ASCII" -FilePath ($baseOutputPath + $fileCounter + ".md")
}