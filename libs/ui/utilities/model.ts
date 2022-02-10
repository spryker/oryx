import { LitElement } from 'lit';

export interface OryxElement<T> extends LitElement {
  options: T;
}
