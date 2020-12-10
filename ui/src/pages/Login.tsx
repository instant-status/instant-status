import React, { memo } from "react";
import GoogleButton from "react-google-button";
import styled from "styled-components";
import APP_CONFIG from "../../../config/appConfig";

import logo from "../assets/logo.svg";

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

const LoadingLogo = styled.img`
  max-width: 400px;
`;

const Login = () => {
  return (
    <SplashContent>
      <LoadingLogo src={logo} alt="Loading pulse" />
      <br />
      <GoogleButton
        onClick={(e) => {
          e.stopPropagation();
          window.location.href = APP_CONFIG.GOOGLE_AUTH_URL;
        }}
      />
    </SplashContent>
  );
};

export default memo(Login);
