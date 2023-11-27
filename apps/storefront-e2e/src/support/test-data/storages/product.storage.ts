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
];

const productsWithCoupons: Product[] = [
  {
    id: '012_25904598',
    title: 'Canon IXUS 165',
    originalPrice: '366.00',
  },
  {
    id: '029_26976109',
    title: 'Sony Cyber-shot DSC-WX500',
    originalPrice: '410.24',
  },
];

export class ProductStorage {
  static getByEq(eq: number): Product {
    if (eq >= products.length) {
      throw new Error(`Product with eq = ${eq} does not exist.`);
    }

    return products[eq];
  }

  static getProductWithCouponByEq(eq: number): Product {
    if (eq >= productsWithCoupons.length) {
      throw new Error(`Product with eq = ${eq} does not exist.`);
    }

    return productsWithCoupons[eq];
  }
}
