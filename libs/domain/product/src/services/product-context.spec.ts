import { firstValueFrom } from 'rxjs';
import { ProductQualifier } from '../models';
import { ProductContextSerializer } from './product-context';

describe('ProductContextSerializer', () => {
  const serializer = new ProductContextSerializer();

  describe('serialize method', () => {
    it('should return an Observable of the SKU', async () => {
      const qualifier: ProductQualifier = { sku: 'test-sku' };
      const result = serializer.serialize(qualifier);
      expect(await firstValueFrom(result)).toBe('test-sku');
    });
  });

  describe('deserialize method', () => {
    it('should return an Observable of ProductQualifier with the SKU', async () => {
      const sku = 'test-sku';
      const result = serializer.deserialize(sku);
      expect(await firstValueFrom(result)).toEqual({ sku: 'test-sku' });
    });
  });
});
