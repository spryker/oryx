import { JsonApiModel } from '@spryker-oryx/utilities';

export module ApiUserModel {
  export interface User {
    firstName: string;
    lastName: string;
    email: string;
    gender?: string;
    dateOfBirth?: string;
    salutation?: string;
    createdAt?: string;
    updatedAt?: string;
    password?: string;
    confirmPassword?: string;
    acceptedTerms?: boolean;
  }

  export interface Payload {
    type: 'customers';
    id?: string;
    links?: unknown;
    attributes: Partial<User>;
  }

  export type Response = JsonApiModel<User, unknown>;
}
