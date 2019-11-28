import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      darkOne: string;
      darkTwo: string;
      lightOne: string;
      lightTwo: string;
      red: string;
    };
    shadow: {
      card: string;
    };
  }
}
