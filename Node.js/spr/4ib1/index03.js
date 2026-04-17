import { createServer } from "http";
import { performance } from "perf_hooks";
import fs from "fs";
const PORT = 3000;

async function czujnik(stacja, plik) {
  const raport = fs.readFileSync("czujniki/" + plik).toString();
  const czas = Math.floor(Math.random() * 2500);

  await new Promise((resolve) => {
    setTimeout(() => resolve(), czas);
  });

  return {
    stacja,
    raport,
    czas_odczytu: czas + "ms",
  };
}

async function timeout(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(time), time);
  });
}

const server = createServer(async (req, res) => {
  const stacje = [
    czujnik("Bałtyk", "baltyk.txt"),
    czujnik("Centrum", "centrum.txt"),
    czujnik("Tatry", "tatry.txt"),
    timeout(800),
  ];

  let race_start;
  try {
    race_start = performance.now();
    const najszybszy = await Promise.race(stacje);

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        status: "OK",
        dane: najszybszy,
      }),
    );

    console.log("najszybszy", najszybszy);
  } catch (err) {
    const race_end = performance.now();

    res.writeHead(200, { "Content-Type": "application/json; charset=utf-8" });
    res.end(
      JSON.stringify({
        status: "TIMEOUT",
        info: {
          error: "The day after tomorrow",
          czas_trwania_race: Math.floor(race_end - race_start),
        },
      }),
    );

    console.log("timeout", err);
  }
  res.end();
});

server.listen(3000, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
