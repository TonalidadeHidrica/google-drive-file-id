// XT.js - https://gist.github.com/romainl/d19839428875da7c054c

export type ElementSpec = [string, ChildrenSpec[]];

export type ChildrenSpec = string | { [key: string]: string } | ElementSpec;

function nodeRender(
  doc: Document,
  parentNode: HTMLElement,
  children: ChildrenSpec[]
) {
  for (const child of children) {
    if ("" + child === child) {
      parentNode.appendChild(doc.createTextNode(child));
    } else if (Array.isArray(child)) {
      const [tag, values] = child;
      const element = doc.createElement(tag);
      nodeRender(doc, element, values);
      parentNode.appendChild(element);
    } else {
      for (const [key, value] of Object.entries(child))
        parentNode.setAttribute(key, value);
    }
  }
}

export const XT = (
  doc: Document,
  elements: ElementSpec[]
): DocumentFragment => {
  const docFrag = doc.createDocumentFragment();
  for (const [tag, values] of elements) {
    const element = doc.createElement(tag);
    nodeRender(doc, element, values);
    // console.log("Rendered: ", element);
    docFrag.append(element);
    // console.log("Appended: ", docFrag);
  }
  return docFrag;
};
