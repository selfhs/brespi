import { ProblemDetails } from "@/models/ProblemDetails";
import { PipelineView } from "@/views/PipelineView";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { Link } from "react-router";
import { PipelineClient } from "../clients/PipelineClient";
import { QueryKey } from "../clients/QueryKey";
import { ErrorDump } from "../comps/ErrorDump";
import { Paper } from "../comps/Paper";
import { Skeleton } from "../comps/Skeleton";
import { Spinner } from "../comps/Spinner";
import { SquareIcon } from "../comps/SquareIcon";
import { useRegistry } from "../hooks/useRegistry";

export function $PipelineOverview() {
  const pipelineClient = useRegistry.instance(PipelineClient);

  const query = useQuery<PipelineVisualization[], ProblemDetails>({
    queryKey: [QueryKey.pipelines],
    queryFn: () =>
      pipelineClient.query().then<PipelineVisualization[]>((pipelineViews) => [
        ...pipelineViews.map(PipelineVisualization.convert),
        {
          link: "/pipelines/new",
          title: "New Pipeline ...",
          squareIcon: "new",
        },
      ]),
  });

  return (
    <Skeleton>
      <Paper className="col-span-full">
        {query.error ? (
          <div className="p-6 text-center">
            <ErrorDump error={query.error} />
          </div>
        ) : !query.data ? (
          <div className="p-6 text-center">
            <Spinner />
          </div>
        ) : (
          query.data.map(({ link, title, subtitle, squareIcon }, index, { length }) => (
            <Link
              key={link}
              to={link}
              className={clsx("flex items-center gap-6 hover:bg-c-dim/20 p-6", {
                "rounded-t-2xl": index === 0,
                "rounded-b-2xl": index + 1 === length,
              })}
            >
              <SquareIcon variant={squareIcon} />
              <div>
                <h3 className="text-lg font-medium">{title}</h3>
                {subtitle && <p className="font-light italic text-c-dim">{subtitle}</p>}
              </div>
            </Link>
          ))
        )}
      </Paper>
    </Skeleton>
  );
}

type PipelineVisualization = {
  link: string;
  title: string;
  subtitle?: string;
  squareIcon: SquareIcon.Props["variant"];
};
namespace PipelineVisualization {
  export function convert(p: PipelineView): PipelineVisualization {
    const lastExecution = p.executions.length > 0 ? p.executions[0] : undefined;
    return {
      link: `/pipelines/${p.id}`,
      title: p.name,
      subtitle: lastExecution
        ? `${lastExecution.outcome === "success" ? "Successfully executed" : "Failed to execute"} on ${lastExecution.completedAt.toLocaleString()}`
        : "Last execution: N/A",
      squareIcon: lastExecution?.outcome || "no_data",
    };
  }
}
