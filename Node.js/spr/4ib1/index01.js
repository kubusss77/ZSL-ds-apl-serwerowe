import { createServer } from "http";
import fs from "fs";
const PORT = 3000;

const server = createServer((req, res) => {
  if (req.url === "/index01") {
    const html = fs.readFileSync("static/index01.html");
    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end(html);
  } else if (req.url === "/style.css") {
    const css = fs.readFileSync("static/style.css");
    res.writeHead(200, { "content-type": "text/css;charset=utf-8" });
    res.end(css);
  } else if (req.url.startsWith("/naprawa")) {
    const url = new URL("http://localhost" + req.url);
    const marka = url.searchParams.get("marka");
    const pilne = url.searchParams.get("pilne") == "true";

    console.log(marka, pilne);

    res.writeHead(200, { "content-type": "text/html;charset=utf-8" });
    res.end(
      `<html>
      <head><link rel="stylesheet" href="style.css" /></head>
      <body class="${pilne ? "bg-red" : "bg-green"}">
      <h1>Serwis: ${marka}</h1>
      <p>Status: <b>${pilne ? "PILNE" : "Normalny"}</b> - ${pilne ? "Czerwony alarm!" : "Zielone światło"}</p>
      <a href="/index01">Powrót</a>
      </body>
      </html>`,
    );
  }
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
