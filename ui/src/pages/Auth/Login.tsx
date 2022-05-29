import React, { memo } from "react";
import styled from "styled-components";

import logo from "../../assets/logo.svg";

const SplashContent = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  color: var(--color-parchment);
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
      <LoadingLogo src={logo} alt="Loading pulse" width="400px" />
    </SplashContent>
  );
};

export default memo(Login);
