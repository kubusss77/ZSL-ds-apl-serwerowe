const textarea = document.getElementById('file-content');
const lineNumbers = document.querySelector('.line-numbers');

function updateLineNumbers() {
  const lines = textarea.value.split('\n').length;

  let linesArray = [];
  for (let i = 0; i < lines; i++) {
    linesArray.push(i + 1);
  }
  lineNumbers.innerHTML = linesArray.join('<br>');
}

textarea.addEventListener('keyup', updateLineNumbers);
updateLineNumbers();
