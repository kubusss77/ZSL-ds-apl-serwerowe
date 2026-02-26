const fs = require('fs');
const path = require('path');
const { FILES_DIR } = require('../../server');
const { renderError } = require('../../renderers');
const { fileExample } = require('../../exampleFileContent');

function newFolderController(req, res) {
  try {
    const folderPath = req.body.path || '';
    const folderName = req.body.name;

    if (!folderPath) {
      res.redirect('/?path=/&error_type=folder&error_message=path_required');
      return;
    }

    if (!folderName) {
      res.redirect('/?path=' + folderPath + '&error_type=folder&error_message=name_required');
      return;
    }

    if (folderPath.includes('..') || folderName.includes('..')) {
      res.redirect('/?path=' + folderPath + '&error_type=folder&error_message=folder_invalid_name');
      return;
    }

    const folderNameRegExp = /^[a-zA-Z0-9_+.-]+$/;
    if (!folderNameRegExp.test(folderName)) {
      res.redirect('/?path=' + folderPath + '&error_type=folder&error_message=folder_invalid_name');
      return;
    }

    const absPath = path.join(FILES_DIR, req.user, folderPath, folderName);
    if (fs.existsSync(absPath)) {
      res.redirect('/?path=' + folderPath + '&error_type=folder&error_message=folder_exists');
      return;
    }

    fs.mkdirSync(absPath);

    res.redirect('/?path=' + folderPath);
  } catch (error) {
    renderError(res, 'Error adding folder', error.message);
  }
}

function newFileController(req, res) {
  try {
    const filePath = req.body.path;
    const fileName = req.body.name;
    const fileExtension = req.body.extension;

    if (!filePath) {
      res.redirect('/?path=/&error_type=file&error_message=path_required');
      return;
    }

    if (!fileName) {
      res.redirect('/?path=' + filePath + '&error_type=file&error_message=name_required');
      return;
    }

    if (!fileExtension) {
      res.redirect('/?path=' + filePath + '&error_type=file&error_message=file_extension_required');
      return;
    }

    if (filePath.includes('..') || fileName.includes('..') || fileExtension.includes('..')) {
      res.redirect('/?path=' + filePath + '&error_type=file&error_message=file_invalid_name');
      return;
    }

    const fileNameRegExp = /^[a-zA-Z0-9_+.-]+$/;
    if (!fileNameRegExp.test(fileName)) {
      res.redirect('/?path=' + filePath + '&error_type=file&error_message=file_invalid_name');
      return;
    }

    const absPath = path.join(FILES_DIR, req.user, filePath, fileName + fileExtension);
    if (fs.existsSync(absPath)) {
      res.redirect('/?path=' + filePath + '&error_type=file&error_message=file_exists');
      return;
    }

    fs.writeFileSync(absPath, fileExample[fileExtension] || '');
    res.redirect('/?path=' + filePath);
  } catch (error) {
    renderError(res, 'Error adding file', error.message);
  }
}

module.exports = {
  newFolderController,
  newFileController,
};
