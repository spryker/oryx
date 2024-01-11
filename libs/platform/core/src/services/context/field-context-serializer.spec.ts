import { firstValueFrom } from 'rxjs';
import { FieldContextSerializer } from './field-context-serializer';

describe('FieldContextSerializer', () => {
  describe('serialize and deserialize methods', () => {
    const key = 'customKey';
    const serializer = new FieldContextSerializer(key);

    it('should serialize a value based on a custom key', async () => {
      const value = { customKey: 'testValue' };
      const result = serializer.serialize(value);
      expect(await firstValueFrom(result)).toBe('testValue');
    });

    it('should deserialize a string to an object with the custom key', async () => {
      const testString = 'testValue';
      const result = serializer.deserialize(testString);
      expect(await firstValueFrom(result)).toEqual({ customKey: testString });
    });
  });

  describe('distill method', () => {
    const key = 'customKey';
    const serializer = new FieldContextSerializer(key);

    it('should distill the object to only include the custom key', async () => {
      const value = { customKey: 'value', otherKey: 'otherValue' };
      const result = serializer.distill!(value);
      expect(await firstValueFrom(result)).toEqual({ customKey: 'value' });
    });
  });
});
