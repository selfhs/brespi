import { Config } from "@/Config";
import { ServiceError } from "@/errors/ServiceError";
import { WebError } from "@/errors/WebError";
import index from "@/website/index.html";
import { ErrorLike, serve } from "bun";
import { PipelineData } from "./models/Pipeline+Data";
import { PipelineService } from "./services/PipelineService";
import { PipelineView } from "./views/PipelineView";
import { PipelineViewData } from "./views/PipelineView+Data";
import { PipelineError } from "./errors/PipelineError";

export class Server {
  public constructor(private readonly pipelineService: PipelineService) {}

  public listen() {
    const server = serve({
      development: Config.O_BRESPI_STAGE === "development",
      routes: {
        /**
         * Defaults
         */
        "/*": index,
        "/api/*": () => {
          return Response.json(WebError.route_not_found().json(), { status: 404 });
        },

        /**
         * Configuration
         */
        "/api/config": {
          GET: async () => {
            const response = Object.entries(Config)
              .filter(([key]) => key.startsWith("O_BRESPI_" satisfies Config.PublicPrefix))
              .map(([key, value]) => ({ [key]: value }))
              .reduce((kv1, kv2) => Object.assign({}, kv1, kv2), {});
            return Response.json(response as Config.Public);
          },
        },

        /**
         * Pipelines
         */
        "/api/pipelines": {
          GET: async () => {
            const pipelines = [PipelineViewData.POSTGRES_BACKUP, PipelineViewData.WP_BACKUP, PipelineViewData.RESTORE];
            return Response.json(pipelines satisfies PipelineView[]);
          },
        },
        "/api/pipelines/:id": {
          GET: async ({ params }) => {
            const pipeline: PipelineView | undefined = [
              PipelineViewData.POSTGRES_BACKUP,
              PipelineViewData.WP_BACKUP,
              PipelineViewData.RESTORE,
            ].find((p) => p.id === params.id);
            if (!pipeline) {
              return Response.json(PipelineError.not_found().json(), { status: 400 });
            }
            return Response.json(pipeline satisfies PipelineView);
          },
        },

        /**
         * Temporary
         */
        "/api/backup": {
          POST: async () => {
            const result = await this.pipelineService.execute(PipelineData.POSTGRES_BACKUP);
            return Response.json(result);
          },
        },
        "/api/restore": {
          POST: async () => {
            const result = await this.pipelineService.execute(PipelineData.RESTORE);
            return Response.json(result);
          },
        },
      },
      /**
       * Error handling
       */
      error: (e) => this.handleError(e),
    });
    console.log(`🚀 Server running at ${server.url}`);
  }

  private async handleError(e: ErrorLike): Promise<Response> {
    if (e.name === ServiceError.name) {
      const error = e as ServiceError;
      if (WebError.unauthorized.matches(error.problem) || WebError.forbidden.matches(error.problem)) {
        return Response.json(error.json(), {
          status: 401,
          headers: { "www-authenticate": "basic" },
        });
      }
      return Response.json(error.json(), { status: 400 });
    }
    if (e.message?.includes("invalid input syntax for type")) {
      return Response.json(WebError.invalid_request_body().json(), { status: 400 });
    }
    console.error("An unknown error occurred", e);
    return Response.json(WebError.unknown().json(), { status: 500 });
  }
}
