import React, { memo, useEffect, useState } from "react";

import { CancelButton, GhostButton } from "../../components/Controls/Buttons";
import Stack from "../../components/Layout/Stack";

interface UpdateSuccessProps {
  callback: () => void;
  cancel: () => void;
  onClose: () => void;
  setIsSafeToClose: (value: boolean) => void;
}

const UpdateSuccess = (props: UpdateSuccessProps) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(count - 1);
      if (count === 0) {
        props.setIsSafeToClose(true);
        clearTimeout(timer);
        props.callback();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <Stack justify="center" spacing={4}>
      {count <= 0 ? (
        <GhostButton onClick={props.onClose}>Close</GhostButton>
      ) : (
        <CancelButton onClick={props.cancel}>({count}s) Cancel...</CancelButton>
      )}
    </Stack>
  );
};

export default memo(UpdateSuccess);
