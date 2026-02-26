const fs = require('fs');
const path = require('path');
const { FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');

function deleteFolderController(req, res) {
  try {
    const folderPath = req.query.path;
    const folderName = req.query.name;

    if (!folderPath || !folderName) {
      renderError(res, 'Path and name are required', '');
      return;
    }

    if (folderPath.includes('/../') || folderName.includes('/../')) {
      renderError(res, 'Forbidden characters in path and/or name', '');
      return;
    }

    const absPath = path.join(FILES_DIR, req.user, folderPath, folderName);
    fs.rmSync(absPath, { recursive: true });

    res.redirect('/?path=' + folderPath);
  } catch (error) {
    renderError(res, 'Error removing folder', error.message);
  }
}

function deleteFileController(req, res) {
  try {
    const filePath = req.query.path;
    const fileName = req.query.name;

    if (!filePath || !fileName) {
      renderError(res, 'Path and name are required', '');
      return;
    }

    if (filePath.includes('/../') || fileName.includes('/../')) {
      renderError(res, 'Forbidden characters in path and/or name', '');
      return;
    }

    const absPath = path.join(FILES_DIR, req.user, filePath, fileName);
    fs.unlinkSync(absPath);

    res.redirect('/?path=' + filePath);
  } catch (error) {
    renderError(res, 'Error removing file', error.message);
  }
}

module.exports = {
  deleteFolderController,
  deleteFileController,
};
