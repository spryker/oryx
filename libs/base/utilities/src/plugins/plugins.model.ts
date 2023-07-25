export interface BuilderPlugin<T = unknown> {
  getName(): string;
  apply(app: T): void | Promise<void>;
  destroy?(app?: T): void;
}
