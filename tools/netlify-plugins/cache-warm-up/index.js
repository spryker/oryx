import { execSync } from 'child_process';

export const onSuccess = ({ inputs }) => {
  const { oryxCache } = inputs;
  const deployURL = process.env.DEPLOY_PRIME_URL;

  // these logs should not be removed because
  // they might be useful for debugging
  console.log(inputs)
  console.log('deployURL: ', deployURL);

  oryxCache.forEach(cacheConfig => {
    const url = `${deployURL}${cacheConfig.path}`;

    sendGetRequest(url);
  });
};

function sendGetRequest(url) {
  console.log('Sending GET request to: ', url);

  const result = execSync(`curl -I -X GET ${url}`);

  console.log(result.toString());
  console.log('---------')
}
