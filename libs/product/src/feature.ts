import { AppFeature } from '@spryker-oryx/core';
import { productAttributesComponent } from '../attributes/src/component';
import { productAverageRatingComponent } from '../average-rating/src/component';
import { productCardComponent } from '../card/src/component';
import { productDescriptionComponent } from '../description/src/component';
import { productIdComponent } from '../id/src/component';
import { productImagesComponent } from '../images/src/component';
import { productLabelsComponent } from '../labels/src/label.def';
import { productListComponent } from '../list/src/component';
import { productMediaComponent } from '../media/src/component';
import { productPriceComponent } from '../price/src/component';
import { productTitleComponent } from '../title/src/title.def';
import { productProviders } from './services';

export {
  productTitleComponent,
  productLabelsComponent as productLabelComponent,
};

export const productFeature: AppFeature = {
  providers: productProviders,
  components: [
    productAttributesComponent,
    productAverageRatingComponent,
    productCardComponent,
    productDescriptionComponent,
    productIdComponent,
    productLabelsComponent,
    productImagesComponent,
    productListComponent,
    productMediaComponent,
    productPriceComponent,
    productTitleComponent,
  ],
};
