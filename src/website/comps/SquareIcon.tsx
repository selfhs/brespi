import clsx from "clsx";
import { ReactNode } from "react";
import successSvg from "../images/success.svg";
import errorSvg from "../images/error.svg";
import newSvg from "../images/new.svg";
import { Icon } from "./Icon";

export function SquareIcon({ variant, className }: SquareIcon.Props) {
  const internals: Record<typeof variant, ReactNode> = {
    success: <Icon variant="success" />,
    error: <Icon variant="error" />,
    no_data: <span className="text-center leading-4 text-sm font-semibold">NO DATA</span>,
    new: <Icon variant="new" />,
  };
  return (
    <div className={clsx("size-14 border-2 border-c-dim text-c-dim rounded-lg grid place-items-center", className)}>
      {internals[variant]}
    </div>
  );
}

export namespace SquareIcon {
  export type Props = {
    variant: "no_data" | Icon.Props["variant"];
    className?: string;
  };
}
