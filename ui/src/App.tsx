import React from "react";

import { StateProvider } from "./context/StateContext";
import StatusPage from "./pages/StatusPage";
import {
  createGlobalStyle,
  DefaultTheme,
  ThemeProvider,
} from "styled-components";

const theme: DefaultTheme = {
  color: {
    darkOne: "#1f2430",
    darkTwo: "#191e2a",
    lightOne: "#FFF1E5",
    lightTwo: "#FFFAF5",
  },
  shadow: {
    card: "4px 4px 20px rgba(0, 0, 0, 0.17)",
  },
};

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    height: 100%;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    font-family: "PT Sans", sans-serif;
    font-weight: 400;
    font-size: 18px;
    margin: 0;
    padding: 0;
    min-height: 100%;
    background-color: ${props => props.theme.color.darkOne};
  }
`;

const App = () => {
  return (
    <StateProvider>
      <ThemeProvider theme={theme}>
        <>
          <GlobalStyle />
          <StatusPage />
        </>
      </ThemeProvider>
    </StateProvider>
  );
};

export default App;
