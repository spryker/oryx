import { Category } from '../../types/category.type';

const categories: Category[] = [
  //parent category
  {
    id: '2',
    title: 'Cameras & Camcorders',
  },
  //child category
  {
    id: '3',
    title: 'Camcorders',
  },
];

export class CategoryStorage {
  static getByEq(eq: number): Category {
    if (eq >= categories.length) {
      throw new Error(`Category with eq = ${eq} does not exist.`);
    }

    return categories[eq];
  }
}
