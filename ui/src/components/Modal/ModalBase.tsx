import { motion } from "framer-motion";
import React, { useRef } from "react";
import { createPortal } from "react-dom";
import FocusLock from "react-focus-lock";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";

import useClickAway from "../../hooks/useClickAway";
import usePortal from "../../hooks/usePortal";
import IconClose from "../Icons/IconClose";
import { spacing } from "../Layout/spacing";
import Stack from "../Layout/Stack";

const ModalContainer = styled(motion.div)`
  padding: 2rem;
  background-color: var(--color-darkOne);
  width: 100%;
  max-width: 1000px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.6), 0px 0px 40px rgba(0, 0, 0, 0.2);
  color: var(--color-lightOne);
  margin: 0 auto;
  position: relative;
  min-height: 100%;
`;

const ModalHeader = styled.h1`
  margin: 0;
  font-size: ${spacing[13]};
`;

const ModalCloseButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  fill: var(--color-lightOne);
  background-color: var(--color-darkOne);
  border: 6px solid var(--color-darkTwo);
  position: absolute;
  right: -20px;
  top: -20px;
  cursor: pointer;
`;

const ModalScreen = styled(motion.div)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  backdrop-filter: blur(10px);
  background-color: rgba(0, 0, 0, 0.6);
`;

const ModalWrapper = styled(motion.div)`
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const Actions = styled.div`
  margin-top: auto;
`;

interface ModalBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  actions: React.ReactNode;
}

const ModalBase = (props: ModalBaseProps) => {
  const modalContainerRef = useRef(null);

  useClickAway(modalContainerRef, props.onClose);

  useHotkeys(`esc`, props.onClose);

  const modalContent = (
    <ModalWrapper>
      <ModalScreen
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
      <FocusLock className="full-width">
        <ModalContainer
          ref={modalContainerRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Stack direction="down" spacing={8} justify="spaceBetween">
            <Stack justify="center">
              <ModalHeader>{props.title}</ModalHeader>
              <ModalCloseButton onClick={props.onClose}>
                <IconClose />
              </ModalCloseButton>
            </Stack>
            {props.children}
            <Actions>{props.actions}</Actions>
          </Stack>
        </ModalContainer>
      </FocusLock>
    </ModalWrapper>
  );

  const target = usePortal(`instant-status-modal`);
  return createPortal(modalContent, target);
};

export default ModalBase;
