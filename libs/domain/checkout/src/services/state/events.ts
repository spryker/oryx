import { QueryEvent } from '@spryker-oryx/core';
import { CheckoutResponse } from '../../models';

export const PlaceOrderStart = 'PlaceOrderStart';
export type PlaceOrderStart = QueryEvent;

export const PlaceOrderEnd = 'PlaceOrderEnd';
export type PlaceOrderEnd = QueryEvent;

export const PlaceOrderSuccess = 'PlaceOrderSuccess';
export type PlaceOrderSuccess = QueryEvent<CheckoutResponse>;

export const PlaceOrderFail = 'PlaceOrderFail';
export type PlaceOrderFail = QueryEvent<unknown>;
