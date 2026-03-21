const fs = require('fs');
const path = require('path');
const { FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');
const archiver = require('archiver');

function downloadFolderController(req, res) {
  try {
    const folderPath = req.query.path;
    const folderName = req.query.name;

    if (!folderPath || !folderName) {
      renderError(res, 'Folder path and name are required', '');
      return;
    }

    if (folderPath.includes('/../') || folderName.includes('/../')) {
      renderError(res, 'Forbidden characters in file path and/or name', '');
      return;
    }

    res.attachment(folderName + '.zip');

    const absPath = path.join(FILES_DIR, req.session.username, folderPath, folderName);

    const archive = archiver('zip', {
      zlib: { level: 9 },
    });

    archive.on('error', (error) => {
      renderError(res, 'Error creating archive', error.message);
      return;
    });

    archive.pipe(res);
    archive.directory(absPath, folderName);
    archive.finalize();
  } catch (error) {
    renderError(res, 'Error downloading folder', error.message);
  }
}

function downloadFileController(req, res) {
  try {
    const filePath = req.query.path;
    const fileName = req.query.name;

    if (!filePath || !fileName) {
      renderError(res, 'File path and name are required', '');
      return;
    }

    if (filePath.includes('/../') || fileName.includes('/../')) {
      renderError(res, 'Forbidden characters in file path and/or name', '');
      return;
    }

    const absPath = path.join(FILES_DIR, req.session.username, filePath, fileName);
    if (!fs.existsSync(absPath)) {
      renderError(res, 'File not found', '');
      return;
    }

    res.download(absPath, (error) => {
      if (error) {
        renderError(res, 'Error downloading file', error);
      }
    });
  } catch (error) {
    renderError(res, 'Error downloading file (controller)', error.message);
  }
}

module.exports = {
  downloadFolderController,
  downloadFileController,
};
