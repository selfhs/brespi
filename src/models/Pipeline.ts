import { Parser } from "@/parsing/Parser";
import z from "zod/v4";
import { PipelineStep } from "./PipelineStep";

export type Pipeline = {
  id: string;
  name: string;
  steps: PipelineStep[];
};

export namespace Pipeline {
  export const parse = Parser.create<Pipeline>(
    z.object({
      id: z.string(),
      name: z.string(),
      steps: z.array(PipelineStep.parse.SCHEMA),
    }),
  );
}
