import { Exception } from "@/errors/Exception";

export const PipelineError = Exception.createGroup("PIPELINE", ["not_found"] as const);
