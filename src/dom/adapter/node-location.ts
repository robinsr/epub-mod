import { CanFindNode, DomAdapter, TagLocation } from '~/dom/defs.ts';
import { Element } from 'deno-dom/src/dom/element.ts';
import NodeType from '~/dom/adapter/node-type.ts';


const isElement = <O extends { nodeType: number }> (obj: O): boolean => {
  return 'nodeType' in obj &&
    NodeType.has(obj.nodeType) &&
    Object.is(NodeType.has(obj.nodeType), 'ELEMENT');
}

class NodeLocation implements CanFindNode<Element> {
  private location: TagLocation = {
    startLine: null,
    startCol: null
  }

  constructor(elem: Element, dom: DomAdapter<unknown>) {
    if (isElement(elem)) {
      const location = dom.nodeLocation(elem);

      if (Object.hasOwn(location, 'startLine')) {
        this.location.startLine = location.startLine;
      }
    }
  }

  get startLine(): string {
    return this.location.startLine;
  }

  get startCol() {
    return this.location.startCol;
  }

  get lineNumber(): string {
    return String(this.location?.startLine).valueOf().padStart(4, '0') || 'NEW_NODE';
  }
}