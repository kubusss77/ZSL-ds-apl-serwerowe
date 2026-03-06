const filtersDiv = document.getElementById('filters-box');
function toggleFilters() {
  if (filtersDiv.style.display === 'block') {
    filtersDiv.style.display = 'none';
  } else {
    filtersDiv.style.display = 'block';
  }
}

// obiekt canvas i obiekt context na którym wykonywane są operacje graficzne
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const imgPath = canvas.getAttribute('data-path');
const imgName = canvas.getAttribute('data-name');

const img = new Image();
img.src = '/file/raw?path=' + imgPath + '&name=' + imgName;

img.onload = function () {
  // rozmiar canvasa = rozmiarowi obrazu
  canvas.width = img.width;
  canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
};

const appliedFilters = [];

function applyFilter(filter, value) {
  if (appliedFilters.some((f) => f.name === filter)) {
    const existingFilter = appliedFilters.find((f) => f.name === filter);
    existingFilter.value = value;
  } else {
    appliedFilters.push({ name: filter, value });
  }

  redrawImage();
}

function clearFilters() {
  appliedFilters.length = 0;
  ctx.filter = 'none';

  document.getElementById('slider-brightness').value = 100;
  document.getElementById('slider-contrast').value = 100;
  document.getElementById('slider-hue').value = 0;

  redrawImage();
}

let isDrawing = false;
let drawingStartX; //  X początku prostokąta
let drawingStartY; //  Y początku prostokąta
let drawnRectWidth;
let drawnRectHeight;

let cropStartX; //  X początku obszaru do wycięcia
let cropStartY; //  Y początku obszaru do wycięcia

let imgStartX = 0;
let imgStartY = 0;

function redrawImage() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.filter = appliedFilters.map((f) => `${f.name}(${f.value})`).join(' ');
  ctx.drawImage(img, imgStartX, imgStartY, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
}

// pozycja myszy względem kontenera canvas

function getMousePos(canvas, evt) {
  const rect = canvas.getBoundingClientRect(); // rozmiar i pozycję canvasu
  return {
    x: evt.clientX - rect.left, //  X myszy minus odległość lewej krawędzi canvasu od lewej krawędzi okna
    y: evt.clientY - rect.top, //  Y myszy minus odległość górnej krawędzi canvasu od górnej krawędzi okna
  };
}

// mousedown na canvasie

canvas.addEventListener('mousedown', function (e) {
  const mousePos = getMousePos(canvas, e);
  drawingStartX = mousePos.x;
  drawingStartY = mousePos.y;
  isDrawing = true; // rozpoczęto rysowanie
});

// mousemove nad canvasem

canvas.addEventListener('mousemove', function (e) {
  if (!isDrawing) return;

  const mousePos = getMousePos(canvas, e);
  const currentX = mousePos.x; //  pozycja X myszy
  const currentY = mousePos.y; //  pozycja Y myszy

  //  szerokość i wysokość rysowanego prostokąta

  const width = currentX - drawingStartX;
  const height = currentY - drawingStartY;

  drawnRectWidth = width;
  drawnRectHeight = height;

  // Wyczyść canvas przed narysowaniem nowego prostokąta

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Ponownie narysuj obraz

  ctx.drawImage(img, imgStartX * -1, imgStartY * -1);

  //  styl
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(96, 96, 96, 0.5)';

  // Rysowanie prostokąta

  ctx.beginPath(); // start
  ctx.setLineDash([10, 10]);
  ctx.rect(drawingStartX, drawingStartY, width, height); //  prostokąt (x, y, szer, wys)
  ctx.fill(); // wypełnienie prostokąta
  ctx.stroke(); // kontur prostokąta
});

// Użytkownik kończy zaznaczanie obszaru
canvas.addEventListener('mouseup', finishDrawing);
canvas.addEventListener('mouseout', finishDrawing);

function finishDrawing() {
  isDrawing = false;

  cropStartX = drawnRectWidth < 0 ? drawingStartX + drawnRectWidth : drawingStartX;
  cropStartY = drawnRectHeight < 0 ? drawingStartY + drawnRectHeight : drawingStartY;
}

function crop() {
  if (!drawnRectWidth || !drawnRectHeight) {
    alert('Please draw a rectangle to crop the image.');
    return;
  }
  // x,y,w,h do wycięcia

  imgStartX += cropStartX;
  imgStartY += cropStartY;

  const sourceX = imgStartX;
  const sourceY = imgStartY;
  const sourceWidth = Math.abs(drawnRectWidth);
  const sourceHeight = Math.abs(drawnRectHeight);

  canvas.width = sourceWidth;
  canvas.height = sourceHeight;

  // miejsce i wymiary, w których fragment ma zostać narysowany na canvasie

  const destX = 0;
  const destY = 0;
  const destWidth = sourceWidth;
  const destHeight = sourceHeight;

  // clear przed narysowaniem

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // rysowanie: co, skąd, gdzie

  redrawImage();
}

function cancelEdits() {
  drawnRectWidth = 0;
  drawnRectHeight = 0;
  cropStartX = 0;
  cropStartY = 0;
  imgStartX = 0;
  imgStartY = 0;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.width = img.width;
  canvas.height = img.height;
  ctx.drawImage(img, 0, 0);
}

function saveImage() {
  // url servera i endpoint dla post-a
  const serverUrl = '/editor/image';

  // pusty canvas

  if (!canvas.width || !canvas.height) {
    alert('Empty image cannot be saved.');
    return;
  }

  // Konwertuj zawartość canvasa do obiektu Blob (np. w formacie PNG)
  // Drugi argument to format (domyślnie 'image/png'), trzeci to jakość (dla JPEG/WebP, 0-1)

  canvas.toBlob(function (blob) {
    // form data
    const formData = new FormData();

    // append: wysyłamy blob czyli plik oraz dodatkowe pole formularza, np. podające serwerowi gdzie i pod jaką nazwą zapisać plik
    formData.append('blob', blob, 'image.png'); // pole form-a, obiekt Blob, nazwa pliku
    formData.append('path', imgPath);
    formData.append('name', imgName);

    // fetch

    fetch(serverUrl, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return { status: 'problem z serwerem - nie zwrócił statusu 200' };
        }
        return response.json();
      })
      .then((data) => {
        //jest ok
        if (data.status == 'ok') {
          alert('Image saved successfully');
        } else {
          alert('Error saving image: ' + data.status);
        }
      })
      .catch((error) => {
        // error
        alert('Error saving image: ' + error.message);
      });
  }, 'image/jpeg');
}
