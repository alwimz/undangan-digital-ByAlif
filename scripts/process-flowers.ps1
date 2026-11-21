Add-Type -AssemblyName System.Drawing

$srcPath = "assets/merahputih/hiasan-sudut-bunga.jpeg"
$outTopLeft = "assets/merahputih/hiasan-corner-topleft.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
Write-Host "Source image size: $($src.Width) x $($src.Height)"

# The bouquet is in the top-left corner roughly 550x550 pixels
$cropW = 560
$cropH = 560

$bmp = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

for ($y = 0; $y -lt $cropH; $y++) {
    for ($x = 0; $x -lt $cropW; $x++) {
        $p = $src.GetPixel($x, $y)
        $r = [int]$p.R
        $g = [int]$p.G
        $b = [int]$p.B
        $maxC = [Math]::Max($r, [Math]::Max($g, $b))

        # Black background removal with smooth feather
        if ($maxC -lt 12) {
            # Fully transparent
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } elseif ($maxC -lt 45) {
            # Smooth feathered transition
            $alpha = [int](($maxC - 12) * 255 / (45 - 12))
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $r, $g, $b))
        } else {
            # Solid pixel
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $r, $g, $b))
        }
    }
}

$bmp.Save($outTopLeft, [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
$src.Dispose()

Write-Host "Saved transparent top-left corner PNG to $outTopLeft"
