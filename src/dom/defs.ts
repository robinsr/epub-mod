import { NodeTypeLabel } from '~/dom/adapter/node-type.ts';
import { Option } from "optional";

export type MaybeNode<T> = T | null;


export interface SelectorComponents {
  selector: string;
  tag: string;
  classList: string[];
  namespaces: string[];
  preserveAll: boolean;
  preserveOther: boolean;
}

export interface ElementMap {
  [key: string]: string
}

export interface ParsedElementMap {
  [key: string]: {
    from: SelectorComponents;
    to: SelectorComponents;
  }
}

export interface TagNode {
  selectors: string[];
  selector: string;
  tagSummary: string;
}

export interface IFileAdapter {
  getContents(): string;
  saveContents(c: string): void;
  diffWith(u: string): void;
  get target(): string;
}


// should expand QueryNode (the dom is itself an element)
export interface DomAdapter<N> {
  get body(): string;
  query(selector: string): WrappedNode<N>[];
  first(selector: string): MaybeNode<WrappedNode<N>>;
  getNode(id: string): MaybeNode<WrappedNode<N>>;
  contains(node: N | WrappedNode<N>): boolean;
  insert(node: N | WrappedNode<N>): void;
  newNode(str: string): WrappedNode<N>;
  locateNode(node: N | WrappedNode<N>): TagLocation;
  clean(): void;
}

export interface TagLocation {
  startCol: MaybeNode<number>;
  startLine: MaybeNode<number>;
}

export interface TrackedNode {
  get id(): string;
  setId(str: string): void
}

export interface LexicalNode {
  location(): TagLocation;
}

export type NodeAttrMap = {
  [key: string]: string;
}

export interface WithAttributes {
  get attrs(): NodeAttrMap;
  hasAttr(attribute: string): boolean;
  getAttr(attribute: string): string | null;
  setAttr(attribute: string, value: string): void;
  removeAttr(attribute: string): void;
}

export interface WithClasslist {
  get classList(): string[];
  hasClass(className: string): boolean;
  addClass(className: string): void;
  removeClass(className: string): void;
}

export interface ContentNode {
  get outer(): string;
  get domString(): string;
  set outer(htmlStr: string);
  get inner(): string;
  set inner(htmlStr: string);
  get text(): string;
  set text(textStr: string);
}

export interface WrappedNode<N> {
  get node(): N;
}

export function isWrappedNode<T extends object>(node: T | WrappedNode<T>): node is WrappedNode<T> {
  return "node" in node;
}

type NodeCreator<E, B> = {
  create(node: E): B;
  clone(): B;
}

export interface QueryNode<E, W extends WrappedNode<E>> {
  find(selector: string): W[];
  contains(node: W | E): boolean;
}

export interface NodeRelationships<W extends WrappedNode<unknown>>{
  get children(): W[];
  get hasChildren(): boolean;
  get childCount(): number;
  get isConnected(): boolean;
  get parent(): MaybeNode<W>;
  next(): MaybeNode<W>;
}

export interface DomNode<N, D = DomAdapter<N>> extends NodeCreator<N, ThisType<N>>{
  get node(): N;
  get doc(): D;
  get tag(): string;
  get nodeType(): NodeTypeLabel;
  get isElement(): boolean;
  get isText(): boolean;
  matches(selector: string): boolean;
  isSameNode(node: N | WrappedNode<N>): boolean;
  replace(other: N | WrappedNode<N>): void;
  remove(): void;
  toString(): string;
}
