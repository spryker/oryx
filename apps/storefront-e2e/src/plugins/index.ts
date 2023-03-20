import * as cypressLogToOutput from 'cypress-log-to-output';

module.exports = (on, config) => {
  cypressLogToOutput.install(on, (event) => {
    return event.level === 'error' || event.type === 'error';
  });

  return config;
};
