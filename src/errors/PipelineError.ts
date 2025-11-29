import { ServiceError } from "@/errors/ServiceError";

export const PipelineError = ServiceError.createGroup("PIPELINE", ["not_found"] as const);
