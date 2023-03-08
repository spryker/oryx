export interface SSRStreamParserService {
  fillStream(stream: string): void;
  getStreamStack(): Record<string, string>[];
}

export class DefaultSSRStreamParserService implements SSRStreamParserService {
  protected stream = '';
  protected parsedStream = '';
  protected tagsStack: string[] = [];
  protected attributesStack: Record<string, string>[] = [];
  protected excluded: Record<string, boolean> = {
    area: true,
    base: true,
    br: true,
    col: true,
    embed: true,
    hr: true,
    img: true,
    input: true,
    link: true,
    meta: true,
    param: true,
    source: true,
    track: true,
    wbr: true,
  };
  protected prevTag = '';

  fillStream(stream: string): void {
    this.stream = stream;
  }

  getStreamStack(): Record<string, string>[] {
    let subStream = this.stream.replace(this.parsedStream, '');
    this.parsedStream = this.stream;
    !subStream.startsWith('<') && (subStream = `<${this.prevTag} ` + subStream);
    const stream = subStream
      .replace(/(\r\n|\n|\r)/gm, ' ')
      .replace(/<!--(.*?)-->/g, ' ')
      .split('<');
    this.prevTag = stream.at(-1) as string;

    for (let i = 0; i < stream.length; i++) {
      const streamEl = stream[i]
        .slice(0, stream[i].lastIndexOf('>') + 1)
        .trim();

      if (!streamEl.endsWith('>') || streamEl.startsWith('?')) {
        continue;
      }

      const tagData = streamEl.slice(0, -1);
      const tagDataArr = tagData.split(' ');
      const tagName = tagDataArr[0];

      if (this.excluded[tagName]) {
        continue;
      }

      const dataAttributes: Record<string, string> = {};

      for (let i = 1; i < tagDataArr.length; i++) {
        const attribute = tagDataArr[i];

        if (attribute.startsWith('data-')) {
          const [key, value] = attribute.split('=');
          const dataName = key.replace('data-', '');

          dataAttributes[dataName] = value.replace(/&quot;/g, '');
        }
      }

      if (Object.keys(dataAttributes).length) {
        this.tagsStack.push(tagName);
        this.attributesStack.push(dataAttributes);

        continue;
      }

      const closedTag = tagName.replace('/', '');
      const lastElementIndex = this.tagsStack.length - 1;
      const isClosed = this.tagsStack[lastElementIndex] === closedTag;

      if (isClosed) {
        this.tagsStack.splice(lastElementIndex, 1);
        this.attributesStack.splice(lastElementIndex, 1);
      }
    }

    return this.attributesStack;
  }
}
