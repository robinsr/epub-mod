import { NodeAttrMap, WithAttributes, WithClasslist, WrappedNode } from '~/dom/defs.ts';
import { Element } from 'deno-dom/src/dom/element.ts';
import { mixin } from '~/dom/adapter/mixin.ts';
import { isElement } from '~/dom/adapter/node-type.ts';


export const NodeAttributes = <B extends WrappedNode<Element>>(base: B): B & WithAttributes => {
  const { node } = base;

  return mixin(base, {
    get attrs(): NodeAttrMap {
      return Array.from(node.attributes).reduce((acc, attr) => ({
         ...acc, [attr.name]: attr.value
      }), {});
    },

    hasAttr(attribute: string) {
      return node.hasAttribute(attribute);
    },

    getAttr(attribute: string) {
      return node.getAttribute(attribute);
    },

    setAttr(attribute: string, value: string) {
      node.setAttribute(attribute, value);
    },

    removeAttr(attribute: string) {
      node.removeAttribute(attribute);
    }
  });
}


export const EpubNodeClasslist = <B extends WrappedNode<Element>>(base: B): B & WithClasslist => {
  const { node } = base;

  return mixin(base, {
    get classList() {
      return isElement(node) ? [ ...node.classList ] : [];
    },

    hasClass(className: string) {
      return [ ...node.classList ].includes(className);
    },

    addClass(className: string) {
      node.classList.add(className);
    },

    /** @unused */
    removeClass(className: string) {
      node.classList.remove(className);
    }
  });
}
