import { ProblemDetails } from "@/models/ProblemDetails";
import { PipelineView } from "@/views/PipelineView";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { PipelineClient } from "../clients/PipelineClient";
import { QueryKey } from "../clients/QueryKey";
import { ErrorDump } from "../comps/ErrorDump";
import { Paper } from "../comps/Paper";
import { Skeleton } from "../comps/Skeleton";
import { Spinner } from "../comps/Spinner";
import { useRegistry } from "../hooks/useRegistry";

export function $Pipeline() {
  const { id } = useParams();
  const pipelineClient = useRegistry.instance(PipelineClient);

  const query = useQuery<PipelineView, ProblemDetails>({
    queryKey: [QueryKey.pipelines, id],
    queryFn: () => pipelineClient.find(id!),
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
          <pre>{JSON.stringify(query.data, null, 2)}</pre>
        )}
      </Paper>
    </Skeleton>
  );
}
