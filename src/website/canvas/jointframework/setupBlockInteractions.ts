import { dia } from "@joint/core";
import { RefObject } from "react";
import { Block } from "../Block";
import { getLighterColor, resetToDefaultColor } from "./colorHelpers";

type Options = {
  paper: dia.Paper;
  graph: dia.Graph;
  blocksRef: RefObject<Block[]>;
  notifyBlocksChange: () => void;
  activeBlockId: string | undefined;
  setActiveBlockId: (id: string | undefined) => void;
};

export function setupBlockInteractions({ graph, paper, notifyBlocksChange, activeBlockId, setActiveBlockId }: Options) {
  // Handle block clicks (activate/highlight)
  paper.on("element:pointerclick", (elementView, evt) => {
    const clickedElement = elementView.model;
    const elementId = clickedElement.id as string;

    // Check if click was on a port
    const target = evt.target as Element;
    const portElement = target.closest("[port]");

    if (portElement) {
      const portName = portElement.getAttribute("port");
      console.log("Clicked on port:", portName);

      // If clicking on input port, delete incoming link
      if (portName === "input") {
        const incomingLinks = graph.getConnectedLinks(clickedElement, { inbound: true });
        if (incomingLinks.length > 0) {
          incomingLinks[0].remove();
          console.log("Removed incoming link from block:", clickedElement.id);
          notifyBlocksChange();
          return;
        }
      }
      return;
    }

    // Check if clicking the already active block (deactivate)
    if (elementId === activeBlockId) {
      resetToDefaultColor(clickedElement);
      setActiveBlockId(undefined);
      console.log("Deactivated block:", elementId);
      return;
    }

    // Reset all blocks to default colors
    graph.getElements().forEach((el) => {
      resetToDefaultColor(el);
    });

    // Highlight clicked block
    const currentFill = clickedElement.attr("body/fill") as string;
    const lighterFill = getLighterColor(currentFill);
    clickedElement.attr("body/fill", lighterFill);

    setActiveBlockId(elementId);
    console.log("Active block:", {
      id: elementId,
      type: clickedElement.attr("label/text"),
    });
  });

  // Notify when block is moved
  paper.on("element:pointerup", () => {
    notifyBlocksChange();
  });
}
