/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexedDbSchemaMetadata } from '../schema-metadata';
import { indexedDbPrimaryKey } from './primary-key.decorator';

describe('@indexedDbPrimaryKey()', () => {
  const addSpy = vi.spyOn(IndexedDbSchemaMetadata, 'add');

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class and prop name', () => {
    class TestClass {
      @indexedDbPrimaryKey()
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      primaryKey: { propPath: 'prop' },
    });
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class and options', () => {
    class TestClass {
      @indexedDbPrimaryKey({ autoIncrement: true, version: 1 })
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      primaryKey: { propPath: 'prop', autoIncrement: true, version: 1 },
    });
  });

  it('should override prop name from options', () => {
    class TestClass {
      @indexedDbPrimaryKey({ propPath: 'another-prop' })
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      primaryKey: { propPath: 'another-prop' },
    });
  });

  it('should throw when used on symbol prop', () => {
    const propSymbol = Symbol('prop');

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestClass {
        @indexedDbPrimaryKey()
        [propSymbol]: unknown;
      }
    }).toThrowError('A Symbol(prop) cannot be a primary key in IndexedDb!');
  });
});
