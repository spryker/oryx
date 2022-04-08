import { Dirent, readdirSync } from 'fs';

export interface LibOptions {
  cwd?: string;
  exclude?: string[];
}

export const libDirsNormalizer = (
  options: LibOptions,
  callback: (dir: Dirent) => void
) => {
  const dirs = readdirSync(options.cwd, { withFileTypes: true });

  for (let i = 0; i < dirs.length; i++) {
    const dir = dirs[i];

    if (
      !dir.isDirectory() ||
      options.exclude?.includes(dir.name) ||
      dir.name.startsWith('.')
    ) {
      continue;
    }

    callback(dir);
  }
};
