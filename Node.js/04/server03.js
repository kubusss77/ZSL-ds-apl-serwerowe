import { createServer } from 'http';

const prepareMetadata = (req) => {
  // tworzymy na start jeden obiekt meta z pottrzebnymi potem danymi
  req.meta = {
    timestamp: Date.now(),
    ip: req.socket.remoteAddress,
    method: req.method,
    url: req.url,
  };

  const agent = req.headers['user-agent'];

  const isPowerShell = agent.includes('WindowsPowerShell');

  if (isPowerShell) {
    throw new Error('Dostęp przez terminal PowerShell jest zabroniony!');
  }
  req.client = {
    agent,
    isPowerShell,
    isBrowser: !isPowerShell,
  };
};

const logger = (req, err = null) => {
  const { timestamp, ip, url } = req.meta;
  const time = new Date(timestamp).toLocaleTimeString();

  if (err) {
    console.error(
      `[${time}] BLOKADA | IP ${ip} | Agent: PowerShell | Powód: Dostęp przez terminal PowerShell jest zabroniony!`
    );
  } else {
    console.log(`[${time}] OK | GET ${url} | Client: Przeglądarka`);
  }
};

const server = createServer((req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    prepareMetadata(req);
    logger(req);

    const response = {
      status: 'Sukces',
      message: 'Witaj na serwerze',
      twoje_metadata: req.meta,
      client: req.client,
    };

    res.end(JSON.stringify(response));
  } catch (err) {
    logger(req, err);
    res.statusCode = 403;

    const response = {
      status: 'Błąd',
      error: err.message,
      timestamp: req.meta.timestamp,
    };
    res.end(JSON.stringify(response));
  }
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Serwer działa na http://localhost:3000');
});
