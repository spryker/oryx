import { IndexedDbSchemaMetadata } from '../schema-metadata';
import { indexedDbEntity } from './entity.decorator';

describe('@indexedDbEntity()', () => {
  const addSpy = vi.spyOn(IndexedDbSchemaMetadata, 'add');

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class', () => {
    @indexedDbEntity()
    class TestClass {}

    expect(addSpy).toHaveBeenCalledWith(TestClass, {});
  });

  it('should call `IndexedDbSchemaMetadata.add()` with target class and options', () => {
    @indexedDbEntity({
      storeName: 'mock-store',
      indexes: [{ propPath: 'mock-prop1' }],
    })
    class TestClass {}

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      storeName: 'mock-store',
      indexes: [{ propPath: 'mock-prop1' }],
    });
  });

  it('should add to indexes versioned data from options', () => {
    @indexedDbEntity({
      storeName: 'mock-store',
      version: 1,
      unset: true,
      indexes: [{ propPath: 'mock-prop1' }, { propPath: 'mock-prop2' }],
    })
    class TestClass {}

    expect(addSpy).toHaveBeenCalledWith(TestClass, {
      storeName: 'mock-store',
      version: 1,
      unset: true,
      indexes: [
        { propPath: 'mock-prop1', version: 1, unset: true },
        { propPath: 'mock-prop2', version: 1, unset: true },
      ],
    });
  });
});
