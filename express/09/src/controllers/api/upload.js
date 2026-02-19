const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');

function uploadController(req, res) {
  const form = new formidable.IncomingForm();
  form.uploadDir = FILES_DIR;
  form.keepExtensions = true;
  form.multiples = true;

  form.parse(req, function (err, fields, files) {
    if (err) {
      return renderError(res, 'Error uploading file', err.message);
    }

    const uploadPathParam = fields.path ? (Array.isArray(fields.path) ? fields.path[0] : fields.path) : '';
    const targetDir = path.join(FILES_DIR, uploadPathParam);

    let uploadedFiles = files.imagetoupload;

    if (!uploadedFiles) {
      res.redirect('/?path=' + encodeURIComponent(uploadPathParam));
      return;
    }

    if (!Array.isArray(uploadedFiles)) {
      uploadedFiles = [uploadedFiles];
    }

    uploadedFiles.forEach((file) => {
      const oldPath = file.filepath;
      const originalName = file.originalFilename || file.newFilename;
      let newName = originalName;
      let newPath = path.join(targetDir, newName);

      if (fs.existsSync(newPath)) {
        const ext = path.extname(originalName);
        const name = path.basename(originalName, ext);
        newName = `${name}_${Date.now()}${ext}`;
        newPath = path.join(targetDir, newName);
      }

      try {
        fs.renameSync(oldPath, newPath);
      } catch (e) {
        console.error('Error moving file', e);
      }
    });

    res.redirect('/?path=' + encodeURIComponent(uploadPathParam));
  });
}

module.exports = {
  uploadController,
};
