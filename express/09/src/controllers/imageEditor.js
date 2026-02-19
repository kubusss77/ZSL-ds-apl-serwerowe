const { renderError, renderImageEditor } = require('../renderers');

const filters = [{ name: 'grayscale' }, { name: 'invert' }, { name: 'sepia' }];

function imageEditorController(req, res) {
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

    renderImageEditor(res, {
      path: filePath,
      name: fileName,
      filters,
    });
  } catch (error) {
    renderError(res, 'Error opening image editor', error.message);
  }
}

module.exports = {
  imageEditorController,
};
