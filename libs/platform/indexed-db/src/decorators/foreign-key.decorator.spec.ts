/* eslint-disable @typescript-eslint/no-explicit-any */
import { IndexedDbSchemaMetadata } from '../schema-metadata';
import { indexedDbForeignKey } from './foreign-key.decorator';

describe('@indexedDbForeignKey()', () => {
  const addSpy = vi.spyOn(IndexedDbSchemaMetadata, 'add');

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class and prop name', () => {
    const mockEntity = {} as any;

    class TestClass {
      @indexedDbForeignKey({ key: 'mock-key', foreignEntity: mockEntity })
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      foreignKeys: [
        { key: 'mock-key', foreignEntity: mockEntity, propPath: 'prop' },
      ],
    });
  });

  it('should override prop name from options', () => {
    const mockEntity = {} as any;

    class TestClass {
      @indexedDbForeignKey({
        key: 'mock-key',
        foreignEntity: mockEntity,
        propPath: 'another-prop',
      })
      prop: unknown;
    }

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      foreignKeys: [
        {
          key: 'mock-key',
          foreignEntity: mockEntity,
          propPath: 'another-prop',
        },
      ],
    });
  });

  it('should throw when used on symbol prop', () => {
    const mockEntity = {} as any;
    const propSymbol = Symbol('prop');

    expect(() => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      class TestClass {
        @indexedDbForeignKey({ key: 'mock-key', foreignEntity: mockEntity })
        [propSymbol]: unknown;
      }
    }).toThrowError(
      'A Symbol(prop) cannot be used as a foreign key in IndexedDb!'
    );
  });
});
