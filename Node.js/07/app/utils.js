export function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function sendError(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
}

export async function getJsonBody(req) {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (part) => {
      body += part.toString();
    });

    req.on('end', () => {
      try {
        console.log('end');
        resolve(JSON.parse(body));
      } catch (error) {
        resolve();
      }
    });
  });
}
