import { firstValueFrom } from 'rxjs';
import { FieldsContextSerializer } from './fields-context-serializer';

describe('FieldsContextSerializer', () => {
  const keys = ['key1', 'key2', 'key3'];
  const serializer = new FieldsContextSerializer(keys);

  describe('serialize method', () => {
    it('should serialize an object into a comma-separated string based on keys', async () => {
      const value = { key1: 'val1', key2: 'val2', key3: 'val3' };
      const result = serializer.serialize(value);
      expect(await firstValueFrom(result)).toBe('val1,val2,val3');
    });
  });

  describe('deserialize method', () => {
    it('should deserialize a string into an object based on keys', async () => {
      const valueString = 'val1,val2,val3';
      const result = serializer.deserialize(valueString);
      expect(await firstValueFrom(result)).toEqual({
        key1: 'val1',
        key2: 'val2',
        key3: 'val3',
      });
    });
  });

  describe('distill method', () => {
    it('should distill an object to only include specified keys', async () => {
      const value = { key1: 'val1', key2: 'val2', otherKey: 'otherVal' };
      const result = serializer.distill!(value);
      expect(await firstValueFrom(result)).toEqual({
        key1: 'val1',
        key2: 'val2',
      });
    });
  });
});
