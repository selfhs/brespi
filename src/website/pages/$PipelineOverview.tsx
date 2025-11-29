import { Temporal } from "@js-temporal/polyfill";
import { Paper } from "../comps/Paper";
import { Skeleton } from "../comps/Skeleton";
import { Link } from "react-router";
import { SquareIcon } from "../comps/SquareIcon";
import clsx from "clsx";
import { useRegistry } from "../hooks/useRegistry";
import { PipelineClient } from "../clients/PipelineClient";
import { useQuery } from "@tanstack/react-query";
import { QueryKey } from "../clients/QueryKey";
import { Spinner } from "../comps/Spinner";
import { Icon } from "../comps/Icon";
import { ErrorDump } from "../comps/ErrorDump";
import { ProblemDetails } from "@/models/ProblemDetails";

type PipelineVisualization = {
  link: string;
  title: string;
  subtitle?: string;
  squareIcon: SquareIcon.Props["variant"];
};

export function $PipelineOverview() {
  const pipelineClient = useRegistry.instance(PipelineClient);

  const query = useQuery<PipelineVisualization[], ProblemDetails>({
    queryKey: [QueryKey.pipelines],
    queryFn: () =>
      pipelineClient.query().then<PipelineVisualization[]>((pipelineViews) => [
        ...pipelineViews.map<PipelineVisualization>((pipeline) => ({
          link: `/pipelines/${pipeline.id}`,
          title: pipeline.name,
          subtitle:
            pipeline.executions.length > 0
              ? `${pipeline.executions[0].outcome === "success" ? "Successfully executed" : "Failed to execute"} on ${pipeline.executions[0].completedAt.toLocaleString()}`
              : "Last execution: N/A",
          squareIcon: pipeline.executions.length > 0 ? pipeline.executions[0].outcome : ("no_data" as const),
        })),
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
