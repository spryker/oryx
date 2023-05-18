import { TemplateResult } from 'lit';
import { Observable } from 'rxjs';
import { Injectable } from './injectable';

export const IconInjectable = 'oryx.IconInjectable';

export interface IconInjectable {
  getIcons(): Record<string, unknown>;
  render(type: string): Observable<TemplateResult | undefined>;
}

export const iconInjectable = new Injectable<IconInjectable | null>(
  IconInjectable,
  null
);
