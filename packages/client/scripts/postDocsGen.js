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
  const readmePathNew = path.resolve(docsPath, 'AssetsClient.md');
  if (fs.existsSync(modulesPath)) {
    fs.renameSync(modulesPath, readmePathNew);
  }

  // Replace 'modules.md' with 'AssetsClient.md' in all files
  const options = {
    files: path.resolve(docsPath, "**", '*.md'),
    from: /modules.md/g,
    to: 'AssetsClient.md',
  };

  try {
    await replace(options);
  } catch (error) {
    console.error('Error occurred:', error);
  }

  // Replace 'README.md' with 'AssetsClient.md' in all files
  const options2 = {
    files: path.resolve(docsPath, "**", '*.md'),
    from: /README.md/g,
    to: 'AssetsClient.md',
  };

  try {
    await replace(options2);
  } catch (error) {
    console.error('Error occurred:', error);
  }

}

run();