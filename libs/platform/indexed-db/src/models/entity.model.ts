import {
  IndexedDbIndexAutoIncrement,
  IndexedDbIndexMultiEntry,
  IndexedDbIndexUnique,
} from './index.model';
import { IndexedDbVersioned } from './versioned.model';
import { IndexedDbWithPropPath } from './with-prop-path.model';

export interface IndexedDbEntity
  extends IndexedDbIndexComponund,
    IndexedDbVersioned {
  storeName?: string;
  indexes?: IndexedDbEntityIndex[];
}

export interface IndexedDbEntityIndexAutoIncrement
  extends Omit<IndexedDbIndexAutoIncrement, keyof IndexedDbVersioned>,
    Required<IndexedDbWithPropPath> {}

export interface IndexedDbEntityIndexUnique
  extends Omit<IndexedDbIndexUnique, keyof IndexedDbVersioned>,
    Required<IndexedDbWithPropPath> {}

export interface IndexedDbEntityIndexMultiEntry
  extends Omit<IndexedDbIndexMultiEntry, keyof IndexedDbVersioned>,
    Required<IndexedDbWithPropPath> {}

export type IndexedDbEntityIndex =
  | Required<IndexedDbWithPropPath>
  | IndexedDbEntityIndexAutoIncrement
  | IndexedDbEntityIndexUnique
  | IndexedDbEntityIndexMultiEntry;

export interface IndexedDbIndexComponund extends IndexedDbVersioned {
  compound?: string[][];
}
