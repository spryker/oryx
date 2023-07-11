import { exec } from 'child_process';

export const onSuccess = ({ inputs }) => {
  const { path } = inputs;
  const deployURL = process.env.DEPLOY_PRIME_URL;

  if (!path || !deployURL) {
    console.error('path or deployURL are not valid, check you inputs');
    console.log('path: ', path);
    console.log('deployURL: ', deployURL);
    return;
  }

  const url = `${deployURL}/${path}`;

  sendGetRequest(url);
};

function sendGetRequest(url) {
  console.log('Sending GET request to: ', url);

  exec(`curl -v -i ${url}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`error: ${error.message}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout:\n${stdout}`);
  });
}
