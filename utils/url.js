function normalizeUrl(input) {
  if (!input || typeof input !== 'string') return input;
  let value = input.trim();
  value = value.replace(/^`+|`+$/g, '');
  value = value.replace(/^"+|"+$/g, '');
  value = value.replace(/^'+|'+$/g, '');

  try {
    const u = new URL(value);
    const protocol = u.protocol.toLowerCase();
    const host = u.hostname.toLowerCase();
    const port = u.port;
    const isDefaultPort = (protocol === 'http:' && port === '80') || (protocol === 'https:' && port === '443');
    const pathname = u.pathname === '/' ? '' : u.pathname;
    const search = u.search || '';
    const hash = '';

    let out = `${protocol}//${host}`;
    if (port && !isDefaultPort) out += `:${port}`;
    out += pathname + search + hash;
    return out;
  } catch (e) {
    return value;
  }
}

module.exports = { normalizeUrl };