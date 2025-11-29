import { PipelineData } from "@/models/Pipeline+Data";
import { PipelineView } from "./PipelineView";
import { ExecutionData } from "@/models/Execution+Data";

export namespace PipelineViewData {
  export const POSTGRES_BACKUP: PipelineView = {
    ...PipelineData.POSTGRES_BACKUP,
    executions: [ExecutionData.SUCCESS_1, ExecutionData.SUCCESS_2, ExecutionData.ERROR],
  };
  export const WP_BACKUP: PipelineView = {
    ...PipelineData.WP_BACKUP,
    executions: [],
  };
  export const RESTORE: PipelineView = {
    ...PipelineData.RESTORE,
    executions: [ExecutionData.ERROR],
  };
}
