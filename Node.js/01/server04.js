import { createServer } from 'http';
const PORT = 3000;
const server = createServer((req, res) => {
  console.log(`adres żądania: ${req.url}`);

  const agent = req.headers['user-agent'];

  let title;
  let color;
  if (agent.includes('Edg')) {
    title = 'Microsoft Edge';
    color = '#0078d7';
  } else if (agent.includes('Firefox')) {
    title = 'Firefox';
    color = '#ff9900';
  } else if (agent.includes('Chrome')) {
    title = 'Chrome';
    color = '#00bb33';
  }
  res.writeHead(200, { 'content-type': 'text/html;charset=utf-8' });
  res.end(`<h1 style="color: ${color}">${title}</h1><p>${agent}</p>`);
});

server.listen(PORT, () => {
  console.log(`serwer startuje na porcie ${PORT}`);
});
