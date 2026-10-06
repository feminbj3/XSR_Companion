// BLE values arrive base64-encoded; this shows them as readable hex bytes.
const T = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
export function b64ToHex(b64) {
  if (!b64) return '(empty)';
  let bits = 0, val = 0;
  const out = [];
  for (const c of b64.replace(/=+$/, '')) {
    val = (val << 6) | T.indexOf(c);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      out.push(((val >> bits) & 255).toString(16).padStart(2, '0'));
      val &= (1 << bits) - 1;
    }
  }
  return out.join(' ');
}
