import { AnimatePresence, motion } from "framer-motion";
import Cookies from "js-cookie";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import APP_CONFIG from "../../../appConfig";
import useClickAway from "../../hooks/useClickAway";
import useIsLoggedIn from "../../hooks/useIsLoggedIn";
import IconGlasses from "../Icons/IconGlasses";
import IconLock from "../Icons/IconLock";
import IconUnlock from "../Icons/IconUnlock";

const MenuButton = styled(motion.button)`
  position: fixed;
  bottom: 25px;
  right: 25px;
  border-radius: 25px;
  border: none;
  width: 50px;
  height: 50px;
  background-color: var(--color-lightOne);
  box-shadow: var(--shadow-medium);
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
  background-color: var(--color-lightOne);
  box-shadow: var(--shadow-medium);
  padding: 12px;
  cursor: pointer;
`;

const DevMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);
  useClickAway(menuButtonRef, () => setIsMenuOpen(false));

  const { isLoggedIn } = useIsLoggedIn();

  const loginRedirect = localStorage.getItem(`currentPage`);

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
                  Cookies.remove(APP_CONFIG.COOKIE_NAME);
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
                  Cookies.set(APP_CONFIG.COOKIE_NAME, APP_CONFIG.DEV_JWT);
                  window.location.href = loginRedirect || `/`;
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
        <IconGlasses color={`--color-darkOne`} />
      </MenuToggleButton>
    </>
  );
};

export default DevMenu;
