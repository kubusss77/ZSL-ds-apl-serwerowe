import { createServer } from 'http';
import { route } from './app/router.js';

createServer(async (req, res) => await route(req, res)).listen(3000, () => console.log('Server on port 3000'));
