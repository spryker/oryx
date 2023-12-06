import { ContextFallback } from '@spryker-oryx/core';
import { inject, Provider } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map } from 'rxjs';

export const enum PickingListContext {
  PickingListId = 'pickingListId',
}

export const PickingListContextFallback: Provider = {
  provide: `${ContextFallback}${PickingListContext.PickingListId}`,
  useFactory: () =>
    inject(RouterService)
      .currentParams()
      .pipe(map((params) => params?.pickingListId)),
};
