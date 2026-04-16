import { createServer } from 'http';
import fs from 'fs';
const PORT = 3000;

const server = createServer((req, res) => {
  if (req.url === '/index02') {
    const file = fs.readFileSync('static/index02.html');
    res.writeHead(200, { 'Content-Type': 'text/html;charset=utf-8' });
    res.end(file);
  } else if (req.url == '/') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const json = JSON.parse(body);
      console.log(json);

      const armia = JSON.parse(fs.readFileSync('armia.json'));
      armia.push(json);

      fs.writeFileSync('armia.json', JSON.stringify(armia));

      const rekruci = [];
      let liczbaOsob = armia.length;
      let lacznaSila = 0;

      for (let i = 0; i < liczbaOsob; i++) {
        const dane = armia[i];
        rekruci.push(dane.rekrut);
        lacznaSila += dane.sila;
      }

      let sredniaSila = (lacznaSila / liczbaOsob).toFixed(2);

      res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
      res.end(JSON.stringify({ armia: rekruci, statystyki: { liczbaOsob, sredniaSila } }));
    });
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
