import { dia, shapes } from "@joint/core";
import { Block } from "../Block";
import { JointBlock } from "./types/JointBlock";
import { StylingHelper } from "./helpers/StylingHelper";

export function createCell(block: JointBlock) {
  const items: dia.Element.Port[] = [];
  const groups: Record<string, dia.Element.PortGroup> = {};

  const ioConnector = {
    width: 16,
    height: 16,
    borderRadius: 4,
    offset: 6,
  };

  // Input side
  items.push({ id: Block.Handle.input, group: Block.Handle.input });
  groups[Block.Handle.input] = {
    position: "left",
    markup: [{ tagName: "rect", selector: "rect" }],
    attrs: {
      rect: {
        width: ioConnector.width,
        height: ioConnector.height,
        x: -ioConnector.width - ioConnector.offset, // Position fully outside to the left
        y: -(ioConnector.height / 2), // Center vertically
        rx: ioConnector.borderRadius,
        ry: ioConnector.borderRadius,
        class: "",
        strokeWidth: 3,
        magnet: "passive",
      },
    },
  };

  // Output side
  items.push({ group: Block.Handle.output, id: Block.Handle.output });
  groups[Block.Handle.output] = {
    position: "right",
    markup: [{ tagName: "rect", selector: "rect" }],
    attrs: {
      rect: {
        width: ioConnector.width,
        height: ioConnector.height,
        x: ioConnector.offset, // Position fully outside to the right
        y: -(ioConnector.height / 2), // Center vertically
        rx: ioConnector.borderRadius,
        ry: ioConnector.borderRadius,
        class: "",
        strokeWidth: 3,
        magnet: true,
      },
    },
  };

  // Main body
  return StylingHelper.synchronizeBlockStylingWithCell(
    block,
    new shapes.standard.Rectangle({
      id: block.id,
      position: block.coordinates,
      size: { width: 80, height: 60 },
      markup: [
        { tagName: "rect", selector: "body" },
        { tagName: "text", selector: "label" },
      ],
      attrs: {
        body: {
          class: "",
          strokeWidth: 3,
          rx: 8, // Rounded corners (scaled down)
          ry: 8,
          width: "calc(w)",
          height: "calc(h)",
        },
        label: {
          text: block.label,
          // fill: "#000",
          class: "fill-c-dark",
          fontSize: 14,
          x: "calc(0.5*w)", // Center horizontally
          y: "calc(h+18)", // Below block
          textAnchor: "middle",
        },
      },
      ports: {
        groups,
        items,
      },
    }),
  );
}
