const { renderError } = require('../../renderers');
const path = require('path');
const { FILES_DIR } = require('../../server');

function rawFileController(req, res) {
  try {
    const filePath = req.query.path;
    const fileName = req.query.name;

    if (!filePath || !fileName) {
      renderError(res, 'File path and/or name are required');
      return;
    }

    if (filePath.includes('..') || fileName.includes('..')) {
      renderError(res, 'Forbidden characters in file path and/or name');
      return;
    }

    const absPath = path.join(FILES_DIR, req.session.username, filePath, fileName);

    res.sendFile(absPath);
  } catch (error) {
    renderError(res, 'Error sending file', error.message);
  }
}

module.exports = {
  rawFileController,
};
