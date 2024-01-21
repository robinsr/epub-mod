import { ContentNode } from '~/dom/defs.ts';
import { BaseNode } from '~/dom/adapter/epub-node.ts';
import { mixin } from '~/dom/adapter/mixin.ts';


export const NodeContent = <B extends BaseNode>(base: B): B & ContentNode => {
  const { node } = base;

  return mixin(base, {
    get outer() {
      return node.outerHTML;
    },
    set outer(htmlStr) {
      node.outerHTML = htmlStr;
    },
    get domString() {
      return node.outerHTML.replaceAll(/\s?data-rid="[\d\w]+"\s?/g, '');
    },
    get inner() {
      return node.innerHTML;
    },
    set inner(htmlStr) {
      node.innerHTML = htmlStr;
    },
    get text() {
      return node.textContent || '';
    },
    set text(textStr: string) {
      node.textContent = textStr;
    }
  });
}