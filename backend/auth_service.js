// User Authentication & JWT Session Engine
const crypto = require('crypto');
const db = require('./db');

const JWT_SECRET = process.env.JWT_SECRET || 'ldoc_jwt_secure_access_secret_2026';

function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, origHash] = (storedHash || '').split(':');
  if (!salt || !origHash) return false;
  const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return verifyHash === origHash;
}

function signToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify({
    ...payload,
    exp: Math.floor(Date.now() / 1000) + (30 * 24 * 3600)
  })).toString('base64url');
  const sig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

function verifyToken(token) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, body, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', JWT_SECRET).update(`${header}.${body}`).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch (err) { return null; }
}

async function register({ email, password, name }) {
  if (!email || !email.includes('@')) throw new Error('Valid email required');
  if (!password || password.length < 6) throw new Error('Password must be at least 6 characters');

  const existing = await db.users.findByEmail(email);
  if (existing) throw new Error('User with this email already exists');

  const password_hash = hashPassword(password);
  const user = await db.users.create({ email, password_hash, name });
  const token = signToken({ id: user.id, email: user.email, plan: user.plan });
  return { ok: true, token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } };
}

async function login({ email, password }) {
  const user = await db.users.findByEmail(email);
  if (!user || !verifyPassword(password, user.password_hash)) {
    throw new Error('Invalid email or password');
  }
  const token = signToken({ id: user.id, email: user.email, plan: user.plan });
  return { ok: true, token, user: { id: user.id, email: user.email, name: user.name, plan: user.plan } };
}

module.exports = { register, login, verifyToken, signToken };
