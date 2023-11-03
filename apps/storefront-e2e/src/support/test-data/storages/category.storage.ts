import { Category } from '../../types/domain.types';

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
  //child category 2
  {
    id: '4',
    title: 'Digital Cameras',
  },
];

export class CategoryStorage {
  static getByEq(eq: number): Category {
    if (eq >= categories.length)
      throw new Error(`Category with eq = ${eq} does not exist.`);

    return categories[eq];
  }
}
