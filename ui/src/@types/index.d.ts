/* eslint-disable quotes */
declare module "*.svg" {
  // eslint-disable-next-line prettier/prettier
  import React = require("react");
  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement>
  >;
  const src: string;
  export default src;
}
