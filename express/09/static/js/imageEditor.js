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
const imgUrlPath = canvas.getAttribute('data-path');
const imgUrlName = canvas.getAttribute('data-name');

console.log(imgUrlPath, imgUrlName);

const img = new Image();
img.src = '/file/raw?path=' + imgUrlPath + '&name=' + imgUrlName;

img.onload = function () {
  // rozmiar canvasa = rozmiarowi obrazu
  canvas.width = img.width;
  canvas.height = img.height;

  // rysujemy obraz w pozycji 0,0 canvasa
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

  const filterString = appliedFilters.map((f) => `${f.name}(${f.value})`).join(' ');
  canvas.style.filter = filterString;
}

function clearFilters() {
  appliedFilters.length = 0;
  canvas.style.filter = 'none';

  document.getElementById('slider-brightness').value = 100;
  document.getElementById('slider-contrast').value = 100;
  document.getElementById('slider-hue').value = 0;
}

let isDrawing = false;
let isDrawn = false;
let startX; //  X początku prostokąta
let startY; //  Y początku prostokąta
let width;
let height;

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
  startX = mousePos.x;
  startY = mousePos.y;
  isDrawing = true; // rozpoczęto rysowanie
});

// mousemove nad canvasem
canvas.addEventListener('mousemove', function (e) {
  if (!isDrawing) return;

  const mousePos = getMousePos(canvas, e);
  const currentX = mousePos.x; //  pozycja X myszy
  const currentY = mousePos.y; //  pozycja Y myszy

  //  szerokość i wysokość rysowanego prostokąta

  width = currentX - startX;
  height = currentY - startY;

  // Wyczyść canvas przed narysowaniem nowego prostokąta
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(img, 0, 0); // ponownie narysuj obraz

  //  styl
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';

  // Rysowanie prostokąta
  ctx.beginPath(); // start
  ctx.rect(startX, startY, width, height); //  prostokąt (x, y, szer, wys)
  ctx.stroke(); // kontur prostokąta
  ctx.fill();
});

// mouseup nad canvasem
canvas.addEventListener('mouseup', function () {
  isDrawing = false;
  isDrawn = true;
  //alert(`posX: ${startX}, posY: ${startY} `);
});

// mouseout
canvas.addEventListener('mouseout', function () {
  isDrawing = false;
});

function crop() {
  // x,y,w,h do wycięcia

  if (!isDrawn) return;

  const sourceX = startX;
  const sourceY = startY;
  const sourceWidth = width;
  const sourceHeight = height;

  // miejsce i wymiary, w których fragment ma zostać narysowany na canvasie

  const destX = 100;
  const destY = 0;
  const destWidth = width;
  const destHeight = height;

  // clear przed narysowaniem
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // rysowanie: co, skąd, gdzie
  ctx.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, destX, destY, destWidth, destHeight);
}
