import successSvg from "../images/success.svg";
import errorSvg from "../images/error.svg";
import newSvg from "../images/new.svg";
import { cloneElement, JSX, ReactNode } from "react";

export function Icon({ variant, className }: Icon.Props) {
  const images: Record<typeof variant, JSX.Element> = {
    success: <img src={successSvg} />,
    error: <img src={errorSvg} />,
    new: <img src={newSvg} />,
  };
  return cloneElement(images[variant], { className });
}

export namespace Icon {
  export type Props = {
    variant: "success" | "error" | "new";
    className?: string;
  };
}
