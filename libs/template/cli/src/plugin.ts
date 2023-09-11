import { cancel } from '@clack/prompts';
import {
  App,
  AppPlugin,
  AppPluginAfterApply,
  InjectionPlugin,
} from '@spryker-oryx/core';
import { CliArgsService, CliService } from './services/index.js';

export class CliPlugin implements AppPlugin, AppPluginAfterApply {
  getName(): string {
    return 'oryx$cli';
  }

  async apply(): Promise<void> {
    // Nothing to do here
  }

  async afterApply(app: App): Promise<void> {
    try {
      await app
        .requirePlugin(InjectionPlugin)
        .getInjector()
        .inject(CliService)
        .run();
    } catch (e) {
      cancel(String(e));

      if (process.env.NODE_ENV === 'development') {
        console.error(e);
        console.error(
          'Args:',
          app
            .requirePlugin(InjectionPlugin)
            .getInjector()
            .inject(CliArgsService)
            .getRawArgs()
        );
      }

      process.exit(1);
    }
  }
}
