import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { APP_CONFIG } from '../constants.js';

export async function hashPassword(pass) {
  return bcrypt.hash(pass, 12);
}

export async function comparePassword(pass, hash) {
  return bcrypt.compare(pass, hash);
}

export async function signJwt(time, data) {
  return jwt.sign(data, APP_CONFIG.JWT_SECRET, { expiresIn: time });
}

export async function verifyJwt(token) {
  try {
    const payload = jwt.verify(token, APP_CONFIG.JWT_SECRET);
    return payload;
  } catch (err) {
    console.log('JWT verification error: ', err);
    return false;
  }
}

export async function decodeJwt(token) {
  return jwt.decode(token);
}
