import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import { spacing } from "../components/spacing";
import Stack from "../components/Stack";

const CancelButton = styled.button`
  padding: 0.9rem 4rem;
  border-radius: 12px;
  cursor: pointer;
  font-size: ${spacing[11]};
  color: #ee2f01;
  background-color: transparent;
  border: 4px solid #ee2f01;
  transition: background-color 0.3s, color 0.3s;

  &:hover {
    color: #191e2a;
    background-color: #ee2f01;
  }
`;

interface UpdateSuccessProps {
  callback: () => void;
  cancel: () => void;
  onClose: () => void;
}

const UpdateSuccess = (props: UpdateSuccessProps) => {
  const [count, setCount] = useState(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCount(count - 1);
      if (count === 0) {
        clearTimeout(timer);
        props.callback();
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [count]);

  return (
    <Stack justify="center" spacing={4}>
      {count <= 0 ? (
        <CancelButton onClick={props.onClose}>Close</CancelButton>
      ) : (
        <CancelButton onClick={props.cancel}>({count}s) Cancel...</CancelButton>
      )}
    </Stack>
  );
};

export default memo(UpdateSuccess);
