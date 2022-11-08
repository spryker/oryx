import { Theme, ThemePlugin } from '@spryker-oryx/core';

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

  getIconTemplate(icon?: string): string {
    return this.icons?.[icon as keyof typeof this.icons];
  }
}
