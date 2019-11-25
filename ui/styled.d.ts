import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      darkOne: string;
      darkTwo: string;
      lightOne: string;
      lightTwo: string;
    };
    shadow: {
      card: string;
    };
  }
}
