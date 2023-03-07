import { Injectable } from './injectable';

export const RootInjectable = 'oryx.RootInjectable';

export const rootInjectable = new Injectable<string>(RootInjectable, 'body');
