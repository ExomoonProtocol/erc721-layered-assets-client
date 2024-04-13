const fs = require('fs');
const path = require('path');


async function run() {
  // Checks if docs folder exists
  const docsPath = path.resolve(__dirname, '../docs');
  if (!fs.existsSync(docsPath)) {
    return;
  }

  // Deletes README.md file from docs folder
  const readmePath = path.resolve(docsPath, 'README.md');
  if (fs.existsSync(readmePath)) {
    fs.rmSync(readmePath);
  }

  // Rename modules.md into README.md
  const modulesPath = path.resolve(docsPath, 'modules.md');
  const readmePathNew = path.resolve(docsPath, 'README.md');
  if (fs.existsSync(modulesPath)) {
    fs.renameSync(modulesPath, readmePathNew);
  }

}

run();