import { inject } from '@spryker-oryx/di';
// Add full import because of issue with naming exports from cjs.
import * as jsonapi from 'jsonapi-serializer';
import { map, Observable, of, switchMap } from 'rxjs';
import {
  ItemsFilters,
  PickingList,
  PickingListError,
  PickingListItem,
  PickingListQualifier,
  PickingListStatus,
  PickingOrderItem,
  PickingProduct,
} from '../../models';
import { PickingHttpService } from '../picking-http.service';
import { PickingListAdapter } from './picking-list.adapter';
import { LinksObject, ResourceObject } from './types';

export class PickingListDefaultAdapter implements PickingListAdapter {
  constructor(
    protected pickingHttpService = inject(PickingHttpService),
    protected deserializer = new jsonapi.Deserializer({
      keyForAttribute: 'camelCase',
    })
  ) {}

  get(qualifier?: PickingListQualifier): Observable<PickingList[]> {
    const query = this.getPickingListQuery(qualifier);

    return this.pickingHttpService
      .get<GetPickingListResponse>(`/picking-lists${query}`)
      .pipe(switchMap((res) => this.parsePickingLists(res)));
  }

  startPicking(pickingList: PickingList): Observable<PickingList> {
    return this.pickingHttpService
      .post<StartPickingListResponse>(
        `/picking-lists/${pickingList.id}/start-picking`,
        {}
      )
      .pipe(
        map((response) => {
          if (response.errors) {
            const error = response.errors[0];
            const pickingListError = new Error(
              error.message
            ) as PickingListError;
            pickingListError.status = error.status;
            pickingListError.code = error.code;
            throw pickingListError;
          }
          return {
            ...pickingList,
            status: response.data.status as PickingListStatus,
            createdAt: new Date(response.data.createdAt),
            updatedAt: new Date(response.data.updatedAt),
          };
        })
      );
  }

  updatePickingItems(pickingList: PickingList): Observable<PickingList> {
    // In online-only mode there is no request to BAPI needed
    return of(pickingList);
  }

  finishPicking(pickingList: PickingList): Observable<PickingList> {
    const body = {
      data: pickingList.items.map((item) => ({
        id: item.id,
        type: 'picking-list-items',
        status: item.status,
        attributes: {
          numberOfPicked: item.numberOfPicked,
          numberOfNotPicked: item.numberOfNotPicked,
        },
      })),
    };

    return this.pickingHttpService
      .patch<FinishPickingListResponse>(
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

  protected getPickingListQuery(qualifier?: PickingListQualifier): string {
    const params = new URLSearchParams({
      include:
        'picking-list-items,concrete-products,sales-orders,sales-shipments,concrete-product-image-sets',
    });

    qualifier?.ids?.forEach((id) =>
      params.append('filter[picking-lists.uuids][]', id)
    );

    if (qualifier?.status) {
      params.set('filter[picking-lists.status]', qualifier.status);
    }

    if (
      qualifier?.limit !== undefined ||
      qualifier?.offset !== undefined ||
      qualifier?.orderReferences !== undefined ||
      qualifier?.sortBy !== undefined ||
      qualifier?.sortDesc !== undefined
    ) {
      throw new Error(
        `PickingListDefaultAdapter: Unsupported qualifier: ${JSON.stringify(
          qualifier,
          null,
          2
        )}!`
      );
    }

    return `?${params.toString()}`;
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

  protected parseProducts(data: PickingListResponseData[]): PickingProduct[] {
    const productsDeserialize = data
      .flatMap((item) => item.pickingListItems)
      .flatMap((item) => item.concreteProducts);

    const products: PickingProduct[] = productsDeserialize.map((product) => ({
      id: product.id,
      sku: product.sku,
      productName: product.name,
      image:
        product.concreteProductImageSets?.[0].imageSets[0].images[0]
          .externalUrlSmall,
      imageLarge:
        product.concreteProductImageSets?.[0].imageSets[0].images[0]
          .externalUrlLarge,
    }));

    return products;
  }

  protected parsePickingList(
    data: PickingListResponseData,
    products: PickingProduct[]
  ): PickingList {
    const cardNote = data.pickingListItems[0].salesOrders[0].cartNote;
    const orderReferences = [
      ...new Set(
        data.pickingListItems
          .map((item) =>
            item.salesOrders.map((salesOrder) => salesOrder.orderReference)
          )
          .flat()
      ),
    ];
    const requestedDeliveryDate: string =
      data.pickingListItems[0].salesShipments[0].requestedDeliveryDate;

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
      orderReferences,
      status: data.status as PickingListStatus,
      items: parsedPickingItems,
      cartNote: cardNote,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
      requestedDeliveryDate: new Date(requestedDeliveryDate),
      itemsCount: parsedPickingItems.reduce(
        (count, item) => count + item.quantity,
        0
      ),
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
  salesShipments: PickingListResponseShipment[];
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
  concreteProductImageSets: {
    imageSets: PickingListResponseProductImage[];
  }[];
}

interface PickingListResponseProductImage extends ResourceObject {
  name: string;
  locale: string;
  images: [
    {
      externalUrlSmall: string;
      externalUrlLarge: string;
    }
  ];
}

interface StartPickingListResponse {
  data: PatchPickingListData;
  links: LinksObject;
  errors?: PickingListError[];
}

interface FinishPickingListResponse {
  data: PatchPickingListData[];
  links: LinksObject;
}

interface PatchPickingListData extends ResourceObject {
  status: string;
  updatedAt: string;
  createdAt: string;
}
