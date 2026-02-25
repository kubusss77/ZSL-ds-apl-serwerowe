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

function biggerFont() {
  const style = window.getComputedStyle(textarea, null).getPropertyValue('font-size');
  const currentSize = parseFloat(style);
  textarea.style.fontSize = currentSize + 2 + 'px';
  lineNumbers.style.fontSize = currentSize + 2 + 'px';
}

function smallerFont() {
  const style = window.getComputedStyle(textarea, null).getPropertyValue('font-size');
  const currentSize = parseFloat(style);
  if (currentSize > 6) {
    textarea.style.fontSize = currentSize - 2 + 'px';
    lineNumbers.style.fontSize = currentSize - 2 + 'px';
  } else {
    alert('Font size cannot be smaller than 6px');
  }
}

const colorInput = document.getElementById('input-color');
colorInput.addEventListener('input', changeColor);

function changeColor() {
  const color = colorInput.value;
  textarea.style.background = color;
}

function saveConfig() {
  const data = new URLSearchParams();

  data.append('backgroundColor', textarea.style.background);

  const fontSize = window.getComputedStyle(textarea, null).getPropertyValue('font-size');
  data.append('fontSize', fontSize);

  fetch('/config', {
    method: 'POST',
    // body: data (URLSearchParams) is automatically set to application/x-www-form-urlencoded
    body: data,
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Config saved:', data);
    })
    .catch((error) => {
      console.error('Error saving config:', error);
    });
}

// load config on page load
window.addEventListener('load', () => {
  fetch('/config')
    .then((response) => response.json())
    .then((data) => {
      if (data.backgroundColor) {
        textarea.style.background = data.backgroundColor;
      }
      if (data.fontSize) {
        textarea.style.fontSize = data.fontSize;
        lineNumbers.style.fontSize = data.fontSize;
      }
    })
    .catch((error) => {
      console.error('Error loading config:', error);
    });
});
