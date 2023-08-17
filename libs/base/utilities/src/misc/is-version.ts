export function isVersion(version: string, toCompare: string): boolean {
  if (version === 'latest') {
    return true;
  }

  const versions = version.split('.');
  const compare = toCompare.split('.');

  for (let i = 0; i < versions.length; i++) {
    const a = Number(versions[i]);
    const b = Number(compare[i]);

    if (a === b) {
      continue;
    }

    return a >= b;
  }

  return true;
}
