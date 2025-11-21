import { Block } from "./Block";

export type BlockWithProposedHandle = Block & {
  proposedHandle: Block.Handle;
};
