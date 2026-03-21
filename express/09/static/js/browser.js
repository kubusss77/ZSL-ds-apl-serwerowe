const currentPath = document.querySelector('main.browser').getAttribute('data-path');

const textEditorExtensions = ['.txt', '.html', '.css', '.js', '.json'];
const imageEditorExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];

function toggleButtons() {
  const buttons = document.getElementsByClassName('buttons')[0];
  buttons.classList.toggle('active');
}

const folders = document.getElementsByClassName('folder');
for (let folder of folders) {
  folder.addEventListener('click', () => {
    window.location.href = `?path=${currentPath}${folder.getAttribute('data-name')}/`;
  });
}

const files = document.getElementsByClassName('file');
for (let file of files) {
  file.addEventListener('click', () => openFile(file.getAttribute('data-name')));
}

function openFile(fileName) {
  if (textEditorExtensions.some((ext) => fileName.endsWith(ext))) {
    window.location.href = `/editor/text?path=${currentPath}&name=${fileName}`;
  } else if (imageEditorExtensions.some((ext) => fileName.endsWith(ext))) {
    window.location.href = `/editor/image?path=${currentPath}&name=${fileName}`;
  }
}

/**
 * Buttons - delete file
 */

const deleteFileButtons = document.getElementsByClassName('btn-delete-file');
for (let btn of deleteFileButtons) {
  btn.addEventListener('click', (event) => deleteFile(event, btn.getAttribute('data-name')));
}

function deleteFile(event, name) {
  event.stopPropagation();

  const confirmation = confirm('Are you sure you want to delete this file?');
  if (confirmation) {
    window.location.href = `/delete/file?path=${currentPath}&name=${name}`;
  }
}

/**
 * Buttons - delete folder
 */

const deleteFolderButtons = document.getElementsByClassName('btn-delete-folder');
for (let btn of deleteFolderButtons) {
  btn.addEventListener('click', (event) => deleteFolder(event, btn.getAttribute('data-name')));
}

function deleteFolder(event, name) {
  event.stopPropagation();

  const confirmation = confirm(
    'Are you sure you want to delete this folder? All files and subfolders will be deleted as well.'
  );
  if (confirmation) {
    window.location.href = `/delete/folder?path=${currentPath}&name=${name}`;
  }
}

/**
 * Drag and drop
 */

const dropZone = document.querySelector('html');

dropZone.addEventListener('dragover', (event) => {
  event.preventDefault();

  dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
  dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (event) => {
  event.preventDefault(); // Zapobiega otwarciu pliku przez przeglądarkę

  const files = event.dataTransfer.files; // Pobiera listę upuszczonych plików

  if (files.length > 0) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    formData.append('path', currentPath);

    // Wysyła pliki do serwera za pomocą fetch
    fetch('/upload', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          alert('Files uploaded successfully!');
          window.location.reload();
        } else {
          alert('Error uploading files.');
        }
      })
      .catch(() => {
        alert('Error uploading files.');
      });
  }
});
