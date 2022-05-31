import { LitElement } from 'lit-element';
import 'lit/experimental-hydrate-support.js';
import { createInjector } from './bootstrap';
// bundlers won't run this line before importing our other components unless this is placed in a separate file like this
createInjector();

// This doesn't get called at the right time by lit-html, so we do it here
globalThis.litElementHydrateSupport?.({ LitElement });
