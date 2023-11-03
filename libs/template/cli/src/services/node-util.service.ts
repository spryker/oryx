import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import request from 'request';
import unzipper from 'unzipper';

export class NodeUtilService {
  constructor(
    protected _fs = fs,
    protected _path = path,
    protected _request = request,
    protected _unzipper = unzipper
  ) {}

  downloadFile(fileUrl: string, filePath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._request(fileUrl)
        .pipe(this._fs.createWriteStream(filePath, { autoClose: true }))
        .on('close', resolve)
        .on('error', (error) => this._fs.unlink(filePath, () => reject(error)));
    });
  }

  extractZip(zipFilePath: string, extractToDir: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._fs
        .createReadStream(zipFilePath)
        .pipe(this._unzipper.Extract({ path: extractToDir }))
        .on('close', resolve)
        .on('error', (err) => reject(err));
    });
  }

  copyFolder(source: string, destination: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // Create the destination directory if it doesn't exist
      if (!this._fs.existsSync(destination))
        this._fs.mkdirSync(destination, { recursive: true });

      const files = this._fs.readdirSync(source);

      for (const file of files) {
        const sourcePath = this._path.join(source, file);
        const destinationPath = this._path.join(destination, file);
        const stats = this._fs.statSync(sourcePath);

        if (stats.isDirectory()) {
          this.copyFolder(sourcePath, destinationPath)
            .then(resolve)
            .catch((error) => reject(error));
        } else this._fs.copyFileSync(sourcePath, destinationPath);
      }

      resolve();
    });
  }

  executeCommand(
    command: string,
    directory?: string,
    output = false
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const options = directory ? { cwd: directory } : undefined;

      exec(command, options, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing command: ${error}`);
          return reject(error);
        }

        if (stdout && output) console.log(`Standard Output: ${stdout}`);

        if (stderr) console.error(`Standard Error: ${stderr}`);

        resolve();
      });
    });
  }
}
