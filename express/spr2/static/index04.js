const img = document.getElementById('img');
const pos = document.getElementById('pos');

img.addEventListener('click', imgClick);

function imgClick(e) {
  pos.textContent = 'X: ' + e.clientX + '   Y:' + e.clientY;
  fetch('/index04', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ x: e.clientX, y: e.clientY }),
  })
    .then((response) => {
      if (!response.ok) {
        return { status: 'problem z serwerem - nie zwrócił statusu 200' };
      }
      return response.json();
    })
    .catch((error) => {
      // error
      alert('błąd podczas przesyłania: ' + error.message);
    });
}
