import { Execution } from "@/models/Execution";
import { Pipeline } from "@/models/Pipeline";
import { Parser } from "@/parsing/Parser";
import z from "zod/v4";

export type PipelineView = Pipeline & {
  executions: Execution[];
};

export namespace PipelineView {
  const schema = Pipeline.parse.SCHEMA.and(
    z.object({
      executions: z.array(Execution.parse.SCHEMA),
    }),
  );
  export const parse = Parser.fromSchema<PipelineView, z.Infer<typeof schema>>(schema).ensureTypeEquivalence();
}
