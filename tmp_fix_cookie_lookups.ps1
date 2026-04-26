$root = "./src/app/api"
Get-ChildItem -Path $root -Recurse -Filter *.ts | ForEach-Object {
    $path = $_.FullName
    $text = Get-Content -Path $path -Raw
    $new = $text -replace 'cookieStore\.get\(COOKIE_NAME\)\?\.value', 'cookieStore.get("access_token")?.value'
    if ($new -ne $text) {
        $new = $new -replace '^import \{ COOKIE_NAME \} from "@/lib/constants";?\r?\n', ''
        $new = $new -replace '^import \{ COOKIE_NAME \} from "@/lib/constants"\r?\n', ''
        Set-Content -Path $path -Value $new
        Write-Output "Updated: $path"
    } else {
        # If file still imports COOKIE_NAME but no direct replacement happened, remove unused import
        if ($text -match 'import \{ COOKIE_NAME \} from "@/lib/constants"' -and $text -notmatch 'COOKIE_NAME') {
            $new = $text -replace '^import \{ COOKIE_NAME \} from "@/lib/constants";?\r?\n', ''
            Set-Content -Path $path -Value $new
            Write-Output "Cleaned import: $path"
        }
    }
}