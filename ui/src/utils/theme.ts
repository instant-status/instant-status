import { DefaultTheme } from "styled-components";

// eslint-disable-next-line quotes
declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      darkOne: string;
      darkTwo: string;
      lightOne: string;
      lightTwo: string;
      red: string;
      green: string;
      blue: string;
      orange: string;
      purple: string;
    };
    shadow: {
      card: string;
    };
  }
}

const theme: DefaultTheme = {
  color: {
    darkOne: `#1f2430`,
    darkTwo: `#191e2a`,
    lightOne: `#fff1e5`,
    lightTwo: `#ffaf5`,
    red: `#ee2f01`,
    green: `#00ab4e`,
    blue: `#26a8ff`,
    orange: `#fcaf17`,
    purple: `#c06bd0`,
  },
  shadow: {
    card: `4px 4px 20px rgba(0, 0, 0, 0.17)`,
  },
};

export default theme;
