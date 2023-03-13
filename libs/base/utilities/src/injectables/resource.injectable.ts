import { DirectiveResult } from 'lit/directive.js';
import { Injectable } from './injectable';

export const ResourceInjectable = 'oryx.ResourceInjectable';

export interface ResourceInjectable {
  getUrl(token: string): DirectiveResult | undefined;
  getSource(token: string): DirectiveResult | undefined;
}

export const resourceInjectable = new Injectable<ResourceInjectable | null>(
  ResourceInjectable,
  null
);
