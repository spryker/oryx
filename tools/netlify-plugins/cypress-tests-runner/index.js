import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';

export const onSuccess = ({ inputs }) => {
  const { nxRunCommand } = inputs;
  const deployURL = process.env.DEPLOY_PRIME_URL;
  const buildId = process.env.BUILD_ID;

  updateCypressConfig(buildId, deployURL);
  executeNxCommand(nxRunCommand);
};

/**
 * To be able to run smoke tests and have nice results in PR comments
 * we have to pass deployed site url and build id to cypress
 *
 * it is not possible to do so using env variables, so we have to
 * modify nx config a bit to add/edit missing values
 *
 * @param {string} buildId
 * @param {string} baseUrl
 */
function updateCypressConfig(buildId, baseUrl) {
  console.log(`Deployed site URL: ${baseUrl}`);
  console.log(`Deployed build id: ${buildId}`);

  const pathToProjectConfig = '../../../apps/storefront-e2e/project.json';
  const config = JSON.parse(readFileSync(pathToProjectConfig, 'utf8'));

  config.targets.e2e.configurations['headless-ci-smoke'].ciBuildId = buildId;
  config.targets.e2e.configurations['headless-ci-smoke'].baseUrl = baseUrl;

  writeFileSync(pathToProjectConfig, JSON.stringify(config, null, 2));
}

/**
 * Executes given nx command from the root of the repository
 *
 * @param {string} nxRunCommand
 */
function executeNxCommand(nxRunCommand) {
  console.log(`Executing "npm run ${nxRunCommand}"...`);

  process.chdir('../../');

  // sync call is needed here, because if async is used -> netlify will kill child process
  // when the main process is finished
  const childProcess = spawnSync('npx', ['nx', 'run', nxRunCommand], {
    stdio: 'inherit',
  });

  if (childProcess.status === 0) {
    console.log(`"npx nx run ${nxRunCommand}" completed successfully.`);
  } else {
    console.error(`"npx nx run ${nxRunCommand}" failed.`);
    console.error(childProcess.error);
  }
}
