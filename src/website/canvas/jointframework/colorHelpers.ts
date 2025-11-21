// TODO: should get rid of this

export const getLighterColor = (color: string): string => {
  const colorMap: Record<string, string> = {
    "#3498db": "#5dade2", // Producer - lighter blue
    "#9b59b6": "#bb8fce", // Transformer - lighter purple
    "#e74c3c": "#ec7063", // Consumer - lighter red
  };
  return colorMap[color] || color;
};

export const resetToDefaultColor = (element: any): void => {
  const currentFill = element.attr("body/fill") as string;
  if (currentFill === "#5dade2") {
    element.attr("body/fill", "#3498db");
  } else if (currentFill === "#bb8fce") {
    element.attr("body/fill", "#9b59b6");
  } else if (currentFill === "#ec7063") {
    element.attr("body/fill", "#e74c3c");
  }
};
