import logger from '~/util/log.ts';
import { nodeType, isElement, isText } from '~/dom/adapter/node-type.ts';
import {
  ContentNode,
  DomAdapter,
  DomNode, NodeRelationships,
  TrackedNode, WithAttributes, WithClasslist,
  isWrappedNode, WrappedNode,
} from '~/dom/defs.ts';
import { nanoid } from "nanoid/nanoid.ts";
import { Element as DElement } from 'deno-dom/src/dom/element.ts';
import { EpubNodeClasslist, NodeAttributes } from '~/dom/adapter/node-attributes.ts';
import { NodeContent } from '~/dom/adapter/node-content.ts';
import { ParentNode, QueryNode } from '~/dom/adapter/node-relation.ts';
import { mixin} from '~/dom/adapter/mixin.ts';

const log = logger(import.meta.url);

const nodeID = <B extends BaseNode>(base: B): B & TrackedNode => {
  let _id: string = nanoid(8);

  return mixin(base, {
    get id() {
      // return String(this.node?.dataset?.rid).valueOf() || '?';
      return _id;
    },
    setId(str: string) {
      // this should set the actual id
      // this.node.dataset.rid = str;
      _id = str;
    }
  });
}


export type ConstructedNode = BaseNode & ContentNode & WithClasslist & WithAttributes & NodeRelationships<BaseNode>;
export type FullNodeApi = BaseNode & ContentNode & WithClasslist & WithAttributes & NodeRelationships<BaseNode>;

export class BaseNode implements DomNode<DElement> {
  private nodeImpl: DElement;
  doc: DomAdapter<DElement>;

  private static objectCache = new Map<DElement, ConstructedNode>();

  static create(elem: DElement, doc: DomAdapter<DElement>): FullNodeApi {
    if (this.objectCache.has(elem)) {
      return this.objectCache.get(elem)!;
    }

    let base = QueryNode(ParentNode(
        NodeAttributes(EpubNodeClasslist(
          NodeContent(nodeID(new BaseNode(elem, doc)))
        ))
      ));

    this.objectCache.set(elem, base);
    return base;
  }

  protected constructor(nodeImpl: DElement, doc: DomAdapter<DElement>) {
    this.nodeImpl = nodeImpl;
    this.doc = doc;
  }

  get node(): DElement {
    return this.nodeImpl;
  }

  get tag() {
    if (this.node.tagName) {
      return this.node.tagName.toLowerCase();
    } else if (this.node.outerHTML) {
      let tagMatch = /<(\w+)/.exec(this.node.outerHTML);
      return  tagMatch ? tagMatch[1] : '?';
    } else {
      return '?';
    }
  }

  get nodeType() {
    return nodeType(this.node);
  }

  get isElement() {
    return isElement(this.node);
  }

  get isText() {
    return isText(this.node);
  }

  matches(selector: string) {
    return this.node.matches(selector);
  }

  isSameNode(node: DElement | WrappedNode<DElement>) {
    if (node instanceof DElement) {
      return Object.is(this.node, node);
    }  else {
      return Object.is(this.node, (node as DomNode<DElement>).node);
    }
  }

  clone() {
    return BaseNode.create(this.node.cloneNode(true) as DElement, this.doc);
  }

  create(node: DElement): BaseNode {
    return BaseNode.create(node, this.doc);
  }

  replace(other: DElement | WrappedNode<DElement>) {
    const { node, doc, toString } = this;

    const otherNode = isWrappedNode(other) ? other.node : other;

    log.debug(`Replacing node:\n\t${this.toString()}\n\t${other.toString()}`)

    if (this.isSameNode(other)) {
      log.error('Replacing is same node!');
      return;
    }

    if (!doc.contains(node)) {
      log.error('Node is not in the doc!', toString());
      return;
    }

    if (!node.parentNode) {
      log.error(`no parent node for node ${toString()}`)
      doc.first('body')?.node.replaceChild(otherNode, node);
    } else {
      node.parentNode.replaceChild(otherNode, node);
    }

    this.nodeImpl = otherNode;
  }

  remove() {

  }

  toString(): string {
    if ("id" in this) {
      return `${this["id"]}: ${this.tag}`;
    } else {
      return this.tag;
    }
  }
}
