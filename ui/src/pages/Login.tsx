import React, { memo } from "react";
import GoogleButton from "react-google-button";
import styled from "styled-components";

import { APP_CONFIG } from "../../../appConfig";
import { theme } from "../App";

const SplashContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: ${(props) => props.theme.color.lightOne};
  width: 100%;
  overflow: hidden;
  height: 100vh;
`;

const Login = () => {
  return (
    <SplashContent>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 100 100"
        style={{ width: `160px` }}
      >
        <g
          strokeLinejoin="round"
          strokeLinecap="round"
          strokeWidth="7"
          stroke={theme.color.red}
          fill="none"
        >
          <path d="M4 50h21l6-12 10 37 15-55 10 38 5-8h25" />
          <path d="M4 55h19l7-11 10 36 14-54 10 37 5-8h27" opacity="0.3" />
        </g>
      </svg>
      <br />
      <GoogleButton
        onClick={(e) => {
          e.stopPropagation();
          window.location = APP_CONFIG.GOOGLE_AUTH_URL;
        }}
      />
    </SplashContent>
  );
};

export default memo(Login);
