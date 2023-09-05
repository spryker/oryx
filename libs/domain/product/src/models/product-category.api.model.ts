import { JsonApiModel } from '@spryker-oryx/utilities';

export module ApiProductCategoryModel {
  export interface CategoryNode {
    nodeId: number;
    order: number;
    name: string;
    url: string;
  }

  export interface CategoryTreeNode extends CategoryNode {
    children: CategoryTreeNode[];
  }

  export interface CategoryNodesStorage {
    categoryNodesStorage: CategoryTreeNode[];
  }

  export type Response = JsonApiModel<CategoryNodesStorage[], unknown>;
}
