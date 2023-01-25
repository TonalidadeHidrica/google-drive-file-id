// XT.js - https://gist.github.com/romainl/d19839428875da7c054c

export type ElementSpec = [
  string,
  ChildrenSpec[],
  {
    onclick?: GlobalEventHandlers["onclick"];
    ondblclick?: GlobalEventHandlers["ondblclick"];
  }?
];

export type ChildrenSpec = string | { [key: string]: string } | ElementSpec;

const createElement = (doc: Document, child: ElementSpec): HTMLElement => {
  const [tag, children, additionals] = child;
  const element = doc.createElement(tag);
  nodeRender(doc, element, children);
  element.onclick = additionals?.onclick ?? null;
  element.ondblclick = additionals?.ondblclick ?? null;
  return element;
};

function nodeRender(
  doc: Document,
  parentNode: HTMLElement,
  children: ChildrenSpec[]
) {
  for (const child of children) {
    if ("" + child === child) {
      parentNode.appendChild(doc.createTextNode(child));
    } else if (Array.isArray(child)) {
      parentNode.appendChild(createElement(doc, child));
    } else {
      for (const [key, value] of Object.entries(child)) {
        parentNode.setAttribute(key, value);
      }
    }
  }
}

export const XT = (
  doc: Document,
  elements: ElementSpec[]
): DocumentFragment => {
  const docFrag = doc.createDocumentFragment();
  for (const element of elements) {
    docFrag.append(createElement(doc, element));
  }
  return docFrag;
};
