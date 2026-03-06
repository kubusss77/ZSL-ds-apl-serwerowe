function fetchButton() {
  fetch('/index03/json', {
    method: 'GET',
  })
    .then((response) => {
      if (!response.ok) {
        return { status: 'problem z serwerem - nie zwrócił statusu 200' };
      }
      return response.json();
    })

    .then((json) => {
      //jest ok
      console.log(json);

      draw(json.data);
    })
    .catch((error) => {
      // error
      alert('błąd podczas przesyłania: ' + error.message);
    });

  function draw(data) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    data.forEach((circle) => {
      ctx.strokeStyle = circle.color;
      ctx.lineWidth = 2;

      ctx.beginPath();
      ctx.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI);
      ctx.stroke();
    });
  }
}
