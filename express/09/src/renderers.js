function renderBrowser(res, data, error) {
  res.render('browser.hbs', {
    title: 'Filemanager',
    style: 'browser',
    data,
    error,
  });
}

function renderEditor(res, data) {
  res.render('editor.hbs', {
    title: 'Filemanager - editor',
    style: 'editor',
    data,
  });
}

function renderImageEditor(res, data) {
  res.render('imageEditor.hbs', {
    title: 'Filemanager - image editor',
    style: 'imageEditor',
    data,
  });
}

function renderError(res, message, details) {
  res.render('error.hbs', {
    title: 'Filemanager error',
    style: 'error',
    message,
    details,
  });
}

module.exports = {
  renderBrowser,
  renderEditor,
  renderImageEditor,
  renderError,
};
