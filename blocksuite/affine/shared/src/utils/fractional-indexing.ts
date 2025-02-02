import { generateKeyBetween } from 'fractional-indexing';

/**
 * generate a key between a and b, the result key is always satisfied with a < result < b.
 * the key always has a random suffix, so there is no need to worry about collision.
 *
 * make sure a and b are generated by this function.
 *
 * @param customPostfix custom postfix for the key, only letters and numbers are allowed
 */
export function generateFractionalIndexingKeyBetween(
  a: string | null,
  b: string | null
) {
  const randomSize = 32;
  function postfix(length: number = randomSize) {
    const chars =
      '123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(values[i] % chars.length);
    }
    return result;
  }

  if (a !== null && b !== null && a >= b) {
    throw new Error('a should be smaller than b');
  }

  // get the subkey in full key
  // e.g.
  // a0xxxx -> a
  // a0x0xxxx -> a0x
  function subkey(key: string | null) {
    if (key === null) {
      return null;
    }
    if (key.length <= randomSize + 1) {
      // no subkey
      return key;
    }
    const splitAt = key.substring(0, key.length - randomSize - 1);
    return splitAt;
  }

  const aSubkey = subkey(a);
  const bSubkey = subkey(b);

  if (aSubkey === null && bSubkey === null) {
    // generate a new key
    return generateKeyBetween(null, null) + '0' + postfix();
  } else if (aSubkey === null && bSubkey !== null) {
    // generate a key before b
    return generateKeyBetween(null, bSubkey) + '0' + postfix();
  } else if (bSubkey === null && aSubkey !== null) {
    // generate a key after a
    return generateKeyBetween(aSubkey, null) + '0' + postfix();
  } else if (aSubkey !== null && bSubkey !== null) {
    // generate a key between a and b
    if (aSubkey === bSubkey && a !== null && b !== null) {
      // conflict, if the subkeys are the same, generate a key between fullkeys
      return generateKeyBetween(a, b) + '0' + postfix();
    } else {
      return generateKeyBetween(aSubkey, bSubkey) + '0' + postfix();
    }
  }
  throw new Error('Never reach here');
}
