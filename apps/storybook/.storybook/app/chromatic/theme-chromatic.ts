import { Theme, ThemePlugin } from '@spryker-oryx/core';
import { iconInjectable } from '@spryker-oryx/utilities';
import { ChromaticIconInjectable } from './icon-chromatic.injectable';

export class ThemeChromaticPlugin extends ThemePlugin {
  constructor(theme: Theme[]) {
    super(theme);

    Promise.all(
      Object.values(this.icons).map((icon) =>
        typeof icon === 'function' ? (icon as any)() : icon
      )
    ).then((s) => {
      this.icons = Object.keys(this.icons).reduce(
        (acc, prev, index) => ({
          ...acc,
          [prev]: s[index],
        }),
        {}
      );
    });
  }

  async apply(): Promise<void> {
    super.apply();
    iconInjectable.inject(new ChromaticIconInjectable());
  }
}
