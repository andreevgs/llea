export const getEstimationChipColor = (
  estimation: number,
): "success" | "warning" | "error" => {
  if (estimation >= 7) {
    return "success";
  } else if (estimation >= 5 && estimation < 7) {
    return "warning";
  } else {
    return "error";
  }
};
