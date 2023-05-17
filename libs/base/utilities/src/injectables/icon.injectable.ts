import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Injectable } from './injectable';

export const IconInjectable = 'oryx.IconInjectable';

export interface IconInjectable {
  render(type: string): Observable<TemplateResult | undefined>;
}

export const iconInjectable = new Injectable<IconInjectable | null>(
  IconInjectable,
  null
);
