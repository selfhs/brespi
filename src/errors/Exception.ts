import { ProblemDetails } from "@/models/ProblemDetails";

export class Exception extends Error {
  public readonly name = Exception.name;

  public constructor(
    public readonly problem: string,
    public readonly details?: Record<string, any>,
  ) {
    super(problem);
  }

  public static createGroup<T extends readonly string[]>(name: string, subProblems: T): HelperTypes.Group<T> {
    const group = { name } as any;
    for (const subProblem of subProblems) {
      const problem = `${name}::${subProblem}`;

      function errorLambda(details?: Record<string, any>): Exception {
        return new Exception(problem, details);
      }

      errorLambda.matches = (problemOrProblemWithDetails?: string | ProblemDetails): boolean => {
        if (typeof problemOrProblemWithDetails === "string") {
          return problem === problemOrProblemWithDetails;
        }
        if (typeof problemOrProblemWithDetails?.problem === "string") {
          return problem === problemOrProblemWithDetails.problem;
        }
        return false;
      };
      group[subProblem] = errorLambda satisfies HelperTypes.ErrorLambda;
    }
    return group;
  }

  public json(): ProblemDetails {
    return {
      problem: this.problem,
      details: this.details,
    };
  }
}

namespace HelperTypes {
  export type ErrorLambda = ((details?: Record<string, any>) => Exception) & {
    matches: (problemOrProblemWithDetails?: string | ProblemDetails) => boolean;
  };

  type ExtractStringArrayLiterals<T> = T extends ReadonlyArray<infer U> ? U : never;

  export type Group<T extends readonly string[]> = {
    name: string;
  } & Omit<
    {
      [K in ExtractStringArrayLiterals<T>]: ErrorLambda;
    },
    "name"
  >;
}
