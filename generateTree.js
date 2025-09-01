"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var path = require("path");
var baseDir = process.cwd();
var output = [];
// Configuration:
var excludeDirs = new Set(['node_modules', '.git', 'dist']);
var maxDepth = 3; // Change to desired max depth, or Infinity for unlimited
var includeHidden = false; // Set true to include hidden files/folders
function walk(dir, prefix, depth) {
    if (prefix === void 0) { prefix = ''; }
    if (depth === void 0) { depth = 0; }
    if (depth > maxDepth)
        return;
    var entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    }
    catch (_a) {
        return; // skip unreadable dirs
    }
    // Filter based on hidden and excludeDirs
    var visible = entries.filter(function (e) {
        if (!includeHidden && e.name.startsWith('.'))
            return false;
        if (excludeDirs.has(e.name))
            return false;
        return true;
    });
    var lastIndex = visible.length - 1;
    visible.forEach(function (entry, index) {
        var isLast = index === lastIndex;
        var pointer = isLast ? '┗' : '┣';
        var connector = isLast ? '  ' : '┃ ';
        var displayName = entry.name + (entry.isDirectory() ? '/' : '');
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
console.log("\u2705 structure.txt created with maxDepth=".concat(maxDepth, ", includeHidden=").concat(includeHidden));
