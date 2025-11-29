import z, { ZodError } from "zod/v4";

export namespace Parser {
  export function create<T>(schema: z.ZodType<T>) {
    /*
     * (the order of these overloads matters; typescript will typecheck against the first one declared ...
     * ... which should be the most specific one, since `unknown[]` als matches `unknown` ...
     * ... whereas `unknown` does not match `unknown[]`)
     */
    function parse(json: unknown[]): T[];
    function parse(json: unknown): T;
    function parse(json: unknown | unknown[]): T | T[] {
      try {
        return Array.isArray(json) ? json.map((obj) => schema.parse(obj)) : schema.parse(json);
      } catch (e: any) {
        if (e.name === ZodError.name) {
          const { issues } = e as ZodError;
          throw new Error(`Incoming JSON did not match client schema; ${JSON.stringify(issues, null, 2)}`);
        }
        throw e;
      }
    }

    /**
     * Include the schema
     */
    parse.SCHEMA = schema;
    return parse;
  }
}
