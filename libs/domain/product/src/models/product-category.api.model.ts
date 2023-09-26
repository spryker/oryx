import { JsonApiModel } from '@spryker-oryx/utilities';

export module ApiProductCategoryModel {
  export const enum Fields {
    NodeId = 'nodeId',
    Name = 'name',
    Order = 'order',
    MetaDescription = 'metaDescription',
    Parents = 'parents',
    Children = 'children',
  }

  export interface CategoryNode {
    nodeId: number;
    order: number;
    name: string;
    metaDescription?: string;
    children: CategoryNode[];
    parents?: CategoryNode[];
  }

  export interface CategoryNodesStorage {
    categoryNodesStorage: CategoryNode[];
  }

  export type Response = JsonApiModel<CategoryNode, unknown>;
  export type TreeResponse = JsonApiModel<CategoryNodesStorage[], unknown>;
}
