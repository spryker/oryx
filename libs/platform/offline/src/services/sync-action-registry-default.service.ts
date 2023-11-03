import { inject } from '@spryker-oryx/di';
import { combineLatest, map, Observable, throwError } from 'rxjs';
import { Sync, SyncAction, SyncActionHandler } from '../models';
import { SyncActionHandlerRegistry } from '../sync-action-handler.provider';
import { SyncActionRegistryService } from './sync-action-registry.service';

export class SyncActionRegistryDefaultService
  implements SyncActionRegistryService
{
  protected actionHandlersMap = new Map<SyncAction, SyncActionHandler[]>();

  constructor(actionHandlerTypes = inject(SyncActionHandlerRegistry, null)) {
    actionHandlerTypes?.forEach(({ action, handlerType }) =>
      this.register(action, inject(handlerType))
    );
  }

  register<TAction extends SyncAction>(
    action: TAction,
    handler: SyncActionHandler<TAction>
  ): void {
    if (!this.actionHandlersMap.has(action))
      this.actionHandlersMap.set(action, []);

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this.actionHandlersMap.get(action)!.push(handler);
  }

  handleSync(sync: Sync<SyncAction>): Observable<void> {
    const handlers = this.actionHandlersMap.get(sync.action);

    if (!handlers) {
      return throwError(
        () =>
          new Error(
            `SyncActionRegistryDefaultService: Sync with action '${sync.action}' cannot be handled by any handler!`
          )
      );
    }

    return combineLatest(
      handlers.map((handler) => handler.handleSync(sync))
    ).pipe(map(() => void 0));
  }
}
