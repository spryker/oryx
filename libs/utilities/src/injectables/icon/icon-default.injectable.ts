import { TemplateResult } from 'lit';
import { Injectable } from '../injectable';
import { DefaultIconInjectable } from './icon.injectable';

export const IconInjectable = 'FES.IconInjectable';

export interface IconInjectable {
  render(type?: string, spriteUrl?: string): TemplateResult;
}

export const iconInjectable = new Injectable<IconInjectable>(
  IconInjectable,
  new DefaultIconInjectable()
);
