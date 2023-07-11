import { exec } from 'child_process';

export const onSuccess = ({ inputs }) => {
  const { oryxCache } = inputs;
  const { path } = oryxCache;
  const deployURL = process.env.DEPLOY_PRIME_URL;

  console.log(inputs)

  if (!deployURL) {
    console.error('deployURL is not valid, check you inputs');
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
