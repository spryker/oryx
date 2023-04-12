import { TestProductData } from '../types/product.type';

const products: TestProductData[] = [
  {
    id: '093_24495843',
    title: 'Sony SmartWatch 3',
    originalPrice: '248.99',
    currentPrice: '248.99',
    currentPriceWith10pDiscount: '224.09',
    previewImageURL: '/img/norm/medium/24495843-7844.jpg',
  },
  {
    id: '083_30964018',
    title: 'Samsung Gear 2 Classic',
    originalPrice: '332.53',
    currentPrice: '332.53',
    currentPriceWith10pDiscount: '299.28',
    previewImageURL: '/img/gallery_mediums/33474193_2373746309.jpg',
  },
  {
    id: '100_24675726',
    title: 'Acer Liquid Leap',
    originalPrice: '70.00',
    currentPrice: '62.77',
    currentPriceWith10pDiscount: '56.49',
    previewImageURL:
      '/img/gallery_mediums/img_24675726_medium_1483613008_9797_25362.jpg',
  },
  {
    id: '086_30521602',
    title: 'Samsung Gear S2',
    originalPrice: '180.01',
    currentPrice: '180.01',
    currentPriceWith10pDiscount: '162.01',
    previewImageURL: '/b2c/29889537_4485.jpg',
  },
  {
    id: '082_22196536',
    title: 'TomTom Multi-Sport Cardio',
    originalPrice: '370.90',
    currentPrice: '370.90',
    currentPriceWith10pDiscount: '333.81',
    previewImageURL: '/img/gallery_mediums/22196536_6541.jpg',
  },
];

export class ProductStorage {
  static getProductByEq(eq: number): TestProductData {
    if (eq >= products.length) {
      throw new Error(`Product with eq = ${eq} does not exist.`);
    }

    return products[eq];
  }
}
