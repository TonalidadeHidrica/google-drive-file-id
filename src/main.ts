import { XT } from "./xt";

const ORIGINAL_TAG_KEY = "data-gfdi";
const ORIGINAL_TAG_VALUE = "1";
const FILE_ID_KEY = "data-id";

const addChild = (parentDiv: HTMLDivElement, fileId: string) => {
  parentDiv?.prepend(
    XT(document, [
      [
        "a",
        [
          {
            href: "#",
            [ORIGINAL_TAG_KEY]: ORIGINAL_TAG_VALUE,
            [FILE_ID_KEY]: fileId,
            class: "gfdi-link",
          },
          "ID",
        ],
        {
          onclick: () => navigator.clipboard.writeText(fileId),
          ondblclick: (event) => event.stopPropagation(),
        },
      ],
    ])
  );
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

document.querySelector("head")?.append(
  XT(document, [
    [
      "style",
      [
        `
  a.gfdi-link {
    padding-right: 5px;
    color: lightgray;
  }

  a.gfdi-link:active {
    animation: gfdi-blink 200ms;
  }

  @keyframes gfdi-blink {
    0% {
      color: black;
    }
    100% {
      color: lightgray;
    }
  }
`,
      ],
    ],
  ])
);
