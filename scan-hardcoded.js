const fs = require('fs');
const path = require('path');
function walk(dir) {
  let out = [];
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const s = fs.statSync(p);
    if (s.isDirectory()) out.push(...walk(p));
    else if (/\.(js|jsx|ts|tsx)$/.test(name)) out.push(p);
  }
  return out;
}
function isUIString(s) {
  if (s === 'use client') return false;
  if (!/[A-Za-z]/.test(s)) return false;
  if (/^\s*$/.test(s)) return false;
  if (/^\d+$/.test(s)) return false;
  if (/^https?:\/\//.test(s)) return false;
  if (/\.(png|jpg|jpeg|svg|gif|webp|pdf|ico)$/.test(s)) return false;
  if (/^[\w-\/.:]+$/.test(s)) return false;
  if (/^(true|false|null|undefined)$/.test(s)) return false;
  if (/^[A-Za-z0-9_]+$/.test(s)) return false;
  if (/^[\s\w]*$/.test(s) && s.length < 3) return false;
  if (/^noopener(?:\s+noreferrer)?$/.test(s)) return false;
  if (/;/.test(s) && /[A-Za-z0-9_]+=/.test(s)) return false;

  if (/must be used within .*Provider$/.test(s)) return false;

  if (s.includes(' ')) {
    const tokens = s.trim().split(/\s+/);
    const isClassList = tokens.every((token) => {
      return /^[^\s'"`]+$/.test(token) && /[-:\[\]]/.test(token);
    });
    if (isClassList) return false;
  }

  return true;
}
const files = walk(path.join(process.cwd(), 'src'));
for (const file of files) {
  const txt = fs.readFileSync(file, 'utf8');
  const lines = txt.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const regex = /(['"])(?:(?!\1|\\).|\\.)*\1/g;
    let m;
    while ((m = regex.exec(line))) {
      const val = m[0].slice(1, -1);
      if (!isUIString(val)) continue;
      const before = line.slice(0, m.index);
      if (/\bconsole\.(error|warn|log|debug)\s*\(\s*$/.test(before)) continue;
      if (/\bt\(\s*$/.test(before)) continue;
      if (/\bt\(\s*['\"]/.test(line)) continue;
      if (/\b(import|from|require|export|const|let|var|className|style=|src=|href=|to=|as=|type=|name=|id=|data-|aria-|role=|method=|action=|pattern=|placeholder=|alt=|title=|description|cn\(|cva\()/).test(before)) {
        if (/(placeholder=|alt=|aria-label=|title=|description=)/.test(before)) {
          // keep UI attribute values
        } else continue;
      }
      if (/\b(t\(|translate|locale|messages|en\.|ar\.)/.test(line)) continue;
      console.log(`${file}:${idx + 1}: ${val}`);
    }
  });
}
