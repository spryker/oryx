import { IndexedDbEntityType } from './entity-type.model';
import { IndexedDbVersioned } from './versioned.model';

export interface IndexedDbForeignKey extends IndexedDbVersioned {
  key: string;
  foreignEntity: IndexedDbEntityType;
  foreignKey?: string;
}
