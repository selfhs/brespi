import { Coordinates } from "./Coordinates";

export type Block = {
  id: string;
  incomingId?: string;
  coordinates: Coordinates;
  label: string;
  handles: Block.Handle[];
};

export namespace Block {
  export enum Handle {
    input = "input",
    output = "output",
  }
}
