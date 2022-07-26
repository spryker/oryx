import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { join } from 'path';

export interface LibOptions {
  cwd?: string;
  exclude?: string[];
}

export interface DirData {
  name: string;
  path?: string;
}

export const libDirsNormalizer = (
  options: LibOptions,
  callback: (dir: DirData) => void
) => {
  const dirs: (string | DirData)[] = readdirSync(options.cwd);
  const globalIgnoreStr = readFileSync('.buildignore', { encoding: 'utf8' });
  const globalIgnore = globalIgnoreStr
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '' && line.charAt(0) !== '#');
  const generated = {};

  while (dirs.length) {
    const dir = dirs[0];
    const dirData =
      typeof dir === 'string'
        ? {
            name: dir,
            path: dir,
          }
        : {
            name: dir.name,
            path: `${dir.path}/${dir.name}`,
          };
    const dirFullPath = join(options.cwd, dirData.path);

    if (
      !lstatSync(dirFullPath).isDirectory() ||
      [...(options?.exclude ?? []), ...globalIgnore]?.includes(dirData.name) ||
      generated[dirData.name]
    ) {
      dirs.shift();

      continue;
    }

    if (existsSync(`${dirFullPath}/index.ts`)) {
      generated[dirData.name] = true;
      callback(dirData);
      dirs.shift();

      continue;
    }

    const nestedDirs = readdirSync(dirFullPath);

    for (let i = 0; i < nestedDirs.length; i++) {
      dirs.push({
        name: nestedDirs[i],
        path: dirData.path,
      });
    }

    dirs.shift();
  }
};

export const sortObjectByKeys = <T extends Record<string, unknown>>(
  source: T
): T => {
  return Object.keys(source)
    .sort()
    .reduce(
      (obj, key) => ({
        ...obj,
        [key]: source[key],
      }),
      {}
    ) as T;
};
