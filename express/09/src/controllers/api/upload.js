const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const { UPLOADS_DIR, FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');

function uploadController(req, res) {
  try {
    const form = new formidable.IncomingForm();
    form.uploadDir = UPLOADS_DIR;
    form.keepExtensions = true;
    form.multiples = true;

    form.parse(req, function (err, fields, files) {
      if (err) {
        console.error('Error parsing form', err);
        renderError(res, 'Error uploading file', err.message);
        return;
      }

      const uploadPath = fields.path[0];
      const targetDir = path.join(FILES_DIR, req.session.username, uploadPath);

      let uploadedFiles = files.files;

      if (!uploadedFiles) {
        console.log('No files uploaded');
        res.redirect('/?path=' + uploadPath);
        return;
      }

      uploadedFiles.forEach((file) => {
        const oldPath = file.filepath;
        const originalName = file.originalFilename;

        let newPath = path.join(targetDir, originalName);
        if (fs.existsSync(newPath)) {
          const ext = path.extname(originalName);
          const name = path.basename(originalName, ext);
          newName = `${name}_copy_${Date.now()}${ext}`;
          newPath = path.join(targetDir, newName);
        }

        try {
          fs.renameSync(oldPath, newPath);
        } catch (error) {
          console.error('Error moving file', error);
        }
      });

      res.redirect('/?path=' + uploadPath);
    });
  } catch (error) {
    renderError(res, 'Error handling upload', error.message);
  }
}

module.exports = {
  uploadController,
};
