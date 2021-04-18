import { transparentize } from "polished";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";

import { StateContext } from "../../context/StateContext";
import { globalStoreContext } from "../../store/globalStore";
import InstanceProps from "../../utils/InstanceProps";
import randomString from "../../utils/randomString";
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
  instancesToUpdate: string[];
}) => {
  const [query, setQuery] = useQueryParams({
    stack: StringParam,
    version: StringParam,
  });

  const [_, setAwsUpdateUrl] = React.useState(``);
  const { prefillReleaseWith } = useContext(StateContext);
  const store = useContext(globalStoreContext);
  const history = useHistory();

  const releaseBranch =
    prefillReleaseWith === ``
      ? props.chosenOne?.instanceVersion
      : prefillReleaseWith;

  const setUrl = (event?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    // Check for a right click as we want to ignore these
    if (!event || event.button === 2) {
      return;
    }

    const urlHost = `https://${props.chosenOne.stackRegion}.console.aws.amazon.com/systems-manager/automation/execute/Update-Curatr-Version`;
    const urlRegion = `?region=${props.chosenOne.stackRegion}`;
    const urlInstances = `#InstanceId=${props.instancesToUpdate}`;
    const urlRandom = `&randomString=${randomString()}${randomString()}--${
      props.chosenOne.stackName
    }--${randomString()}${randomString()}`;
    const urlVersion = `&releaseBranch=${releaseBranch}`;
    const urlOptions = `&runMigrations=true&updateEnv=true&updateConfs=true`;
    const url = `${urlHost}${urlRegion}${urlInstances}${urlRandom}${urlVersion}${urlOptions}`;

    setAwsUpdateUrl(url);
  };

  useEffect(() => {
    if (props.chosenOne) {
      setUrl();
    }
  }, [props.chosenOne && props.chosenOne.stackAppUrl]);

  return (
    <Footer>
      <Button
        as="a"
        title="View Logs"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!props.chosenOne || !props.chosenOne.stackLogsUrl}
        href={props.chosenOne && props.chosenOne.stackLogsUrl}
      >
        <IconLogs width="40px" />
        <Text>Logs</Text>
      </Button>
      <Button
        as="a"
        title="View Site"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!props.chosenOne || !props.chosenOne.stackAppUrl}
        href={props.chosenOne && props.chosenOne.stackAppUrl}
      >
        <IconOpen width="40px" />
        <Text>Open</Text>
      </Button>
      <Button
        title="Update Stack"
        disabled={
          !props.chosenOne ||
          !props.instancesToUpdate ||
          !props.chosenOne?.instanceVersion
        }
        onClick={() => {
          store.setIsUpdateModalOpen(true);
          setQuery({
            stack: props.chosenOne.stackName,
            version: props.chosenOne.instanceVersion,
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
