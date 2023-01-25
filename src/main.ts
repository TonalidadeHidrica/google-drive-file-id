import { XT } from "./xt";

const childObserver = new MutationObserver((records) => {
  for (const record of records) {
    for (const node of record.addedNodes) {
      if (node instanceof HTMLElement) {
        for (const div of node.querySelectorAll(`div[jsmodel="aDmR9e"]`)) {
          const id = div.attributes.getNamedItem("data-id")?.value;
          if (!id) continue;
          const parentDiv = div.querySelector("div.uXB7xe");
          if (!parentDiv) continue;
          console.log("before: ", parentDiv);
          parentDiv.appendChild(
            document.createElement("a")
            // XT(document, [["a", [{ href: "https://google.com" }, "ID"]]])
          );
          console.log("after: ", parentDiv);
          console.log("Refreshed");
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
