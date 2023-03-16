export class RestorableEntity {
  static from<T>(this: new () => T, data: Partial<T>): T {
    const entity = new this();
    Object.assign(entity, data);
    return entity;
  }
}
