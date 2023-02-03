/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexedDbSchemaMetadata } from '../schema-metadata';
import { indexedDbIndex } from './index.decorator';

describe('@indexedDbIndex()', () => {
  const addSpy = vi.spyOn(IndexedDbSchemaMetadata, 'add');

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class and prop name', () => {
    class TestClass {
      @indexedDbIndex()
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      indexes: [{ propPath: 'prop' }],
    });
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class and options', () => {
    class TestClass {
      @indexedDbIndex({ autoIncrement: true, version: 1 })
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      indexes: [{ propPath: 'prop', autoIncrement: true, version: 1 }],
    });
  });

  it('should override prop name from options', () => {
    class TestClass {
      @indexedDbIndex({ propPath: 'another-prop' })
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      indexes: [{ propPath: 'another-prop' }],
    });
  });

  it('should throw when used on symbol prop', () => {
    const propSymbol = Symbol('prop');

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestClass {
        @indexedDbIndex()
        [propSymbol]: unknown;
      }
    }).toThrowError('A Symbol(prop) cannot be an index in IndexedDb!');
  });
});
