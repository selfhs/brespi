export type Block = {
  id: string;
  incomingId?: string;
  label: string;
  handles: Block.Handle[];
};

export namespace Block {
  export enum Handle {
    input = "input",
    output = "output",
  }
}
