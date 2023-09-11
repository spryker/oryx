import { Product } from '../../types/domain.types';

const products: Product[] = [
  {
    id: '117_29890338',
    title: 'Fujitsu ESPRIMO D556',
    originalPrice: '70.00',
  },
  {
    id: '021_21081475',
    title: 'Sony Cyber-shot DSC-W830',
    originalPrice: '106.80',
  },
  {
    id: '139_24699831',
    title: 'Asus Transformer Book T200TA',
    originalPrice: '34.54',
    netModePrice: '31.09',
  },
  // product with product references
  {
    id: '138_30046855',
    title: 'Acer TravelMate P258-M',
    originalPrice: '264.32',
  },
  // product with discount
  {
    id: '095_24235707',
    title: 'TomTom Golf',
    originalPrice: '180.00',
    currentPrice: '179.94',
    currentPriceWith10pDiscount: '161.95',
    previewImageURL: '/img/norm/medium/24235707-6105.jpg',
  },
  {
    id: '115_27295368',
    title: 'DELL OptiPlex 3020',
    originalPrice: '345.00',
    netModePrice: '310.50',
  },
];

export class ProductStorage {
  static getByEq(eq: number): Product {
    if (eq >= products.length) {
      throw new Error(`Product with eq = ${eq} does not exist.`);
    }

    return products[eq];
  }
}
