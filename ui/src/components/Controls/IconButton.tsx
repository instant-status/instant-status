import React, { useState } from "react";
import styled from "styled-components";

const Button = styled.div`
  margin-left: auto;
  cursor: pointer;
`;

const IconButton = (props: {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  const [active, setActive] = useState(false);

  const click = () => {
    setActive(true);
    props.onClick();
    setTimeout(() => {
      setActive(false);
    }, 450);
  };

  return (
    <Button>
      {props.href && (
        <a href={props.href} target="_blank" rel="noreferrer noopener">
          {props.children}
        </a>
      )}
      {props.onClick && (
        <span onClick={() => click()}>{active ? `✅` : props.children}</span>
      )}
    </Button>
  );
};

export default IconButton;
