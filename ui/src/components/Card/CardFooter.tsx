import { observer } from "mobx-react-lite";
import { transparentize } from "polished";
import React, { useContext } from "react";
import styled from "styled-components";
import { NumberParam, StringParam, useQueryParams } from "use-query-params";

import { globalStoreContext } from "../../store/globalStore";
import IconLogs from "../Icons/IconLogs";
import IconOpen from "../Icons/IconOpen";
import IconUpdate from "../Icons/IconUpdate";

const Footer = styled.footer`
  margin-top: auto;
  display: flex;
  user-select: none;
`;

const FooterButton = styled.button<{ disabled: boolean }>`
  width: 100%;
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

interface CardFooterProps {
  stackLogsUrl?: string;
  stackAppUrl?: string;
  stackId?: number;
  serverAppVersion?: string;
  serverXapiVersion?: string;
  isUpdating: boolean;
}

const CardFooter = observer((props: CardFooterProps) => {
  const [, setQuery] = useQueryParams({
    stackId: NumberParam,
    appVersion: StringParam,
    xapiVersion: StringParam,
  });

  const store = useContext(globalStoreContext);

  return (
    <Footer>
      <FooterButton
        as="a"
        title="View Logs"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!props.stackLogsUrl}
        href={props.stackLogsUrl}
      >
        <IconLogs width="40px" />
        <Text>Logs</Text>
      </FooterButton>
      <FooterButton
        as="a"
        title="View Site"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!props.stackAppUrl}
        href={props.stackAppUrl}
      >
        <IconOpen width="40px" />
        <Text>Open</Text>
      </FooterButton>
      <FooterButton
        title="Update Stack"
        disabled={props.isUpdating}
        onClick={() => {
          store.setIsUpdateModalOpen(true);
          setQuery({
            stackId: props.stackId,
            appVersion: props.serverAppVersion,
            xapiVersion: props.serverXapiVersion,
          });
        }}
      >
        <IconUpdate width="40px" />
        <Text>Update</Text>
      </FooterButton>
    </Footer>
  );
});

export default CardFooter;
