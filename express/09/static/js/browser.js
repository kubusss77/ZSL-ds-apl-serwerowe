console.log('{{ data.currentPath }}');

const textEditorExtensions = ['.txt', '.html', '.css', '.js', '.json'];
const imageEditorExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp'];

function toggleButtons() {
  const buttons = document.getElementsByClassName('buttons')[0];
  buttons.classList.toggle('active');
}

const folders = document.getElementsByClassName('folder');
for (let folder of folders) {
  folder.addEventListener('click', () => {
    window.location.href = '?path={{ data.currentPath }}/' + folder.getAttribute('data-name');
  });
}

const files = document.getElementsByClassName('file');
for (let file of files) {
  file.addEventListener('click', () => {
    const name = file.getAttribute('data-name');
    if (textEditorExtensions.some((ext) => name.endsWith(ext))) {
      window.location.href = '/editor/text?path={{ data.currentPath }}/&name=' + name;
    } else if (imageEditorExtensions.some((ext) => name.endsWith(ext))) {
      window.location.href = '/editor/image?path={{ data.currentPath }}/&name=' + name;
    }
  });
}

const deleteFileButtons = document.getElementsByClassName('btn-delete-file');
for (let btn of deleteFileButtons) {
  btn.addEventListener('click', (event) => {
    event.stopPropagation();

    const confirmation = confirm('Are you sure you want to delete this file?');
    if (confirmation) {
      window.location.href = `/delete/file?path={{ data.currentPath }}/&name=${btn.getAttribute('data-name')}`;
    }
  });
}

const deleteFolderButtons = document.getElementsByClassName('btn-delete-folder');
for (let btn of deleteFolderButtons) {
  btn.addEventListener('click', (event) => {
    event.stopPropagation();

    const confirmation = confirm(
      'Are you sure you want to delete this folder? All files and subfolders will be deleted as well.'
    );
    if (confirmation) {
      window.location.href = `/delete/folder?path={{ data.currentPath }}/&name=${btn.getAttribute('data-name')}`;
    }
  });
}
