const { renderError, renderImageEditor } = require('../renderers');
const formidable = require('formidable');
const path = require('path');
const { FILES_DIR } = require('../server');
const fs = require('fs');

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

function imageEditorSaveImageController(req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      if (err) {
        return renderError(res, 'Error processing form data', err.message);
      }

      const imgPath = fields.path[0];
      const imgName = fields.name[0];
      const blob = files.blob[0];

      if (!imgPath || !imgName || !blob) {
        renderError(res, 'Missing required fields');
        return;
      }

      const targetPath = path.join(FILES_DIR, req.user, imgPath, imgName);

      fs.renameSync(blob.filepath, targetPath);

      res.json({ status: 'ok' });
    });
  } catch (error) {
    console.error(error);
    renderError(res, 'Error saving image', error.message);
  }
}

module.exports = {
  imageEditorController,
  imageEditorSaveImageController,
};
