const fs = require('fs');
const path = require('path');
const { FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');
const { fileExample } = require('../../exampleFileContent');

function newFolderController(req, res) {
  try {
    const folderPath = req.body.path || '';
    const name = req.body.name;

    if (name === '') {
      res.redirect(
        '/?path=' + encodeURIComponent(folderPath || '/') + '&error_type=folder&error_message=name_required'
      );
      return;
    }

    const absPath = path.join(FILES_DIR, folderPath, name);
    if (fs.existsSync(absPath)) {
      res.redirect(
        '/?path=' + encodeURIComponent(folderPath || '/') + '&error_type=folder&error_message=folder_exists'
      );
      return;
    }

    fs.mkdirSync(absPath);
    res.redirect('/?path=' + encodeURIComponent(folderPath));
  } catch (error) {
    renderError(res, 'Error adding folder', error.message);
  }
}

function newFileController(req, res) {
  try {
    const filePath = req.body.path || '';
    const name = req.body.name;
    const extension = req.body.extension;

    if (name === '') {
      res.redirect('/?path=' + encodeURIComponent(filePath || '/') + '&error_type=file&error_message=name_required');
      return;
    }

    if (!extension) {
      res.redirect(
        '/?path=' + encodeURIComponent(filePath || '/') + '&error_type=file&error_message=file_extension_required'
      );
      return;
    }

    const fileNameRegExp = /^[a-zA-Z0-9_+.]+$/;
    if (!fileNameRegExp.test(name)) {
      res.redirect(
        '/?path=' + encodeURIComponent(filePath || '/') + '&error_type=file&error_message=file_invalid_name'
      );
      return;
    }

    // if (!name.includes('.')) {
    //   res.redirect(
    //     '/?path=' + encodeURIComponent(filePath || '/') + '&error_type=file&error_message=file_extension_required'
    //   );
    //   return;
    // }

    const absPath = path.join(FILES_DIR, filePath, name + extension);
    if (fs.existsSync(absPath)) {
      res.redirect('/?path=' + encodeURIComponent(filePath || '/') + '&error_type=file&error_message=file_exists');
      return;
    }

    fs.writeFileSync(absPath, fileExample[extension] || '');
    res.redirect('/?path=' + encodeURIComponent(filePath));
  } catch (error) {
    renderError(res, 'Error adding file', error.message);
  }
}

module.exports = {
  newFolderController,
  newFileController,
};
