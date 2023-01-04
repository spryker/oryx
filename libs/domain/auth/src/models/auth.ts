export const enum AuthHeaderTypes {
  Authorization = 'Authorization',
  AnonymousCustomerUniqueId = 'X-Anonymous-Customer-Unique-Id',
}

declare module '@spryker-oryx/utilities' {
  export interface HttpHeaders {
    [AuthHeaderTypes.AnonymousCustomerUniqueId]?: string;
    [AuthHeaderTypes.Authorization]?: string;
  }
}
