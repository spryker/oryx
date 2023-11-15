import {
  indexedDbEntity,
  indexedDbIndex,
  indexedDbPrimaryKey,
} from '@spryker-oryx/indexed-db';
import { Table } from 'dexie';
import type { Sync, SyncAction, SyncPayload, SyncStatus } from '../models';

declare global {
  interface OryxDexieDb {
    'oryx.syncs': Table<SyncEntity>;
  }
}

@indexedDbEntity({
  storeName: 'oryx.syncs',
  compound: [['status', 'scheduledAt']],
})
export class SyncEntity<TAction extends SyncAction = SyncAction>
  implements Sync<TAction>
{
  @indexedDbPrimaryKey({ autoIncrement: true })
  declare id: number;
  @indexedDbIndex({ multiEntry: true })
  declare prevSyncIds: string[];
  @indexedDbIndex()
  declare status: SyncStatus;
  declare action: TAction;
  declare payload: SyncPayload<TAction>;
  @indexedDbIndex()
  declare scheduledAt: Date;
  @indexedDbIndex()
  declare completedAt?: Date;
  declare triedAt?: Date;
  declare retries: number;
  declare errors: string[];

  constructor(data: Sync<TAction>) {
    Object.assign(this, data);

    Object.defineProperty(this, 'whenCompleted', {
      value: data.whenCompleted.bind(data),
      enumerable: false,
      configurable: true,
      writable: true,
    });

    Object.defineProperty(this, 'cancel', {
      value: data.cancel.bind(data),
      enumerable: false,
      configurable: true,
      writable: true,
    });
  }

  /* c8 ignore start */
  whenCompleted(): Promise<void> {
    throw new Error('Method not implemented.');
  }

  cancel(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  /* c8 ignore end */
}
