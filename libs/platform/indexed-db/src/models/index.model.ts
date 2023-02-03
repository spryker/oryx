import { IndexedDbVersioned } from './versioned.model';

export interface IndexedDbIndexAutoIncrement extends IndexedDbVersioned {
  autoIncrement: boolean;
}

export interface IndexedDbIndexUnique extends IndexedDbVersioned {
  unique: boolean;
}

export interface IndexedDbIndexMultiEntry extends IndexedDbVersioned {
  multiEntry: boolean;
}

export type IndexedDbIndex =
  | IndexedDbIndexAutoIncrement
  | IndexedDbIndexUnique
  | IndexedDbIndexMultiEntry;
