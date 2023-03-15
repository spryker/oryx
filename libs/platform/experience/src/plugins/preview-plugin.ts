import { AppPlugin, AppPluginBeforeApply } from '@spryker-oryx/core';
import { rootInjectable } from '@spryker-oryx/utilities';
import { isServer } from 'lit';

export const PreviewPluginName = 'oryx.experience$preview';

export class PreviewPlugin implements AppPlugin, AppPluginBeforeApply {
  getName(): string {
    return PreviewPluginName;
  }

  apply(): void {
    //
  }

  beforeApply(): void {
    const root = rootInjectable.get();

    if (!isServer && root === 'body') {
      return;
    }

    if (!isServer) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      document.querySelector(root)!.outerHTML = `<${root}></${root}>`;
    }
  }
}
