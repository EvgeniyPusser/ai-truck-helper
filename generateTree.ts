import * as fs from 'fs';
import * as path from 'path';

const baseDir = process.cwd();
const output: string[] = [];

// Configuration:
const excludeDirs = new Set(['node_modules', '.git', 'dist']);
const maxDepth = 3;           // Change to desired max depth, or Infinity for unlimited
const includeHidden = false;  // Set true to include hidden files/folders

function walk(dir: string, prefix = '', depth = 0): void {
  if (depth > maxDepth) return;

  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return; // skip unreadable dirs
  }

  // Filter based on hidden and excludeDirs
  const visible = entries.filter(e => {
    if (!includeHidden && e.name.startsWith('.')) return false;
    if (excludeDirs.has(e.name)) return false;
    return true;
  });

  const lastIndex = visible.length - 1;

  visible.forEach((entry, index) => {
    const isLast = index === lastIndex;
    const pointer = isLast ? '┗' : '┣';
    const connector = isLast ? '  ' : '┃ ';
    const displayName = entry.name + (entry.isDirectory() ? '/' : '');

    output.push(prefix + pointer + ' ' + displayName);

    if (entry.isDirectory()) {
      walk(path.join(dir, entry.name), prefix + connector, depth + 1);
    }
  });
}

// Start walking
output.push(path.basename(baseDir) + '/');
walk(baseDir);

fs.writeFileSync('structure.txt', output.join('\n'), 'utf8');
console.log(`✅ structure.txt created with maxDepth=${maxDepth}, includeHidden=${includeHidden}`);
