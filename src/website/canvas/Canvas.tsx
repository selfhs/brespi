import { dia } from "@joint/core";
import { ReactElement, RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { Block } from "./Block";
import { createPaper } from "./jointframework/createPaper";
import { setupBlockInteractions } from "./jointframework/setupBlockInteractions";
import { setupLinkInteractions } from "./jointframework/setupLinkInteractions";
import { setupPanning } from "./jointframework/setupPanning";
import { BlockWithProposedHandle } from "./BlockWithProposedHandle";

/**
 * One-way databinding is strongly discouraged for the Canvas editor for performance reasons.
 * That's why the current implementation handles its own state, and reports back to the parent.
 */
type Props = {
  ref: RefObject<Canvas.Api | null>;
  mode: "viewing" | "editing";
  initialBlocks: Block[];
  onBlocksChange: (blocks: Block[]) => void;
  validateArrow: (source: BlockWithProposedHandle, target: BlockWithProposedHandle) => boolean;
  className?: string;
};

export function Canvas({ ref, mode, initialBlocks, onBlocksChange, validateArrow, className }: Props): ReactElement {
  const element = useRef<HTMLDivElement>(null);
  const [paper, setPaper] = useState<dia.Paper>();
  const [activeBlockId, setActiveBlockId] = useState<string>();

  // Keep track of blocks internally to report changes upwards
  const blocksRef = useRef(initialBlocks);
  // Helper to notify parent of changes - takes graph as parameter to avoid closure issues
  const notifyBlocksChange = (graphInstance: dia.Graph) => {
    const links = graphInstance.getLinks();
    const updatedBlocks = blocksRef.current.map((block) => {
      const cell = graphInstance.getCell(block.id);
      if (!cell) {
        return block;
      }
      const incomingLink = links.find((link) => {
        const target = link.target();
        return target.id === block.id;
      });
      const position = cell.position();
      return {
        ...block,
        coordinates: {
          x: position.x,
          y: position.y,
        },
        incomingId: incomingLink ? (incomingLink.source().id as string) : undefined,
      };
    });
    blocksRef.current = updatedBlocks;
    onBlocksChange(updatedBlocks);
  };

  // Initialize graph and paper (once)
  useEffect(() => {
    if (!element.current) return;

    const { graph, paper } = createPaper({
      element: element.current,
      blocksRef,
      validateArrow,
      initialBlocks,
    });

    const notifyBlocksChangeWithGraph = () => notifyBlocksChange(graph);
    setupBlockInteractions({
      graph,
      paper,
      blocksRef,
      notifyBlocksChange: notifyBlocksChangeWithGraph,
      activeBlockId,
      setActiveBlockId,
    });
    setupLinkInteractions(graph, notifyBlocksChangeWithGraph);
    const cleanupPanning = setupPanning(paper);

    setPaper(paper);
    return () => {
      cleanupPanning();
      paper.remove();
    };
  }, []);

  // Update interactivity when the mode changes
  useEffect(() => {
    if (paper) {
      const interactivity: dia.CellView.InteractivityOptions =
        mode === "editing"
          ? {
              elementMove: true,
              addLinkFromMagnet: true,
            }
          : {
              elementMove: false,
              addLinkFromMagnet: false,
            };
      paper.setInteractivity(interactivity);
    }
  }, [paper, mode]);

  // Expose the API
  useImperativeHandle(ref, () => {
    return {
      format: () => {
        console.log("~formatting~");
      },
    };
  });

  return <div ref={element} className={className} />;
}

export namespace Canvas {
  export type Api = {
    format: () => void;
  };
}
