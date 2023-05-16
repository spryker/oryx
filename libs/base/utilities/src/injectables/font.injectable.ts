import { Injectable } from './injectable';

export const FontInjectable = 'oryx.FontInjectable';

export interface FontInjectable {
  setFont(id: string): void;
}

export const fontInjectable = new Injectable<FontInjectable | null>(
  FontInjectable,
  null
);
