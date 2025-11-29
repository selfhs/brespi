import z from "zod/v4";

export type PipelineStep =
  | PipelineStep.FsRead
  | PipelineStep.FsWrite
  | PipelineStep.PostgresBackup
  | PipelineStep.Compression
  | PipelineStep.Decompression
  | PipelineStep.Encryption
  | PipelineStep.Decryption
  | PipelineStep.S3Upload
  | PipelineStep.S3Download;

export namespace PipelineStep {
  export enum Type {
    fs_read = "fs_read",
    fs_write = "fs_write",
    postgres_backup = "postgres_backup",
    compression = "compression",
    decompression = "decompression",
    encryption = "encryption",
    decryption = "decryption",
    s3_upload = "s3_upload",
    s3_download = "s3_download",
  }

  export enum Category {
    producer = "producer",
    transformer = "transformer",
    consumer = "consumer",
  }

  type Common = {
    id: string;
    previousStepId?: string;
  };

  export type FsRead = Common & {
    type: Type.fs_read;
    path: string;
    itemizeDirectoryContents: boolean;
  };

  export type FsWrite = Common & {
    type: Type.fs_write;
    path: string;
  };

  export type PostgresBackup = Common & {
    type: Type.postgres_backup;
    databases:
      | { selection: "all" }
      //
      | { selection: "include"; include: string[] }
      //
      | { selection: "exclude"; exclude: string[] };
  };

  export type Compression = Common & {
    type: Type.compression;
    algorithm: "targzip";
    targzip: {
      level: number;
    };
  };

  export type Decompression = Common & {
    type: Type.decompression;
    algorithm: "targzip";
  };

  export type Encryption = Common & {
    type: Type.encryption;
    algorithm: "aes256cbc";
    keyReference: string;
  };

  export type Decryption = Common & {
    type: Type.decryption;
    algorithm: "aes256cbc";
    keyReference: string;
  };

  export type S3Upload = Common & {
    type: Type.s3_upload;
    accessKeyReference: string;
    secretKeyReference: string;
    namespace: string;
  };

  export type S3Download = Common & {
    type: Type.s3_download;
    accessKeyReference: string;
    secretKeyReference: string;
    namespace: string;
    artifact: string;
    selection:
      | { strategy: "latest" }
      //
      | { strategy: "version"; version: string };
  };

  const categories: Record<PipelineStep.Type, PipelineStep.Category> = {
    [PipelineStep.Type.fs_read]: PipelineStep.Category.producer,
    [PipelineStep.Type.fs_write]: PipelineStep.Category.consumer,
    [PipelineStep.Type.postgres_backup]: PipelineStep.Category.producer,
    [PipelineStep.Type.compression]: PipelineStep.Category.transformer,
    [PipelineStep.Type.decompression]: PipelineStep.Category.transformer,
    [PipelineStep.Type.encryption]: PipelineStep.Category.transformer,
    [PipelineStep.Type.decryption]: PipelineStep.Category.transformer,
    [PipelineStep.Type.s3_upload]: PipelineStep.Category.consumer,
    [PipelineStep.Type.s3_download]: PipelineStep.Category.producer,
  };
  export function getCategory(step: PipelineStep): PipelineStep.Category {
    return categories[step.type];
  }

  type SubSchema<T extends PipelineStep> = Record<keyof T, z.ZodType>;
  const schema = z.discriminatedUnion("type", [
    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.fs_read),
      path: z.string(),
      itemizeDirectoryContents: z.boolean(),
    } satisfies SubSchema<PipelineStep.FsRead>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.fs_write),
      path: z.string(),
    } satisfies SubSchema<PipelineStep.FsWrite>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.postgres_backup),
      databases: z.union([
        z.object({ selection: z.literal("all") }),
        z.object({ selection: z.literal("include"), include: z.array(z.string()) }),
        z.object({ selection: z.literal("exclude"), exclude: z.array(z.string()) }),
      ]),
    } satisfies SubSchema<PipelineStep.PostgresBackup>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.compression),
      algorithm: z.literal("targzip"),
      targzip: z.object({
        level: z.number().min(1).max(9),
      }),
    } satisfies SubSchema<PipelineStep.Compression>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.decompression),
      algorithm: z.literal("targzip"),
    } satisfies SubSchema<PipelineStep.Decompression>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.encryption),
      algorithm: z.literal("aes256cbc"),
      keyReference: z.string(),
    } satisfies SubSchema<PipelineStep.Encryption>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.decryption),
      algorithm: z.literal("aes256cbc"),
      keyReference: z.string(),
    } satisfies SubSchema<PipelineStep.Decryption>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.s3_upload),
      accessKeyReference: z.string(),
      secretKeyReference: z.string(),
      namespace: z.string(),
    } satisfies SubSchema<PipelineStep.S3Upload>),

    z.object({
      id: z.string(),
      previousStepId: z.string().optional(),
      type: z.literal(Type.s3_download),
      accessKeyReference: z.string(),
      secretKeyReference: z.string(),
      namespace: z.string(),
      artifact: z.string(),
      selection: z.union([z.object({ strategy: z.literal("latest") }), z.object({ strategy: z.literal("version"), version: z.string() })]),
    } satisfies SubSchema<PipelineStep.S3Download>),
  ]);
  export function parse(unknown: unknown): PipelineStep {
    // Below ensures that PipelineStep is assignable to Zod
    const unionTypeExhaustionCheck: z.Infer<typeof schema> = undefined as unknown as PipelineStep;
    // Below ensures that Zod is assignable to PipelineStep (see method signature)
    return schema.parse(unknown);
  }
  parse.SCHEMA = schema;
}
