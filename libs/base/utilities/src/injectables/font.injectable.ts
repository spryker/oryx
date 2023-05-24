import { Observable } from 'rxjs';
import { Injectable } from './injectable';

export const FontInjectable = 'oryx.FontInjectable';

export interface FontInjectable {
  setFont(id: string, font?: string): Observable<boolean>;
}

export const fontInjectable = new Injectable<FontInjectable | null>(
  FontInjectable,
  null
);
