import { inject } from '@spryker-oryx/di';
import { Deserializer } from 'jsonapi-serializer';
import { map, Observable, of, switchMap } from 'rxjs';
import { ProductEntity } from '../../entities';
import {
  ItemsFilters,
  PickingList,
  PickingListItem,
  PickingListQualifier,
  PickingListStatus,
  PickingOrderItem,
} from '../../models';
import { PickingHttpService } from '../picking-http.service';
import { PickingListAdapter } from './picking-list.adapter';

export class PickingListDefaultAdapter implements PickingListAdapter {
  constructor(
    protected pickingHttpService = inject(PickingHttpService),
    protected deserializer = new Deserializer({
      keyForAttribute: 'camelCase',
    })
  ) {}

  get(qualifier: PickingListQualifier): Observable<PickingList[]> {
    const query = this.getPickingListQuery(qualifier);

    return this.pickingHttpService
      .get<GetPickingListResponse>(`/picking-lists${query}`)
      .pipe(switchMap((res) => this.parsePickingLists(res)));
  }

  startPicking(pickingList: PickingList): Observable<PickingList> {
    const body = {
      type: 'picking-lists',
      attributes: {
        action: 'startPicking',
      },
    };

    return this.pickingHttpService
      .patch<PatchPickingListResponse>(`/picking-lists/${pickingList.id}`, body)
      .pipe(
        map(({ data: [updatedPickingListData] }) => ({
          ...pickingList,
          status: updatedPickingListData.status as PickingListStatus,
          createdAt: new Date(updatedPickingListData.createdAt),
          updatedAt: new Date(updatedPickingListData.updatedAt),
        }))
      );
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    // In online-only mode there is no request to BAPI needed
    return of(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    const body = {
      data: pickingList.items.map((item) => ({
        id: item.orderItem.uuid,
        type: 'picking-list-items',
        status: item.status,
        attributes: {
          numberOfPicked: item.numberOfPicked,
          numberOfNotPicked: item.numberOfNotPicked,
        },
      })),
    };

    return this.pickingHttpService
      .patch<PatchPickingListResponse>(
        `/picking-lists/${pickingList.id}/picking-list-items`,
        body
      )
      .pipe(
        map(({ data: [updatedPickingListData] }) => ({
          ...pickingList,
          status: updatedPickingListData.status as PickingListStatus,
          createdAt: new Date(updatedPickingListData.createdAt),
          updatedAt: new Date(updatedPickingListData.updatedAt),
        }))
      );
  }

  protected getPickingListQuery(qualifier: PickingListQualifier): string {
    let query = '';

    if (qualifier.id) {
      return `/${qualifier.id}`;
    }

    if (qualifier.status) {
      query += `?filter[picking-lists.status]=${qualifier.status}`;
    }

    if (
      qualifier.limit !== undefined ||
      qualifier.offset !== undefined ||
      qualifier.orderReferences !== undefined ||
      qualifier.sortBy !== undefined ||
      qualifier.sortDesc !== undefined
    ) {
      throw new Error(
        `PickingListDefaultAdapter: Unsupported qualifier: ${JSON.stringify(
          qualifier,
          null,
          2
        )}!`
      );
    }

    return query;
  }

  protected async parsePickingLists(
    response: GetPickingListResponse
  ): Promise<PickingList[]> {
    const deserializedData: PickingListResponseData[] =
      await this.deserializer.deserialize(response);

    const products = this.parseProducts(deserializedData);

    return deserializedData.map((data) =>
      this.parsePickingList(data, products)
    );
  }

  protected parseProducts(data: PickingListResponseData[]): ProductEntity[] {
    const productsDeserialize = data
      .flatMap((item) => item.pickingListItems)
      .flatMap((item) => item.concreteProducts);

    const products: ProductEntity[] = productsDeserialize.map((product) =>
      ProductEntity.from({
        id: product.id,
        sku: product.sku,
        productName: product.name,
        image: product.productImages[0].externalUrlSmall,
        imageLarge: product.productImages[0].externalUrlLarge,
      })
    );

    return products;
  }

  protected parsePickingList(
    data: PickingListResponseData,
    products: ProductEntity[]
  ): PickingList {
    const cardNote = data.pickingListItems[0].salesOrders[0].cartNote;

    const parsedPickingItems: PickingListItem[] = data.pickingListItems.map(
      (item) => {
        // Use first element(products[0]) from products because it will be only ONE by pickinglist item
        const product = products.find(
          (prod) => prod.sku === item.concreteProducts[0].sku
        );

        if (!product) {
          throw new Error(`Missing product for item '${item.id}'`);
        }

        return {
          id: item.id,
          quantity: item.quantity,
          numberOfPicked: item.numberOfPicked,
          numberOfNotPicked: item.numberOfNotPicked,
          orderItem: item.orderItem,
          product: product,
          type: 'picking-list-items',
          status: item.numberOfPicked
            ? ItemsFilters.Picked
            : ItemsFilters.NotPicked,
        };
      }
    );

    const pickingList: PickingList = {
      id: data.id,
      status: data.status as PickingListStatus,
      items: parsedPickingItems,
      cartNote: cardNote,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };

    return pickingList;
  }
}

export interface GetPickingListResponse {
  data: PickingListResponseData[];
  included: unknown[];
  links: LinksObject;
}

export interface PickingListResponseData extends ResourceObject {
  uuid: string;
  status: string;
  pickingListItems: PickingListResponseItem[];
  createdAt: string;
  updatedAt: string;
}

interface PickingListResponseItem extends ResourceObject {
  numberOfPicked: number;
  numberOfNotPicked: number;
  orderItem: PickingOrderItem;
  concreteProducts: PickingListResponseProduct[];
  quantity: number;
  salesOrders: PickingListResponseOrder[];
  shipments: PickingListResponseShipment[];
}

interface PickingListResponseOrder extends ResourceObject {
  orderReference: string;
  cartNote: string;
}

interface PickingListResponseShipment extends ResourceObject {
  requestedDeliveryDate: string;
}

interface PickingListResponseProduct extends ResourceObject {
  sku: string;
  name: string;
  productImages: PickingListResponseProductImage[];
}

interface PickingListResponseProductImage extends ResourceObject {
  productImageKey: string;
  externalUrlSmall: string;
  externalUrlLarge: string;
}

interface ResourceObject {
  id: string;
  type: string;
}

interface LinksObject {
  self: string;
}

interface PatchPickingListResponse {
  data: PatchPickingListData[];
  links: LinksObject;
}

interface PatchPickingListData extends ResourceObject {
  status: string;
  updatedAt: string;
  createdAt: string;
}
