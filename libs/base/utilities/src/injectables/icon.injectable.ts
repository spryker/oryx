import { LitElement, TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Injectable } from './injectable';

export const IconInjectable = 'oryx.IconInjectable';
export type IconHost = LitElement & { direction?: boolean };

export interface IconInjectable {
  getIcons(): Record<string, unknown>;
  render(type: string, host?: IconHost): Observable<TemplateResult | undefined>;
}

export const iconInjectable = new Injectable<IconInjectable | null>(
  IconInjectable,
  null
);
