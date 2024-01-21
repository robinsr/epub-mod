import logger from '~/util/log.ts';
import { IFileAdapter, DomAdapter, DomNode, MaybeNode, WrappedNode, TagLocation, isWrappedNode } from '~/dom/defs.ts';
import { Document, HTMLDocument, DOMParser, Element } from 'deno-dom/deno-dom-wasm.ts';
import { NodeList } from 'deno-dom/src/dom/node-list.ts';
import { BaseNode, BaseNode as EpubNode, FullNodeApi } from './epub-node.ts';


// @deno-types=https://cdn.jsdelivr.net/npm/html-format@1.1.2/index.d.ts
//import * as format from "html-format";

const log = logger("dom-adapter");

const format_indent = ' '.repeat(4);
const format_width = 2000;

const EMPTY = {};



export default class DenoDomAdapter implements DomAdapter<Element> {
  private doc: HTMLDocument;

  constructor(private adapter: IFileAdapter) {
    const contents = adapter.getContents();
    const parser = new DOMParser();
    this.doc = parser.parseFromString(contents, 'text/html') ?? EMPTY as HTMLDocument;

    if (Object.is(this.doc, EMPTY)) {
      throw new Error('Document not parsed');
    }
  }

  get body() {
    //return format(this.doc.body.outerHTML);
    return this.doc.body.outerHTML;
    //return format(this.dom.window.document.body.outerHTML, format_indent, format_width);
  }

  query(selector: string): FullNodeApi[] {
    let nodes: NodeList = this.doc.querySelectorAll('body ' + selector);

    log.debug(`Querying doc "${selector}"; found ${nodes.length} nodes`);

    return Array.from(nodes).map(node => {
      return EpubNode.create(node as Element, this);
    })
  }

  first(selector: string): MaybeNode<FullNodeApi> {
    const result: MaybeNode<Element> = this.doc.querySelector('body ' + selector);
    return result ? EpubNode.create(result, this) : null;
  }

  getNode(id: string): MaybeNode<FullNodeApi> {
    const result: MaybeNode<Element> = this.doc.querySelector(`[data-rid="${id}"]`);
    return result ? EpubNode.create(result, this ) : null;
  }

  contains(node: Element | BaseNode) {
    return this.doc.body.contains("node" in node ? node.node : node);
  }

  insert(node: WrappedNode<Element> | Element) {

    let elem = isWrappedNode(node) ? node.node : node;

    //this.doc.insertBefore(elem.parentNode, elem)
  }

  newNode(html: string): FullNodeApi {
    let div = this.doc.createElement('div');
    div.innerHTML = html.trim();

    // Change this to div.childNodes to support multiple top-level nodes.
    return EpubNode.create(div.children[0], this);
  }

  clean(): void {
    // this.query('[data-rid]').forEach(n => {
    //   n.removeAttr('data-rid');
    // });

    this.query('*').forEach(n => {
      n.removeAttr('data-rid');
    });
  }

  // deno-lint-ignore no-unused-vars
  locateNode(node: Element | WrappedNode<Element>): TagLocation {
    return { startLine: 0, startCol: 0 }
  }
}
