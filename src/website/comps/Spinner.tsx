import clsx from "clsx";

type Props = {
  className?: string;
};
export function Spinner({ className }: Props) {
  return (
    <div className={clsx("inline-block size-6 border-4 border-c-primary border-t-transparent rounded-full animate-spin", className)} />
  );
}
