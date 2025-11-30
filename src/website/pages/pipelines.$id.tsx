import { ProblemDetails } from "@/models/ProblemDetails";
import { PipelineView } from "@/views/PipelineView";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { PipelineClient } from "../clients/PipelineClient";
import { QueryKey } from "../clients/QueryKey";
import { ErrorDump } from "../comps/ErrorDump";
import { Paper } from "../comps/Paper";
import { Skeleton } from "../comps/Skeleton";
import { Spinner } from "../comps/Spinner";
import { useRegistry } from "../hooks/useRegistry";
import "./pipelines.$id.css";
import { Button } from "../comps/Button";
import { Canvas } from "../canvas/Canvas";
import { Block } from "../canvas/Block";
import { Step } from "@/models/Step";
import { useRef, useState } from "react";
import { SquareIcon } from "../comps/SquareIcon";

export function pipelines_$id() {
  const { id } = useParams();
  const pipelineClient = useRegistry.instance(PipelineClient);

  const query = useQuery<PipelineWithBlocks, ProblemDetails>({
    queryKey: [QueryKey.pipelines, id],
    queryFn: () => pipelineClient.find(id!).then<PipelineWithBlocks>(PipelineWithBlocks.convert),
  });

  const canvas = useRef<Canvas.Api>(null);
  const [mode, setMode] = useState<"viewing" | "editing">("editing");

  const handleBlocksChange = (updatedBlocks: Block[]) => {
    console.log(updatedBlocks);
  };

  return (
    <Skeleton>
      <Paper className="col-span-full u-subgrid">
        {query.error ? (
          <div className="col-span-full p-6 text-center">
            <ErrorDump error={query.error} />
          </div>
        ) : !query.data ? (
          <div className="col-span-full p-6 text-center">
            <Spinner />
          </div>
        ) : (
          <>
            {/* HEADER */}
            <div className="col-span-full p-6 flex justify-between items-center">
              <h1 className="text-xl font-extralight">{query.data.name}</h1>
              <div className="flex gap-4">
                <Button icon="play">Execute</Button>
                <Button>Edit</Button>
              </div>
            </div>
            {/* CANVAS */}
            <div className="col-span-full px-6 h-[400px]">
              <Canvas
                ref={canvas}
                mode={mode}
                initialBlocks={query.data.blocks}
                onBlocksChange={handleBlocksChange}
                className="border-2 border-black rounded-lg"
              />
            </div>
            {/* DETAILS */}
            <div className="col-span-6 p-6">
              <h2 className="mb-6 text-xl font-extralight">Execution History</h2>
              {query.data.executions.map((execution) => (
                <button key={execution.id} className="mt-4 flex items-center text-left gap-4 group cursor-pointer">
                  <SquareIcon variant={execution.outcome} className="group-hover:bg-c-dim/20" />
                  <div>
                    <h3 className="text-base font-medium group-hover:text-white">
                      {execution.outcome === "success" ? "Successfully executed" : "Failed to execute"}
                    </h3>
                    <p className="font-light italic text-c-dim">{execution.completedAt.toLocaleString()}</p>
                  </div>
                </button>
              ))}
              {query.data.executions.length === 0 && <SquareIcon variant="no_data" />}
            </div>
            {query.data.executions.length > 0 && (
              <div className="col-span-6 p-6">
                <h2 className="mb-6 text-xl font-extralight">Execution Details</h2>
                <p className="text-c-dim font-extralight">Select an execution to see its details.</p>
              </div>
            )}
          </>
        )}
      </Paper>
    </Skeleton>
  );
}

type PipelineWithBlocks = PipelineView & {
  blocks: Block[];
};

namespace PipelineWithBlocks {
  export function convert(pipeline: PipelineView): PipelineWithBlocks {
    return {
      ...pipeline,
      blocks: pipeline.steps.map((step) => {
        const handles: Record<Step.Category, Block.Handle[]> = {
          [Step.Category.producer]: [Block.Handle.output],
          [Step.Category.transformer]: [Block.Handle.output, Block.Handle.input],
          [Step.Category.consumer]: [Block.Handle.input],
        };
        return {
          id: step.id,
          incomingId: step.previousStepId,
          coordinates: { x: 0, y: 0 },
          label: step.type,
          handles: handles[Step.getCategory(step)],
        };
      }),
    };
  }
}
