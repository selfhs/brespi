import { Pipeline } from "./Pipeline";
import { PipelineStep } from "./PipelineStep";

export namespace PipelineData {
  export const POSTGRES_BACKUP: Pipeline = {
    id: Bun.randomUUIDv7(),
    name: "My Postgres Backup Pipeline",
    steps: [
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.postgres_backup,
        databases: {
          selection: "all",
        },
      },
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.compression,
        algorithm: "targzip",
        targzip: {
          level: 9,
        },
      },
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.encryption,
        algorithm: "aes256cbc",
        keyReference: "SYMMETRIC_KEY",
      },
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.s3_upload,
        accessKeyReference: "ACCESS_KEY",
        secretKeyReference: "SECRET_KEY",
        namespace: "some-random-parent-folder",
      },
    ],
  };

  export const WP_BACKUP: Pipeline = {
    id: Bun.randomUUIDv7(),
    name: "My Wordpress Pipeline for /wp-uploads (work in progress)",
    steps: [
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.fs_read,
        path: "/wordpress/wp-uploads",
        itemizeDirectoryContents: false,
      },
    ],
  };

  export const RESTORE: Pipeline = {
    id: Bun.randomUUIDv7(),
    name: "My Restore Pipeline",
    steps: [
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.s3_download,
        namespace: "some-random-parent-folder",
        artifact: "gamingworld",
        accessKeyReference: "ACCESS_KEY",
        secretKeyReference: "SECRET_KEY",
        selection: {
          strategy: "latest",
        },
      },
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.decryption,
        algorithm: "aes256cbc",
        keyReference: "SYMMETRIC_KEY",
      },
      {
        id: Bun.randomUUIDv7(),
        type: PipelineStep.Type.decompression,
        algorithm: "targzip",
      },
    ],
  };
}
