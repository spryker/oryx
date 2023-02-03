import {
  IndexedDbIntanceType,
  IndexedDbMigrationArgsType,
} from './db-instance.model';

export interface IndexedDbVersioned {
  version?: number;
  unset?: boolean;
  migration?: IndexedDbMigrationFn;
}

export type IndexedDbMigrationFn = (
  db: IndexedDbIntanceType,
  ...args: IndexedDbMigrationArgsType
) => void | Promise<void>;
