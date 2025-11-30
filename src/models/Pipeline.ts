import { Parser } from "@/parsing/Parser";
import z from "zod/v4";
import { Step } from "./Step";

export type Pipeline = {
  id: string;
  name: string;
  steps: Step[];
};

export namespace Pipeline {
  const schema = z.object({
    id: z.string(),
    name: z.string(),
    steps: z.array(Step.parse.SCHEMA),
  });
  export const parse = Parser.fromSchema<Pipeline, z.Infer<typeof schema>>(schema).ensureTypeEquivalence();
}
