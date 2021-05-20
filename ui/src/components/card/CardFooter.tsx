import { transparentize } from "polished";
import React, { useContext } from "react";
import styled from "styled-components";

import { globalStoreContext } from "../../store/globalStore";
import { InstanceProps } from "../../../../types/globalTypes";
import IconLogs from "../icons/IconLogs";
import IconOpen from "../icons/IconOpen";
import IconUpdate from "../icons/IconUpdate";
import { StringParam, useQueryParams } from "use-query-params";

const Footer = styled.footer`
  margin-top: auto;
  display: flex;
  user-select: none;
`;

const Button = styled.button<{ disabled: boolean }>`
  width: 33.33%;
  display: flex;
  flex-direction: column;
  border: none;
  align-items: center;
  color: ${(props) =>
    props.disabled && props.theme.color.darkOne
      ? transparentize(0.8, props.theme.color.lightOne)
      : props.theme.color.lightOne};
  fill: ${(props) =>
    props.disabled && props.theme.color.darkOne
      ? transparentize(0.8, props.theme.color.lightOne)
      : props.theme.color.lightOne};
  cursor: ${(props) => (props.disabled ? `not-allowed` : `pointer`)};
  text-decoration: none;
  padding: 1rem 0;
  transition: background-color 0.15s ease-out;
  font-size: 1.5em;
  background-color: ${({ theme }) => theme.color.darkOne};

  :hover {
    background-color: ${({ theme }) => theme.color.darkTwo};
  }
`;

const Text = styled.div`
  font-size: 0.6em;
  margin-top: 0.2em;
`;

const CardFooter = (props: {
  chosenOne: InstanceProps;
  isUpdating: boolean;
}) => {
  const [query, setQuery] = useQueryParams({
    stack: StringParam,
    version: StringParam,
    xapiVersion: StringParam,
  });

  const store = useContext(globalStoreContext);

  return (
    <Footer>
      <Button
        as="a"
        title="View Logs"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!props.chosenOne || !props.chosenOne.stack_logs_url}
        href={props.chosenOne && props.chosenOne.stack_logs_url}
      >
        <IconLogs width="40px" />
        <Text>Logs</Text>
      </Button>
      <Button
        as="a"
        title="View Site"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!props.chosenOne || !props.chosenOne.stack_app_url}
        href={props.chosenOne && props.chosenOne.stack_app_url}
      >
        <IconOpen width="40px" />
        <Text>Open</Text>
      </Button>
      <Button
        title="Update Stack"
        disabled={props.isUpdating}
        onClick={() => {
          store.setIsUpdateModalOpen(true);
          setQuery({
            stack: props.chosenOne.stack_id,
            version: props.chosenOne.server_app_version,
            xapiVersion: props.chosenOne.server_xapi_version,
          });
        }}
      >
        <IconUpdate width="40px" />
        <Text>Update</Text>
      </Button>
    </Footer>
  );
};

export default CardFooter;
