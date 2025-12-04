import { Step } from "@/models/Step";
import { FileSystemReadForm } from "./FileSystemReadForm";

type Props = {
  type: Step.Type;
  existing?: Step;
  className?: string;
  onCancel: () => unknown;
  onSubmit: (step: Step) => unknown;
};
export function StepForm({ type, existing, ...props }: Props) {
  if (type === Step.Type.fs_read) {
    return <FileSystemReadForm existing={existing as Step.FsRead} {...props} />;
  }
}
