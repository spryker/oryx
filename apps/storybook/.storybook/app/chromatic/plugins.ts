import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { ResourcePlugin, Resources } from '@spryker-oryx/experience';

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

    // graphicInjectable.inject(new ChromaticGraphicInjectable());
  }
}
