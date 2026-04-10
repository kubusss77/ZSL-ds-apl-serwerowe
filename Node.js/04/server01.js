import { createServer } from 'http';

const logger = (req) => {
  if (req.url === '/') {
    console.log(`[${new Date().toLocaleTimeString()}] GET na /`);
  } else if (req.url === '/error') {
    console.error(`[${new Date().toLocaleTimeString()}] BŁĄD: na /error`);
  }
};

const server = createServer((req, res) => {
  logger(req); // Ręczne wywołanie middleware
  res.end('Logger zadziałał - zobacz konsolę serwera');
});

server.listen(3000, () => console.log('start'));
