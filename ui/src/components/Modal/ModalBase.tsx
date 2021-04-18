import { motion } from "framer-motion";
import React from "react";
import FocusLock from "react-focus-lock";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";
import useClickAway from "../../hooks/useClickAway";
import IconClose from "../icons/IconClose";
import { spacing } from "../spacing";
import Stack from "../Stack";

const ModalContainer = styled(motion.div)`
  padding: 2rem;
  background-color: ${(props) => props.theme.color.darkOne};
  width: 100%;
  max-width: 1000px;
  box-shadow: 4px 4px 20px rgba(0, 0, 0, 0.6), 0px 0px 40px rgba(0, 0, 0, 0.2);
  color: #fff;
  margin: 0 auto;
  position: relative;
`;

const ModalHeader = styled.h1`
  margin: 0;
  font-size: ${spacing[13]};
`;

const ModalCloseButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  fill: #fff;
  background-color: ${(props) => props.theme.color.darkOne};
  border: 6px solid ${(props) => props.theme.color.darkTwo};
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
`;

interface ModalBaseProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const ModalBase = (props: ModalBaseProps) => {
  const modalContainerRef = useClickAway(props.onClose);

  useHotkeys("esc", props.onClose);

  return (
    <ModalWrapper>
      <ModalScreen
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />
      <FocusLock className="full-width">
        <ModalContainer
          ref={modalContainerRef}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0, opacity: 0 }}
        >
          <Stack direction="down" spacing={8}>
            <Stack justify="center">
              <ModalHeader>{props.title}</ModalHeader>
              <ModalCloseButton onClick={props.onClose}>
                <IconClose />
              </ModalCloseButton>
            </Stack>
            {props.children}
          </Stack>
        </ModalContainer>
      </FocusLock>
    </ModalWrapper>
  );
};

export default ModalBase;
