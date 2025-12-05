import { dia } from "@joint/core";
import { Block } from "../../Block";

export namespace StylingHelper {
  export function synchronizeBlockStylingWithCell<C extends dia.Cell>({ selected, handles }: Block, cell: C): C {
    const hasInput = handles.includes(Block.Handle.input);
    const hasOutput = handles.includes(Block.Handle.output);

    const defaultClass = "fill-c-artifact-fill stroke-c-artifact-stroke";
    const defaultUnusedClass = "fill-gray-300 stroke-c-dim";
    const selectedClass = "fill-c-dark stroke-c-info";
    const selectedUnusedClass = "fill-gray-300 stroke-c-info";

    const className = {
      main: selected ? selectedClass : defaultClass,
      input: selected
        ? //
          hasInput
          ? selectedClass
          : selectedUnusedClass
        : //
          hasInput
          ? defaultClass
          : defaultUnusedClass,
      outputHandle: selected
        ? //
          hasOutput
          ? selectedClass
          : selectedUnusedClass
        : hasOutput
          ? defaultClass
          : defaultUnusedClass,
    };

    cell.attr("body/class", className.main);
    cell.attr(`ports/${Block.Handle.input}/rect/class`, className.input);
    cell.attr(`ports/${Block.Handle.output}/rect/class`, className.outputHandle);
    return cell;
  }
}
