import { createServer } from "http";
import fs from "fs";
const PORT = 3000;

function checkMethod(req) {
  return req.method === "POST";
}

function checkHeader(req) {
  return req.headers["x-device-id"] === "HUB_V3";
}

const server = createServer((req, res) => {
  if (req.url !== "/update-device") {
    res.writeHead(404, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        error: "Nie odnaleziono zasobu",
      }),
    );
  } else if (!checkMethod(req)) {
    res.writeHead(405, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        error: "Metoda niedozwolona. Użyj POST",
      }),
    );
  } else if (!checkHeader(req)) {
    res.writeHead(401, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        error: "Nieautoryzowane urządzenie",
      }),
    );
  } else {
    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        status: "Dostęp przyznany",
        info: "HUB_V3 połączony",
      }),
    );
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
