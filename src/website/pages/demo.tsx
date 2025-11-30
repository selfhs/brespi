import { Block } from "@/website/canvas/Block";
import { Canvas } from "@/website/canvas/Canvas";
import { useRef, useState } from "react";

export function demo() {
  const canvas = useRef<Canvas.Api>(null);
  const [mode, setMode] = useState<"viewing" | "editing">("editing");
  const [blocks, setBlocks] = useState<Block[]>(TESTDATA);

  const handleBlocksChange = (updatedBlocks: Block[]) => {
    setBlocks(updatedBlocks);
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Pipeline Overview</h1>

      <div className="mb-5 flex gap-2.5 items-center">
        <button
          onClick={() => setMode(mode === "viewing" ? "editing" : "viewing")}
          className={`px-5 py-2.5 text-base text-white border-none rounded cursor-pointer ${
            mode === "editing" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {mode === "editing" ? "Exit Edit Mode" : "Enter Edit Mode"}
        </button>
      </div>

      <Canvas
        ref={canvas}
        mode={mode}
        initialBlocks={blocks}
        onBlocksChange={handleBlocksChange}
        className="border-2 border-black rounded-lg shadow-md"
      />

      <pre className="bg-gray-100 p-2.5 rounded text-xs overflow-auto">{JSON.stringify(blocks, null, 2)}</pre>
    </div>
  );
}

const TESTDATA: Block[] = [
  {
    id: "p1",
    label: "Producer 1",
    handles: [Block.Handle.output],
  },
  {
    id: "t1",
    label: "Transformer 1",
    handles: [Block.Handle.input, Block.Handle.output],
  },
  {
    id: "c1",
    label: "Consumer 1",
    handles: [Block.Handle.input],
  },
  {
    id: "c2",
    label: "Consumer 2",
    handles: [Block.Handle.input],
  },
];
