import { NodeRelationships, isWrappedNode, MaybeNode, QueryNode as IQueryNode } from '~/dom/defs.ts';
import { BaseNode } from '~/dom/adapter/epub-node.ts';
import { Element } from 'deno-dom/src/api.ts';
import { mixin } from '~/dom/adapter/mixin.ts';


export const QueryNode = <B extends BaseNode>(base: B): B & IQueryNode<Element, BaseNode> => {
  const { node, doc } = base;

  return mixin(base, {
    contains(other: Element | BaseNode): boolean {
      return node.contains(isWrappedNode(other) ? other.node : other);
    },

    /**
     * Note: querySelectAll returns NodeList, but BaseNode#create requires Element.
     * The query should only return Nodes that are {@link NodeType} type "ELEMENT"
     * so casting to {@link Element} should be fine
     * @param selector
     */
    find(selector: string): BaseNode[] {
      return Array.from(node.querySelectorAll(selector))
        // see note above
        .map(n => BaseNode.create(n as Element, doc));
    }
  })
}


export const ParentNode = <B extends BaseNode>(base: B): B & NodeRelationships<BaseNode> => {
  const { node, doc } = base;

  return mixin(base, {
    get children(): BaseNode[] {
      return Array.from(node.children).map(child => BaseNode.create(child, doc));
    },

    get hasChildren(): boolean {
      return node.hasChildNodes();
    },

    get childCount(): number {
      return node.childElementCount;
    },

    get isConnected(): boolean {
      return doc.contains(node);
    },

    get parent(): MaybeNode<BaseNode> {
      if (node.parentElement) {
        return BaseNode.create(node.parentElement, doc);
      } else {
        return null;
      }
    },

    next(): MaybeNode<BaseNode> {
      return node.nextElementSibling ? BaseNode.create(node.nextElementSibling, doc) : null;
    }
  });
}