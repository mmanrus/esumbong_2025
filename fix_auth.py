from pathlib import Path
import re
root = Path('src/app/api')
files = list(root.rglob('*.ts'))
changed=[]
for path in files:
    text = path.read_text(encoding='utf-8')
    orig = text
    # replace COOKIE_NAME lookup
    text = text.replace('cookieStore.get(COOKIE_NAME)?.value', 'cookieStore.get("access_token")?.value')
    # remove unused import if it exists and COOKIE_NAME no longer present
    if re.search(r'import\s*\{\s*COOKIE_NAME\s*\}\s*from\s*"@/lib/constants";?', text):
        if 'COOKIE_NAME' not in text.replace('import { COOKIE_NAME } from "@/lib/constants";',''):
            text = re.sub(r'^import\s*\{\s*COOKIE_NAME\s*\}\s*from\s*"@/lib/constants";?\s*\n', '', text, flags=re.MULTILINE)
    if text != orig:
        path.write_text(text, encoding='utf-8')
        changed.append(str(path))
print('changed', len(changed))
for p in changed[:50]:
    print(p)