import { PipelineView } from "@/views/PipelineView";
import { Yesttp } from "yesttp";

export class PipelineClient {
  public constructor(private readonly yesttp: Yesttp) {}

  public async query(): Promise<PipelineView[]> {
    const { body } = await this.yesttp.get<PipelineView[]>("/pipelines");
    return PipelineView.parse(body);
  }

  public async find(id: string): Promise<PipelineView> {
    const { body } = await this.yesttp.get<PipelineView>(`/pipelines/${id}`);
    return PipelineView.parse(body);
  }
}
