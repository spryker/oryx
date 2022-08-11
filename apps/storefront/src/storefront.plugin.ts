import {
  AppPlugin,
  AppPluginAfterApply,
  AppPluginBeforeApply,
} from '@spryker-oryx/core';
import { hydrateShadowRoots } from '@webcomponents/template-shadowroot/template-shadowroot.js';
import { LitElement } from 'lit-element';
import 'lit/experimental-hydrate-support.js';
import { initHydrateHooks, initInlineScripts } from './utils/hydrate-hooks';

export class StorefrontPlugin
  implements AppPlugin, AppPluginBeforeApply, AppPluginAfterApply
{
  getName(): string {
    return 'storefront';
  }

  beforeApply(): void | Promise<void> {
    try {
      hydrateShadowRoots(document.body);
    } catch (e) {
      console.log(e);
    }

    // This doesn't get called at the right time by lit-html, so we do it here
    globalThis.litElementHydrateSupport?.({ LitElement });
  }

  apply(): void | Promise<void> {
    //We should avoid doing this on SSR rendered client side environments because it will automatically trigger hydration for us
    //Currently handled in the router, but if we can somehow detect the correct environment, we can move it here.
    //resolve(RouterService).go(window.location.pathname);
  }

  afterApply(): void | Promise<void> {
    initHydrateHooks();
    initInlineScripts();
  }
}
