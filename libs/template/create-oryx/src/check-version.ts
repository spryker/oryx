import latestVersion from 'latest-version';
import pkg from '../package.json';

export async function checkLatestVersion(): Promise<void> {
  const currentVersion = pkg.version;
  const packageName = pkg.name;

  try {
    const latest = await latestVersion(packageName);

    if (currentVersion !== latest) {
      console.warn(
        `Warning: You are using ${packageName} version ${currentVersion}, but version ${latest} is available. Consider updating to the latest version.`
      );
    }
    // eslint-disable-next-line no-empty
  } catch (e) {}
}
