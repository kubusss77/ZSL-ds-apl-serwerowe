// obiekt canvas i obiekt context na którym wykonywane są operacje graficzne
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

const img = new Image();
img.src = 'https://drytooling.pl/images/artykuly/gory/mount-everest/mount-everest3.jpg';

img.onload = function () {
  // rozmiar canvasa = rozmiarowi obrazu
  canvas.width = img.width;
  canvas.height = img.height;

  // rysujemy obraz w pozycji 0,0 canvasa
  ctx.drawImage(img, 0, 0);
};

function applyFilter(filter) {
  console.log(filter);
  canvas.style.filter = filter;
}
