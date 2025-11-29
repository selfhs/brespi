import { ProblemDetails } from "@/models/ProblemDetails";
import { Icon } from "./Icon";

type Props = {
  error: ProblemDetails;
};
export function ErrorDump({ error }: Props) {
  return (
    <div className="inline-block text-left text-c-error">
      <div className="inline-flex gap-2">
        <Icon variant="error" className="size-5" />
        <code>{error.problem}</code>
      </div>
      {error.details && <pre className="mt-4">{JSON.stringify(error.details, null, 2)}</pre>}
    </div>
  );
}
