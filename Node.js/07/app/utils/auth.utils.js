import { users, tokensBlacklist } from '../model.js';
import { verifyJwt } from './crypto.utils.js';

export async function getAuthorizedUserFromToken(token) {
  if (!token || tokensBlacklist.some((item) => item.token === token)) {
    return undefined;
  }

  const payload = await verifyJwt(token);

  if (!payload || typeof payload.sub !== 'number') {
    return undefined;
  }

  return users.find((user) => user.id === payload.sub);
}
