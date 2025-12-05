import { Step } from "@/models/Step";
import { ObjectFlatten } from "@/types/ObjectFlatten";
import { StepFlatten } from "@/types/StepFlatten";

const categoryLabels: Record<Step.Category, string> = {
  [Step.Category.producer]: "Artifact producers",
  [Step.Category.transformer]: "Artifact transformers",
  [Step.Category.consumer]: "Artifact consumers",
};

const typeLabels: Record<Step.Type, string> = {
  [Step.Type.filesystem_read]: "Filesystem Read",
  [Step.Type.filesystem_write]: "Filesystem Write",
  [Step.Type.postgres_backup]: "Postgres Backup",
  [Step.Type.postgres_restore]: "Postgres Restore",
  [Step.Type.compression]: "Compression",
  [Step.Type.decompression]: "Decompression",
  [Step.Type.encryption]: "Encryption",
  [Step.Type.decryption]: "Decryption",
  [Step.Type.folder_flatten]: "Folder Flatten",
  [Step.Type.folder_group]: "Folder Group",
  [Step.Type.script_execution]: "Script Execution",
  [Step.Type.s3_upload]: "S3 Upload",
  [Step.Type.s3_download]: "S3 Download",
};

type DetailLabels = {
  [T in Step.Type]: Record<keyof StepFlatten<T>, string>;
};
// const detailLabels: DetailLabels = {
//   [Step.Type.filesystem_read]: {
//     path: "Path",
//   },
//   [Step.Type.filesystem_write]: {
//     path: "Path",
//   },
//   [Step.Type.postgres_backup]: {},
//   [Step.Type.postgres_restore]: {},
//   [Step.Type.compression]: {},
//   [Step.Type.decompression]: {},
//   [Step.Type.encryption]: {},
//   [Step.Type.decryption]: {},
//   [Step.Type.folder_flatten]: {},
//   [Step.Type.folder_group]: {},
//   [Step.Type.script_execution]: {},
//   [Step.Type.s3_upload]: {},
//   [Step.Type.s3_download]: {},
// };

export namespace StepTranslation {}
