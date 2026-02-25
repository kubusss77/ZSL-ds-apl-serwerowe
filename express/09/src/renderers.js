function renderBrowser(res, data, error) {
  res.render('browser.hbs', {
    title: 'Filemanager',
    style: 'browser',
    data,
    error,
  });
}

function renderTextEditor(res, data) {
  res.render('textEditor.hbs', {
    title: 'Filemanager - text editor',
    style: 'textEditor',
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
  renderTextEditor,
  renderImageEditor,
  renderError,
};
