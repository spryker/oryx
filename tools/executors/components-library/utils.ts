import { Dirent, readdirSync, readFileSync } from 'fs';

export interface LibOptions {
  cwd?: string;
  exclude?: string[];
}

export const libDirsNormalizer = (
  options: LibOptions,
  callback: (dir: Dirent) => void
) => {
  const dirs = readdirSync(options.cwd, { withFileTypes: true });
  const globalIgnoreStr = readFileSync('.buildignore', { encoding: 'utf8' });
  const globalIgnore = globalIgnoreStr
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '' && line.charAt(0) !== '#');

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];

    if (
      !dir.isDirectory() ||
      [...(options?.exclude ?? []), ...globalIgnore]?.includes(dir.name)
    ) {
      continue;
    }

    callback(dir);
  }
};
