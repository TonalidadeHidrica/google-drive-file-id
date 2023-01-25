import { XT } from "./xt";

const addChild = (parentDiv: HTMLDivElement) => {
  const div = parentDiv.querySelector("div.KL4NAf");
  div?.prepend(
    XT(document, [["a", [{ href: "https://google.com" }, "ID"]]])
  );
  console.log("after: ", parentDiv.outerHTML);
};

const nodeObserver = new MutationObserver((records) => {
  const record = records[0];
  if (record.removedNodes.length) {
    // console.log("Oh no, removed!", record.removedNodes);
    // console.log("target: ", record.target);
    addChild(<HTMLDivElement>record.target);
  }
});

const childObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof HTMLElement) {
        for (const div of node.querySelectorAll(`div[jsmodel="aDmR9e"]`)) {
          const id = div.attributes.getNamedItem("data-id")?.value;
          if (!id) continue;
          const parentDiv = div.querySelector("div.uXB7xe");
          if (!parentDiv) continue;
          console.log("before: ", parentDiv.outerHTML);

          nodeObserver.observe(parentDiv, {
            subtree: true,
            childList: true,
          });

          addChild(parentDiv);

          return;
        }
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
