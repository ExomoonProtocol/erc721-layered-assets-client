const fs = require('fs');
const path = require('path');
const replace = require('replace-in-file');

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
  const readmePathNew = path.resolve(docsPath, 'Assets Client.md');
  if (fs.existsSync(modulesPath)) {
    fs.renameSync(modulesPath, readmePathNew);
  }

  // Replace 'modules.md' with 'Assets Client.md' in all files
  const options = {
    files: path.resolve(docsPath, "**", '*.md'),
    from: /modules.md/g,
    to: 'Assets Client.md',
  };

  try {
    await replace(options);
  } catch (error) {
    console.error('Error occurred:', error);
  }

}

run();