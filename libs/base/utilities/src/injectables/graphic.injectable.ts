import { DirectiveResult } from 'lit/directive.js';
import { Injectable } from './injectable';

export const GraphicInjectable = 'oryx.GraphicInjectable';

export interface GraphicInjectable {
  getGraphics(): Record<string, unknown> | undefined;
  getUrl(token: string): DirectiveResult | undefined;
  getSource(token: string): DirectiveResult | undefined;
}

export const graphicInjectable = new Injectable<GraphicInjectable | null>(
  GraphicInjectable,
  null
);
