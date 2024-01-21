import {
  DomAdapter,
  DomNode,
  ContentNode,
  INodeIdentity,
  NodeRelationships,
  TagNode,
  TrackedNode,
  WithClasslist,
} from '~/dom/defs.ts';
import { truncate } from "~/util/string.ts";


type Tagged = INodeIdentity & WithClasslist & NodeRelationships & TrackedNode & ContentNode;

const TaggedNode = <T extends Tagged>(node: T) => {
  Object.assign(node, {
    get selectors() {
      if (!node.classList.length) {
        return [ node.tag ];
      }

      return node.classList.map(cls => `${node.tag}.${cls}`);
    },

    get selector() {
      if (!node.classList.length) {
        return node.tag;
      }

      return `${node.tag}.${node.classList.join('.')}`
    },

    get tagSummary(): string {
      let tag = `<#${node.id}${this.selector}(${node.nodeType})>`;
      let child = node.childCount || 0;
      let content = truncate(node.text || 'EMPTY', 80);

      if (location) {
        return `${location}: ${tag}⇒[${child}], contents: ${content}`;
      }

      return `${tag}⇒[${child}], contents: ${content}`;
    }
  });
}

export default TaggedNode;
