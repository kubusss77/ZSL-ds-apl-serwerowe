const fs = require('fs');
const path = require('path');
const { FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');

function renameFolderController(req, res) {
  try {
    const folderPath = req.body.currentPath;
    const parentPath = req.body.parentPath;
    const folderNewName = req.body.newName;

    console.log(req.body);

    if (!folderPath || !folderNewName) {
      renderError(res, 'Folder path and/or new name are required');
      return;
    }

    if (folderPath.includes('/../') || folderNewName.includes('/../')) {
      renderError(res, 'Forbidden characters in folder path and/or name', '');
      return;
    }

    const absOldPath = path.join(FILES_DIR, folderPath);
    if (!fs.existsSync(absOldPath)) {
      renderError(res, 'Folder does not exist');
      return;
    }

    const absNewPath = path.join(FILES_DIR, folderPath, '..', folderNewName);
    if (fs.existsSync(absNewPath)) {
      renderError(res, 'Folder already exists');
      return;
    }

    fs.renameSync(absOldPath, absNewPath);

    const newPath = parentPath === '/' ? '/' + folderNewName : parentPath + '/' + folderNewName;

    res.redirect('/?path=' + newPath);
  } catch (error) {
    renderError(res, 'Error renaming folder', error.message);
  }
}

module.exports = {
  renameFolderController,
};
