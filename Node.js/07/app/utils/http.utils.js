export function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
}

export function sendMessage(res, status, message) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message }));
}

export async function getJsonBody(req, required) {
  return new Promise((resolve) => {
    let body = '';

    req.on('data', (part) => {
      body += part.toString();
    });

    req.on('end', () => {
      try {
        const parsedBody = JSON.parse(body);

        if (!required) {
          resolve(parsedBody);
          return;
        }

        resolve({
          body: parsedBody,
          errors: Object.keys(required)
            .filter((k) => typeof parsedBody[k] !== required[k])
            .map((k) => `${k} (${required[k]})`),
        });
      } catch (error) {
        resolve(required ? { body: undefined, errors: [] } : undefined);
      }
    });
  });
}
