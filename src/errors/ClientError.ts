import { Exception } from "@/errors/Exception";

export const ClientError = Exception.createGroup("CLIENT", ["unknown"] as const);
