const fs = require('fs');
const path = require('path');

const dirs = ['.next', 'node_modules/.cache'];

dirs.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  if (fs.existsSync(dirPath)) {
    console.log(`Cleaning ${dir}...`);
    try {
      fs.rmSync(dirPath, { recursive: true, force: true });
    } catch (err) {
      console.error(`Failed to clean ${dir}:`, err.message);
    }
  }
});
