const isStackUpdating = (update) => {
  const stackIsUpdating =
    update &&
    (update.server_finished_count === 0 ||
      update.server_count === 0 ||
      update.server_finished_count !== update.server_count);

  return stackIsUpdating;
};

export default isStackUpdating;
