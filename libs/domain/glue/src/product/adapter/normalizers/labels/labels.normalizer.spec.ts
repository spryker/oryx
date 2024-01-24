import { ProductLabel } from '@spryker-oryx/product';
import { ApiProductModel } from '../../../models/product.api.model';
import { productLabelNormalizer } from './labels.normalizer';

const mockLabel1: ApiProductModel.ProductLabel = {
  id: 'foo',
  name: 'Sale',
  position: 1,
  frontEndReference: 'highlight',
};

const mockLabel2: ApiProductModel.ProductLabel = {
  id: 'foo',
  name: 'New',
  position: 2,
  frontEndReference: 'unknown',
};

const mockLabel3: ApiProductModel.ProductLabel = {
  id: 'foo',
  name: 'Empty',
  position: 3,
};

describe('productLabelsNormalizer', () => {
  let normalized: ProductLabel[];

  describe('appearance', () => {
    describe('when the label contains a highlight frontEndReference', () => {
      beforeEach(() => {
        normalized = productLabelNormalizer([mockLabel1]);
      });
      it('should convert it to highlight', () => {
        expect(normalized[0].appearance).toEqual('error');
      });
    });

    describe('when the label contains an unknown frontEndReference', () => {
      beforeEach(() => {
        normalized = productLabelNormalizer([mockLabel2]);
      });
      it('should convert it to highlight', () => {
        expect(normalized[0].appearance).toEqual('info');
      });
    });

    describe('when the label does not contain a frontEndReference', () => {
      beforeEach(() => {
        normalized = productLabelNormalizer([mockLabel3]);
      });
      it('should convert it to highlight', () => {
        expect(normalized[0].appearance).toEqual('info');
      });
    });
  });
});
