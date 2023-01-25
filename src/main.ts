import { XT } from "./xt";

const ORIGINAL_TAG_KEY = "data-gfdi";
const ORIGINAL_TAG_VALUE = "1";
const FILE_ID_KEY = "data-id";

const addChild = (parentDiv: HTMLDivElement, fileId: string) => {
  // const div = parentDiv.querySelector("div.KL4NAf");
  parentDiv?.prepend(
    XT(document, [
      [
        "a",
        [
          {
            href: "#",
            [ORIGINAL_TAG_KEY]: ORIGINAL_TAG_VALUE,
            style: "padding-right: 5px",
            [FILE_ID_KEY]: fileId,
          },
          "ID",
        ],
        {
          onclick: (event) => {
            navigator.clipboard.writeText(fileId);
            event.stopPropagation();
          },
        },
      ],
    ])
  );
  // console.log("after: ", parentDiv.outerHTML);
};

const nodeObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const removed of record.removedNodes) {
      if (
        removed instanceof HTMLElement &&
        removed.attributes.getNamedItem(ORIGINAL_TAG_KEY)?.value ===
          ORIGINAL_TAG_VALUE
      ) {
        const fileId = removed.attributes.getNamedItem(FILE_ID_KEY)!.value;
        addChild(<HTMLDivElement>record.target, fileId);
      }
    }
  }
});

const inspectDescendants = (node: HTMLElement) => {
  for (const div of node.querySelectorAll(`div[jsmodel="aDmR9e"]`)) {
    // console.log(div);
    const fileId = div.attributes.getNamedItem("data-id")?.value;
    if (!fileId) continue;
    const parentDiv = div.querySelector("div.KL4NAf");
    if (!parentDiv) continue;

    nodeObserver.observe(parentDiv, {
      subtree: true,
      childList: true,
    });

    addChild(parentDiv, fileId);
  }
};

const childObserver = new MutationObserver((records) => {
  // console.log(records);
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof HTMLElement) {
        inspectDescendants(node);
      }
    }
  }
});

const toplevelObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof HTMLElement) {
        if (
          node.attributes.getNamedItem("guidedhelpid")?.value ==
          "main_container"
        ) {
          // console.log(node);
          inspectDescendants(node);
          childObserver.observe(node, {
            subtree: true,
            childList: true,
          });
        }
      }
    }
  }
});

const elem = document.querySelector(`html`);
if (elem !== null) {
  toplevelObserver.observe(elem, {
    subtree: true,
    childList: true,
  });
}

// setTimeout(() => {
//   const elem = document.querySelector("div.uXB7xe");
//   // console.log(elem?.outerHTML);
//   const child = document.createElement("a");
//   child.innerText = "Hello world!";
//   elem?.appendChild(child);
//   // console.log(elem?.outerHTML);
// }, 5000);
