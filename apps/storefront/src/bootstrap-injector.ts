import { createInjector } from './bootstrap';
// bundlers won't run this line before importing our other components unless this is placed in a separate file like this
createInjector();
