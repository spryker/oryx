import { copyFile } from 'fs';

const files = ['package.json', 'README.md'];

for (let i = 0; i < files.length; i++) {
  copyFile(files[i], `../../dist/libs/lit-rxjs/${files[i]}`, (error) => {
    if (error) {
      throw error;
    }
  });
}
