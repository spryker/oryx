import { TemplateResult } from 'lit';

const NODE_MODE = false;

// Number of 32 bit elements to use to create template digests
const digestSize = 2;
// We need to specify a digest to use across rendering environments. This is a
// simple digest build from a DJB2-ish hash modified from:
// https://github.com/darkskyapp/string-hash/blob/master/index.js
// It has been changed to an array of hashes to add additional bits.
// Goals:
//  - Extremely low collision rate. We may not be able to detect collisions.
//  - Extremely fast.
//  - Extremely small code size.
//  - Safe to include in HTML comment text or attribute value.
//  - Easily specifiable and implementable in multiple languages.
// We don't care about cryptographic suitability.

function sortedStringify(obj: any): string {
  return JSON.stringify(obj, (key, value) =>
    typeof value === 'object' && value !== null
      ? Object.keys(value)
          .sort()
          .reduce((sorted: any, key: string) => {
            sorted[key] = value[key];
            return sorted;
          }, {})
      : value
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const digestForTemplateValues = (templateResult: TemplateResult) => {
  // we don't have to cover cases where there are no values, as it should be catched by default lit checks
  if (!templateResult || !templateResult.values?.length) return undefined;
  const hashes = new Uint32Array(digestSize).fill(5381);

  // Workaround: add values to the digest
  for (const s of templateResult.values) {
    const z = sortedStringify(s) ?? '';
    for (let i = 0; i < z.length; i++) {
      hashes[i % digestSize] = (hashes[i % digestSize] * 33) ^ z.charCodeAt(i);
    }
  }

  const str = String.fromCharCode(...new Uint8Array(hashes.buffer));
  // Use `btoa` in browsers because it is supported universally.
  //
  // In Node, we are sometimes executing in an isolated VM context, which means
  // neither `btoa` nor `Buffer` will be globally available by default (also
  // note that `btoa` is only supported in Node 16+ anyway, and we still support
  // Node 14). Instead of requiring users to always provide an implementation
  // for `btoa` when they set up their VM context, we instead inject an import
  // for `Buffer` from Node's built-in `buffer` module in our Rollup config (see
  // note at the top of this file), and use that.
  return NODE_MODE ? Buffer.from(str, 'binary').toString('base64') : btoa(str);
};
