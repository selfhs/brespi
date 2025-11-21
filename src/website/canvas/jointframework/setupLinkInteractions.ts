import { dia } from "@joint/core";

export function setupLinkInteractions(graph: dia.Graph, notifyBlocksChange: () => void) {
  graph.on("add", (cell) => {
    if (cell.isLink()) {
      // Listen for when this link gets a target
      cell.on("change:target", () => {
        const target = cell.get("target");
        // Only notify if target is an actual element (has id), not just mouse coordinates
        if (target && target.id) {
          console.log("Link connected to target, notifying parent");
          notifyBlocksChange();
        }
      });
    }
  });

  // Notify when link is removed
  graph.on("remove", (cell) => {
    if (cell.isLink()) {
      console.log("Link removed, notifying parent");
      notifyBlocksChange();
    }
  });
}
