import { spawnSync } from 'child_process';

export const onSuccess = ({ inputs, constants }) => {
  const { npmRunCommand } = inputs;
  const { DEPLOY_URL } = constants;

  console.log(`Deployed site URL: ${DEPLOY_URL}`);
  console.log(`Executing "npm run ${npmRunCommand}"...`);

  // go to the root directory
  process.chdir('../../');

  // sync call is needed here, because if async is used -> netlify will kill child process
  // when the main process is over
  const childProcess = spawnSync('npm', ['run', npmRunCommand], { stdio: 'inherit' });

  if (childProcess.status === 0) {
    console.log(`"npm run ${npmRunCommand}" completed successfully.`);
  } else {
    console.error(`"npm run ${npmRunCommand}" failed.`);
    console.error(childProcess.error);
  }
};
