import { AnimatePresence, motion } from "framer-motion";
import React, { memo, useRef, useState } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import useOnClickOutside from "../../hooks/useOnClickOutside";
import theme from "../../utils/theme";
import IconGlasses from "../icons/IconGlasses";

const MenuButton = styled(motion.button)`
  position: fixed;
  bottom: 20px;
  right: 20px;
  border-radius: 30px;
  border: none;
  width: 60px;
  height: 60px;
  background-color: ${(props) => props.theme.color.lightOne};
  box-shadow: ${(props) => props.theme.shadow.card};
  padding: 12px;
  cursor: pointer;
`;

const DevMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const history = useHistory();
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  useOnClickOutside(menuButtonRef, () => setIsMenuOpen(false));

  const isLoggedIn = localStorage.getItem(`bearer`);

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {isLoggedIn ? (
              <MenuButton
                type="button"
                animate={{ x: -80 }}
                exit={{ x: 0, opacity: 0 }}
                onClick={() => {
                  console.log(`Logout`);

                  window.location = `/logout`;
                }}
              >
                Log out
              </MenuButton>
            ) : (
              <MenuButton
                type="button"
                animate={{ x: -80 }}
                exit={{ x: 0 }}
                onClick={() => {
                  localStorage.setItem(`bearer`, `strong-bearer-here`);
                  console.log(`Logout`);

                  window.location.reload();
                }}
              >
                Log in
              </MenuButton>
            )}
          </>
        )}
      </AnimatePresence>
      <MenuButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        type="button"
        ref={menuButtonRef}
      >
        <IconGlasses color={theme.color.darkOne} />
      </MenuButton>
    </>
  );
};

export default memo(DevMenu);
