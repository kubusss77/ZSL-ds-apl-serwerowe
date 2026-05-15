import { add, getAll, get } from './controller.js';
import getRequestData from './utils.js';

const router = async (request, response) => {
  const { method, url } = request;

  // utworzenie nowego taska
  if (url == '/api/tasks' && method == 'POST') {
    // odczytaj dane z body
    let data = JSON.parse(await getRequestData(request));
    console.log(data);
    // użyj odpowiedniej funkcji z controllera
    add(data);
    // odpowiedz do klienta
    response.writeHead(201, { 'Content-Type': 'application/json;charset=utf-8' });
    response.end(JSON.stringify({ status: 201, data }));
  }

  // pobranie wszystkich tasków
  else if (url == '/api/tasks' && method == 'GET') {
    response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8' });
    response.end(JSON.stringify({ status: 200, data: getAll() }));
  }

  // pobranie jednego wg id
  else if (url.match(/\/api\/tasks\/([0-9]+)/) && method == 'GET') {
    const id = Number(url.split('/')[3]);

    const data = get(id);

    response.writeHead(data.status, { 'Content-Type': 'application/json;charset=utf-8' });
    response.end(JSON.stringify(data));
  }

  // usunięcie jednego taska wg id
  else if (url.match(/\/api\/tasks\/([0-9]+)/) && method == 'DELETE') {
  }

  // aktualizacja jednego taska wg id
  else if (url == '/api/tasks' && method == 'PATCH') {
  }
};

export default router;
