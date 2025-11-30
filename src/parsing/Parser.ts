import { MustMatch } from "@/types/MustMatch";
import z, { ZodError } from "zod/v4";

export namespace Parser {
  type ParserFactory<T, U> =
    MustMatch<T, U> extends never
      ? never
      : {
          ensureTypeEquivalence: () => {
            (json: unknown): T;
            SCHEMA: z.ZodType<T>;
          };
        };
  export function fromSchema<T, U>(schema: z.ZodType<any>): ParserFactory<T, U> {
    const parseFn = (json: unknown) => {
      try {
        return schema.parse(json);
      } catch (e: any) {
        if (e.name === ZodError.name) {
          const { issues } = e as ZodError;
          throw new Error(`JSON did not match Zod schema; ${JSON.stringify(issues, null, 2)}`);
        }
        throw e;
      }
    };
    parseFn.SCHEMA = schema;
    return { ensureTypeEquivalence: () => parseFn } as ParserFactory<T, U>;
  }
}

type Person = {
  name: string;
  age: number;
};
const schema = z.object({
  name: z.string(),
  age: z.number(),
});

const parser = Parser.fromSchema<Person, z.Infer<typeof schema>>(schema).ensureTypeEquivalence();
