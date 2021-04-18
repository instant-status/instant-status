import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";

import APP_CONFIG from "../../../../config/appConfig";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import useClickAway from "../../hooks/useClickAway";
import theme from "../../utils/theme";
import IconGlasses from "../icons/IconGlasses";
import IconLock from "../icons/IconLock";
import IconUnlock from "../icons/IconUnlock";

const MenuButton = styled(motion.button)`
  position: fixed;
  bottom: 25px;
  right: 25px;
  border-radius: 25px;
  border: none;
  width: 50px;
  height: 50px;
  background-color: ${(props) => props.theme.color.lightOne};
  box-shadow: ${(props) => props.theme.shadow.card};
  padding: 12px;
  cursor: pointer;
`;

const MenuToggleButton = styled(motion.button)`
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
  const menuButtonRef = useClickAway(() => setIsMenuOpen(false));

  const { isLoggedIn } = useIsLoggedIn();

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {isLoggedIn ? (
              <MenuButton
                type="button"
                animate={{ x: -75 }}
                exit={{
                  x: 0,
                  opacity: 0,
                  transition: {
                    delay: 0.2,
                  },
                }}
                onClick={() => {
                  localStorage.removeItem(`bearer`);
                  window.location.href = `/logout`;
                }}
                title="Log out"
              >
                <IconLock />
              </MenuButton>
            ) : (
              <MenuButton
                type="button"
                animate={{ x: -75 }}
                exit={{
                  x: 0,
                  transition: {
                    delay: 0.2,
                  },
                }}
                onClick={() => {
                  localStorage.setItem(`bearer`, APP_CONFIG.DEV_JWT);
                  window.location.reload();
                }}
                title="Log in"
              >
                <IconUnlock />
              </MenuButton>
            )}
          </>
        )}
      </AnimatePresence>
      <MenuToggleButton
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        type="button"
        ref={menuButtonRef}
        title="Open dev menu"
      >
        <IconGlasses color={theme.color.darkOne} />
      </MenuToggleButton>
    </>
  );
};

export default DevMenu;
