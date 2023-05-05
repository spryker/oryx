import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import {
  ResourcePlugin,
  Resources,
  Theme,
  ThemePlugin,
} from '@spryker-oryx/experience';
import { iconInjectable, resourceInjectable } from '@spryker-oryx/utilities';
import {
  ChromaticIconInjectable,
  ChromaticResourceInjectable,
} from './injectables';

export class ThemeChromaticPlugin extends ThemePlugin {
  constructor(theme: Theme[]) {
    super(theme);

    Promise.all(Object.values(this.icons).map(resolveLazyLoadable)).then(
      (s) => {
        this.icons = Object.keys(this.icons).reduce(
          (acc, prev, index) => ({
            ...acc,
            [prev]: s[index],
          }),
          {}
        );
      }
    );

    iconInjectable.inject(new ChromaticIconInjectable());
  }
}

export class ResourcesChromaticPlugin extends ResourcePlugin {
  constructor(resources: Resources) {
    super(resources);

    for (const [key, value] of Object.entries(this.resources?.graphics ?? {})) {
      Promise.all(Object.values(value).map(resolveLazyLoadable)).then((s) => {
        // @ts-ignore
        this.resources.graphics[key] = Object.keys(
          // @ts-ignore
          this.resources.graphics[key]
        ).reduce(
          (acc, prev, index) => ({
            ...acc,
            [prev]: s[index],
          }),
          {}
        );
      });
    }

    resourceInjectable.inject(new ChromaticResourceInjectable());
  }
}
