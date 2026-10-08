const { promisify } = require('node:util');
const {
  randomBytes,
  scrypt: scryptCallback,
  timingSafeEqual
} = require('node:crypto');

const scrypt = promisify(scryptCallback);

const COST = 2 ** 17;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 256 * 1024 * 1024;

async function deriveKey(password, salt) {
  return scrypt(password, salt, KEY_LENGTH, {
    N: COST,
    r: BLOCK_SIZE,
    p: PARALLELIZATION,
    maxmem: MAX_MEMORY
  });
}

async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);

  return [
    'scrypt',
    COST,
    BLOCK_SIZE,
    PARALLELIZATION,
    salt.toString('hex'),
    key.toString('hex')
  ].join('$');
}

async function verifyPassword(password, storedHash) {
  if (typeof password !== 'string' || typeof storedHash !== 'string') {
    return false;
  }

  const parts = storedHash.split('$');
  if (parts.length !== 6) return false;

  const [algorithm, cost, blockSize, parallelization, saltHex, keyHex] = parts;

  if (
    algorithm !== 'scrypt' ||
    Number(cost) !== COST ||
    Number(blockSize) !== BLOCK_SIZE ||
    Number(parallelization) !== PARALLELIZATION ||
    !/^[a-f0-9]{32}$/i.test(saltHex) ||
    !/^[a-f0-9]{128}$/i.test(keyHex)
  ) {
    return false;
  }

  const expectedKey = Buffer.from(keyHex, 'hex');
  const actualKey = await deriveKey(password, Buffer.from(saltHex, 'hex'));

  return timingSafeEqual(actualKey, expectedKey);
}

module.exports = { hashPassword, verifyPassword };