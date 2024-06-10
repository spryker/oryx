import { ProductCategory } from '@spryker-oryx/product';

export const mockProductsCategories: ProductCategory[] = [
  { id: '2', name: 'Cameras & Camcorders', order: 0 },
  { id: '5', name: 'Computer', order: 0 },
  { id: '6', name: 'Notebooks', parent: '5', order: 0 },
  { id: '7', name: "Pc's/workstations", parent: '5', order: 0 },
  { id: '8', name: 'Tablets', parent: '5', order: 0 },
  { id: '9', name: 'Smart Wearables', order: 0 },
  { id: '11', name: 'Telecom & Navigation', order: 0 },
];
