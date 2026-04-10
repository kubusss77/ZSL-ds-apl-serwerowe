import { createServer } from 'http';

const getOnly = (req, res) => {
  if (req.method !== 'GET') {
    res.writeHead(405); // Not Allowed
    res.end('Tylko GET!');
    return false; // Sygnał do przerwania
  }
  return true;
};

function authenticate(req, res) {
  if (req.method !== 'GET') {
    res.writeHead(400);
    res.end('zła metoda');
  }

  const url = new URL(req.url);

  const role = url.searchParams.get('user');

  req.isAdmin = role === admin;
}

const server = createServer((req, res) => {
  if (!getOnly(req, res)) return;
  res.end('Witaj na serwerze GET');
});
