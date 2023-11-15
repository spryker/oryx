export interface Sync<TAction extends SyncAction = SyncAction> {
  id: number;
  prevSyncIds: string[];
  status: SyncStatus;
  action: TAction;
  payload: SyncPayload<TAction>;
  scheduledAt: Date;
  completedAt?: Date;
  triedAt?: Date;
  retries: number;
  errors: string[];

  whenCompleted(): Promise<void>;
  cancel(): Promise<void>;
}

export enum SyncStatus {
  Queued = 'queued',
  Processing = 'processing',
  Completed = 'completed',
  Failed = 'failed',
  Cancelled = 'cancelled',
}

export type SyncAction = keyof OryxSyncActions extends never
  ? string
  : keyof OryxSyncActions;

export type SyncPayload<TAction> = TAction extends keyof OryxSyncActions
  ? OryxSyncActions[TAction]
  : unknown;

declare global {
  /**
   * A map of known Sync actions and their payload types.
   * In the format of `[actionName: string]: PayloadType`.
   *
   * Action name should follow convention `<vendor>.<domain>:<action-name>`
   * in kebab-case, where:
   * - `vendor` is a vendor prefix (ex. `oryx`)
   * - `domain` is a domain name where action is created (ex. `user`)
   * - `action-name` is the name of the action (ex. `my-action`)
   *
   * @example
   * ```ts
   * declare global {
   *   interface OryxSyncActions {
   *     'oryx.user:my-action': MyActionPayload;
   *   }
   * }
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface OryxSyncActions {}
}
