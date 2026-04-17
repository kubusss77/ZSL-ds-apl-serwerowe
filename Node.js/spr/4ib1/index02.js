import { createServer } from "http";
import fs from "fs";
const PORT = 3000;

const server = createServer((req, res) => {
  if (req.url === "/index02") {
    const html = fs.readFileSync("static/index02.html");
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end(html);
  } else if (req.url === "/dodaj-ksiazke") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const dane = JSON.parse(body);
      console.log(dane);

      const biblioteka = JSON.parse(fs.readFileSync("biblioteka.json"));
      biblioteka.ksiazki.push({
        tytul: dane.tytul,
        autor: dane.autor,
        dodano: dane.data_dodania,
      });

      fs.writeFileSync("biblioteka.json", JSON.stringify(biblioteka, null, 2));

      const statystyki = {
        pozycji: biblioteka.ksiazki.length,
        czas_raportu: new Date(Date.now()).toLocaleString(),
      };

      res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
      res.end(
        JSON.stringify({
          nowa_ksiazka: dane,
          wszystkie_ksiazki: biblioteka.ksiazki,
          statystyki,
        }),
      );
    });
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
