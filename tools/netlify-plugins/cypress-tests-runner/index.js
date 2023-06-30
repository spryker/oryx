import { spawn } from 'child_process';

export const onSuccess = async ({ inputs }) => {
  const { npmRunCommand, siteUrl } = inputs;

  console.log(`Deployed site URL: ${siteUrl}`);
  console.log(`Executing "npm run ${npmRunCommand}"...`);

  const childProcess = spawn('npm', ['run', npmRunCommand], { stdio: 'inherit' });

  childProcess.on('close', (code) => {
    if (code === 0) {
      console.log(`"npm run ${npmRunCommand}" completed successfully.`);
    } else {
      console.error(`"npm run ${npmRunCommand}" failed.`);
    }
  });

  childProcess.on('error', (err) => {
    console.error(err);
  });
};