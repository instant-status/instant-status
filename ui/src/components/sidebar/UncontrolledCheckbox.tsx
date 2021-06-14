import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";
import Stack from "../Stack";

const CheckboxContainer = styled.label<{ $disabled: boolean }>`
  ${(props) => props.$disabled && "font-style: italic;"};
  ${(props) => props.$disabled && "opacity: 0.7;"};
  align-items: center;
  break-inside: avoid;
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  display: flex;
  user-select: none;
`;

const HiddenCheckbox = styled.input`
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 10px;
`;

const Box = styled.div<{ $disabled: boolean }>`
  width: 20px;
  height: 20px;
  border-radius: 6px;
  margin-right: 8px;
  border: 1px solid ${(props) => props.theme.color.lightOne};
  ${(props) => props.$disabled && "opacity: 0.2;"};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LittlePop = styled(motion.div)`
  width: 12px;
  height: 12px;
  border-radius: 3px;
  background-color: ${(props) => props.theme.color.lightOne};
`;

const Label = styled.span`
  font-size: 16px;
`;

const HelperLabel = styled.span`
  font-size: 14px;
  opacity: 0.6;
`;

interface CheckboxProps {
  label: string;
  checked: boolean;
  name: string;
  helperLabel?: string;
  disabled?: boolean;
  visuallyDisabled?: boolean;
  onClick: (value: string) => void;
}

const variants = {
  active: {
    opacity: 1,
    scale: [1.6, 1],
    transition: {
      duration: 0.2,
    },
  },
  inactive: {
    scale: 0,
    opacity: 0,
    transition: {
      duration: 0.2,
    },
  },
};

const UncontrolledCheckbox = (props: CheckboxProps) => {
  return (
    <CheckboxContainer $disabled={props.visuallyDisabled}>
      <HiddenCheckbox
        type="checkbox"
        name={props.name}
        checked={props.checked}
        onChange={() => props.onClick(props.name)}
        disabled={props.disabled}
      />
      <Box $disabled={props.visuallyDisabled}>
        <AnimatePresence>
          {props.checked && (
            <LittlePop
              animate={props.checked ? "active" : "inactive"}
              variants={variants}
              exit={"inactive"}
            />
          )}
        </AnimatePresence>
      </Box>
      <Stack direction="down">
        <Label>{props.label}</Label>
        <HelperLabel>{props.helperLabel}</HelperLabel>
      </Stack>
    </CheckboxContainer>
  );
};

export default UncontrolledCheckbox;
