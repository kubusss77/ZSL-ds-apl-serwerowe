import { createServer } from 'http';
import fs from 'fs';
const PORT = 3000;

function sprawdzSystem() {
  const timeout = 500 + Math.random() * 2500;

  return new Promise((resolve, reject) => {
    if (timeout > 2500) {
      setTimeout(() => reject(timeout), timeout);
    } else {
      setTimeout(() => resolve(timeout), timeout);
    }
  });
}

const server = createServer(async (req, res) => {
  if (req.url === '/pobierz-oferty') {
    let promises;
    try {
      promises = await Promise.all([sprawdzSystem(), sprawdzSystem(), sprawdzSystem()]);
      console.log(promises);

      res.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
      res.end(JSON.stringify({ status: 'Sukces', oferty: promises }));
    } catch (err) {
      console.log(err);
      res.writeHead(500, { 'Content-Type': 'application/json;charset=utf-8' });
      res.end(JSON.stringify({ status: 'Błąd krytyczny', powod: err }));
    }
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
