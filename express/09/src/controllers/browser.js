const fs = require('fs');
const path = require('path');
const { FILES_DIR } = require('../server');
const { renderBrowser, renderError } = require('../renderers');

function browserController(req, res) {
  try {
    const relPath = req.query.path;

    if (!relPath || relPath.includes('..')) {
      res.redirect('/?path=/');
      return;
    }

    const relPathArray = relPath.split('/');
    const absPath = path.join(FILES_DIR, req.session.username, relPath);

    if (!fs.existsSync(absPath)) {
      renderError(res, 'Directory not found');
      return;
    }

    const objects = fs.readdirSync(absPath);

    const files = [];
    const folders = [];

    objects.forEach((name) => {
      const childPath = path.join(absPath, name);
      fullName = name;
      if (name.length > 32) {
        name = name.slice(0, 16) + '...' + name.slice(-12);
      }

      const isDir = fs.lstatSync(childPath).isDirectory();
      if (isDir) {
        folders.push({ name, fullName });
      } else {
        files.push({ name, fullName });
      }
    });

    const currentPath = relPathArray.join('/');
    const parentPath = relPathArray.toSpliced(relPathArray.length - 2, 1).join('/');

    const pathsArray = relPathArray
      .map((name, index) => {
        let relPath = '';
        for (let i = 0; i <= index; i++) {
          relPath += relPathArray[i] + '/';
        }

        if (name.length > 12) {
          name = name.slice(0, 5) + '...' + name.slice(-4);
        }

        return { name, path: relPath };
      })
      .slice(1, -1);

    const errorsText = {
      name_required: 'Name is required',
      folder_exists: 'This folder already exists',
      file_exists: 'This file already exists',
      file_invalid_name: 'Invalid file name. Only letters, numbers, "_", "+" and "." are allowed.',
      file_extension_required: 'File extension is required',
    };

    renderBrowser(
      res,
      {
        currentPath,
        pathsArray,
        parentPath,
        folders,
        files,
      },
      {
        type: req.query.error_type,
        message: errorsText[req.query.error_message] || 'Unknown error',
      }
    );
  } catch (error) {
    renderError(res, 'Error reading files', error.message);
  }
}

module.exports = {
  browserController,
};
