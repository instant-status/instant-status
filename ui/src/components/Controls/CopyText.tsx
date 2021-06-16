import React, { useState } from "react";
import styled from "styled-components";

const Link = styled.span<{ active: boolean; $overflowVisible?: boolean }>`
  cursor: pointer;
  padding: 0 4px;
  border-radius: 6px;
  position: relative;
  opacity: ${(props) => (props.active ? 0.8 : 1)};
  transition: opacity 0.15s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
  display: flex;
  white-space: nowrap;
  ${(props) => !props.$overflowVisible && `overflow: hidden`};
  text-overflow: ellipsis;
`;

export interface CopyButtonProps {
  children: React.ReactNode | React.ReactNode[] | string;
  value: string;
  overflowVisible?: boolean;
}

const CopyText = (props: CopyButtonProps) => {
  const [active, setActive] = useState(false);

  const copy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setActive(true);
    }
    setTimeout(() => {
      setActive(false);
    }, 450);
  };

  return (
    <Link
      $overflowVisible={props.overflowVisible}
      active={active}
      title={props.value}
      onClick={() => copy(props.value)}
    >
      {active ? <i>Copied!</i> : props.children}
    </Link>
  );
};

export default CopyText;
