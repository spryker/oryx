import '@spryker-oryx/application/sw';
import { app } from './app';

app
  .then(() => console.debug('Service worker app started!'))
  .catch(console.error);
