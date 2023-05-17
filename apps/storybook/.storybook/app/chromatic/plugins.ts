import { resolveLazyLoadable } from '@spryker-oryx/core/utilities';
import { ResourcePlugin, Resources } from '@spryker-oryx/experience';
import { graphicInjectable } from '@spryker-oryx/utilities';
import { ChromaticGraphicInjectable } from './injectables';

export class ResourcesChromaticPlugin extends ResourcePlugin {
  constructor(resources: Resources) {
    super(resources);

    // Promise.all(
    //   Object.values(this.resources.icons ?? {}).map(resolveLazyLoadable)
    // ).then((s) => {
    //   this.resources.icons = Object.keys(this.resources.icons ?? {}).reduce(
    //     (acc, prev, index) => ({
    //       ...acc,
    //       [prev]: s[index],
    //     }),
    //     {}
    //   );
    // });

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

    graphicInjectable.inject(new ChromaticGraphicInjectable());
    // iconInjectable.inject(new ChromaticIconInjectable());
  }
}
