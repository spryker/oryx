import { TemplateResult } from 'lit';
import { Injectable } from './injectable';

export const IconInjectable = 'oryx.IconInjectable';

export interface IconInjectable {
  render(type: string, spriteUrl: string): TemplateResult | undefined;
}

export const iconInjectable = new Injectable<IconInjectable | null>(
  IconInjectable,
  null
);
