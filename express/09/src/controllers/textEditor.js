const { renderError, renderTextEditor } = require('../renderers');
const path = require('path');
const { FILES_DIR } = require('../server');
const fs = require('fs');

function textEditorGetContentController(req, res) {
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
    const fileContent = fs.readFileSync(absPath);

    renderTextEditor(res, {
      path: filePath,
      name: fileName,
      content: fileContent.toString(),
    });
  } catch (error) {
    renderError(res, 'Error opening file editor', error.message);
  }
}

function textEditorSaveContentController(req, res) {
  try {
    const filePath = req.body.path;
    const fileName = req.body.name;
    const fileContent = req.body.content;

    if (!filePath || !fileName) {
      renderError(res, 'File path and/or name are required');
      return;
    }

    if (filePath.includes('..') || fileName.includes('..')) {
      renderError(res, 'Forbidden characters in file path and/or name');
      return;
    }

    const absPath = path.join(FILES_DIR, req.session.username, filePath, fileName);
    fs.writeFileSync(absPath, fileContent);

    renderTextEditor(res, {
      path: filePath,
      name: fileName,
      content: fileContent,
    });
  } catch (error) {
    renderError(res, 'Error saving file', error.message);
  }
}

module.exports = {
  textEditorGetContentController,
  textEditorSaveContentController,
};
