import React, { memo } from "react";
import styled from "styled-components";

import logo from "../../assets/logo.svg";

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
    </SplashContent>
  );
};

export default memo(Login);
