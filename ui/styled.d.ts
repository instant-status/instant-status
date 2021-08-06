import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      darkOne: string;
      darkTwo: string;
      lightOne: string;
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
