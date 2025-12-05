import { Step } from "@/models/Step";
import { ObjectFlatten } from "./ObjectFlatten";

export type StepFlatten<T extends Step.Type> = ObjectFlatten<Omit<Extract<Step, { type: T }>, "id" | "type" | "previousStepId">>;

export namespace StepFlatten {
  export function perform<T extends Step.Type>(step: Extract<Step, { type: T }>): StepFlatten<T> {
    const result = ObjectFlatten.perform(step);
    delete (result as Partial<Step>).id;
    delete (result as Partial<Step>).type;
    delete (result as Partial<Step>).previousStepId;
    return result as StepFlatten<T>;
  }
}
