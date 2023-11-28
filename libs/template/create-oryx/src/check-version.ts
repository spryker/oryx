import * as https from 'https';
import pkg from '../package.json';

function latestVersion(packageName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = `https://registry.npmjs.org/${packageName}`;

    https
      .get(url, (res) => {
        let rawData = '';

        res.on('data', (chunk) => {
          rawData += chunk;
        });
        res.on('end', () => {
          try {
            const parsedData = JSON.parse(rawData);
            resolve(parsedData['dist-tags'].latest);
          } catch (e: any) {
            reject(e.message);
          }
        });
      })
      .on('error', (e) => {
        console.log('error');
        reject(e.message);
      });
  });
}

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
