export enum HeaderTypes {
  Authorization = 'Authorization',
  AnonymousCustomerUniqueId = 'X-Anonymous-Customer-Unique-Id',
}

export type AuthHeaders = Record<string, string>;
