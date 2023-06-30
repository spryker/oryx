import { spawnSync } from 'child_process';

export const onSuccess = ({ inputs }) => {
  const { nxRunCommand } = inputs;
  const deployURL = process.env.DEPLOY_PRIME_URL;

  console.log(`Deployed site URL: ${deployURL}`);
  console.log(`Executing "npm run ${nxRunCommand}"...`);

  // go to the root directory
  process.chdir('../../');

  // override default Cypress variables
  process.env.CYPRESS_BASE_URL = deployURL;
  process.env.CYPRESS_BROWSER = 'electron';

  // sync call is needed here, because if async is used -> netlify will kill child process
  // when the main process is over
  const childProcess = spawnSync('npx', ['nx', 'run', nxRunCommand], { stdio: 'inherit' });

  if (childProcess.status === 0) {
    console.log(`"npm run ${nxRunCommand}" completed successfully.`);
  } else {
    console.error(`"npm run ${nxRunCommand}" failed.`);
    console.error(childProcess.error);
  }
};
