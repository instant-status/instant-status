import React from "react";
import styled from "styled-components";
import randomString from "../../utils/randomString";
import { transparentize } from "polished";
import IconLogs from "../icons/IconLogs";
import IconOpen from "../icons/IconOpen";
import IconUpdate from "../icons/IconUpdate";

const Footer = styled.footer`
  margin-top: auto;
  display: flex;
`;

const Button = styled.a<{ disabled: boolean }>`
  width: 33.33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${props =>
    props.disabled && props.theme.color.darkOne
      ? transparentize(0.8, props.theme.color.lightOne)
      : props.theme.color.lightOne};
  fill: ${props =>
    props.disabled && props.theme.color.darkOne
      ? transparentize(0.8, props.theme.color.lightOne)
      : props.theme.color.lightOne};
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  text-decoration: none;
  padding: 1rem 0;
  transition: background-color 0.15s ease-out;
  font-size: 1.5em;

  :hover {
    background-color: ${({ theme }) => theme.color.darkTwo};
  }
`;

const Text = styled.div`
  font-size: 0.6em;
  margin-top: 0.2em;
`;

export interface CardFooterProps {
  instanceBranch: string;
  instanceIds: [];
  stackTitle: string;
  stackUrl: string;
  stackZone: string;
}

const CardFooter = ({
  instanceBranch,
  instanceIds,
  stackTitle,
  stackUrl,
  stackZone
}: CardFooterProps) => {
  const [awsUpdateUrl, setAwsUpdateUrl] = React.useState("");

  const logsUrl = `https://eu-west-2.console.aws.amazon.com/cloudwatch/home?region=${stackZone}#logStream:group=curatr-${stackTitle}`;

  const setUrl = () => {
    const urlHost = `https://eu-west-2.console.aws.amazon.com/systems-manager/automation/execute/Update-Curatr-Version`;
    const urlRegion = `?region=${stackZone}`;
    const urlInstances = `#InstanceId=${instanceIds}`;
    const urlRandom = `&randomString=${randomString()}${randomString()}--${stackTitle}--${randomString()}${randomString()}`;
    const urlBranch = `&releaseBranch=${instanceBranch}`;
    const urlOptions = `&runMigrations=true&updateEnv=true&updateConfs=true`;

    const url = `${urlHost}${urlRegion}${urlInstances}${urlRandom}${urlBranch}${urlOptions}`;
    setAwsUpdateUrl(url);
  };

  React.useEffect(() => {
    setUrl();
  }, [stackUrl]);
  return (
    <Footer>
      <Button
        title="View Logs"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!stackZone || !stackTitle}
        href={logsUrl}
      >
        <IconLogs width="40px" />
        <Text>Logs</Text>
      </Button>
      <Button
        title="View Site"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!stackUrl}
        href={stackUrl}
      >
        <IconOpen width="40px" />
        <Text>Open</Text>
      </Button>
      <Button
        title="Update Stack"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!instanceIds || !stackZone || !instanceBranch}
        onClick={setUrl}
        href={awsUpdateUrl}
      >
        <IconUpdate width="40px" />
        <Text>Update</Text>
      </Button>
    </Footer>
  );
};

export default CardFooter;
