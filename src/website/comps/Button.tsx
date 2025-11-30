import { JSX } from "react";
import { Icon } from "./Icon";
import clsx from "clsx";

type Props = JSX.IntrinsicElements["button"] & {
  icon?: Icon.Props["variant"];
};
export function Button({ icon, className, children, ...props }: Props) {
  return (
    <button
      {...props}
      className={clsx(
        "inline-flex gap-2 items-center p-2 border-2 border-c-primary rounded-lg hover:cursor-pointer hover:bg-c-dim/20",
        className,
      )}
    >
      {icon && <Icon variant={icon} className="size-4" />}
      {children}
    </button>
  );
}
