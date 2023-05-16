import { AppRef, PageMetaService } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { FontInjectable } from '@spryker-oryx/utilities';
import { ResourcePlugin } from '../plugins';

export class DefaultFontInjectable implements FontInjectable {
  setFont(id: string): void {
    const resourcePlugin = resolve(AppRef).findPlugin(ResourcePlugin);
    const font = resourcePlugin?.getFont(id);

    if (font === undefined) {
      return;
    }

    resolve(PageMetaService).add({
      name: 'link',
      attrs: {
        rel: 'stylesheet',
        href: font,
        async: '',
      },
    });
  }
}
