import React from "react";
import styled from "styled-components";
import randomString from "../../utils/randomString";

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
    props.disabled ? "#eee" : ({ theme }) => theme.color.lightOne};
  cursor: ${props => (props.disabled ? "not-allowed" : "pointer")};
  text-decoration: none;
  padding: 1rem 0;
  transition: background-color 0.15s ease-out;
  font-size: 1.5em;
  :hover {
    background-color: ${({ theme }) => theme.color.darkTwo};
  }
`;

const Icon = styled.div`
  fill: ${({ theme }) => theme.color.lightOne};
  width: 48px;
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
        <Icon>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
            xmlSpace="preserve"
          >
            <path
              d="M212.3,365.5H98.4c-6.8,0-12.3,5.5-12.3,12.3S91.6,390,98.4,390h103.8c3.9,8.6,12.5,14.5,22.5,14.5h62.6
		c10,0,18.6-6,22.5-14.5h103.9c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-114c-6.8,0-12.3,5.5-12.3,12.3l-0.1,2.3l-62.7-0.1
		v-2.2C224.6,371,219.1,365.5,212.3,365.5z"
            />
            <path
              d="M78.6,110c-17.7,0-32.2,14.4-32.2,32.2v223.3H23.2c-6.8,0-12.3,5.5-12.3,12.3V401c0,26,21.2,47.2,47.2,47.2h395.6
		c26,0,47.2-21.2,47.2-47.2v-23.2c0-6.8-5.5-12.3-12.3-12.3h-23.2V142.2c0-0.4,0-0.8-0.1-1.2c-1.7-17.7-16-31-33.2-31
		c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.2,12.3,12.2c4.3,0,8.1,3.6,8.8,8.4v234.8c0,6.8,5.6,12.3,12.3,12.3h23.2v11
		c0,12.5-10.2,22.7-22.7,22.7H58.2c-12.5,0-22.7-10.2-22.7-22.7v-11h23.2c6.8,0,12.3-5.5,12.3-12.3V142.2c0-4.2,3.4-7.7,7.7-7.7
		c6.8,0,12.3-5.5,12.3-12.2S85.3,110,78.6,110z"
            />
            <path
              d="M308.8,137.7H203.2c-16.6,0-30.2,12.8-31.5,29.1h-12.3c-4.4,0-7.9-3.6-7.9-7.9v-29.1c0-6.8-5.5-12.3-12.3-12.3
		c-6.8,0-12.3,5.5-12.3,12.3v29.1c0,17.9,14.5,32.4,32.4,32.4h12.2v11h-67.2c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h67.2
		v10.8h-12.2c-17.9,0-32.4,14.5-32.4,32.4v29.1c0,6.8,5.5,12.3,12.3,12.3c6.8,0,12.3-5.5,12.3-12.3V270c0-4.4,3.5-7.9,7.9-7.9h14.3
		c7.4,30.2,34.6,52.8,67.1,52.8h30.5c32.5,0,59.8-22.5,67.1-52.8h14.3c4.4,0,7.9,3.5,7.9,7.9v29.1c0,6.8,5.5,12.3,12.3,12.3
		c6.8,0,12.3-5.5,12.3-12.3V270c0-17.9-14.5-32.4-32.4-32.4h-12.2v-10.8h67.2c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3h-67.2
		v-11h12.2c17.9,0,32.4-14.5,32.4-32.4v-29.1c0-6.8-5.5-12.3-12.3-12.3c-6.8,0-12.3,5.5-12.3,12.3v29.1c0,4.4-3.5,7.9-7.9,7.9h-12.3
		C339,150.6,325.4,137.7,308.8,137.7z M196.1,245.8v-76.4c0-3.9,3.2-7.2,7.2-7.2h40.5v128.2h-3C216.1,290.4,196.1,270.4,196.1,245.8
		z M271.2,290.4h-3V162.2h40.5c3.9,0,7.2,3.2,7.2,7.2v76.4C315.9,270.4,295.9,290.4,271.2,290.4z"
            />
            <path
              d="M200.9,118.9c0,6.8,5.5,12.3,12.3,12.3c6.8,0,12.3-5.5,12.3-12.3c0-16.9,13.7-30.6,30.6-30.6s30.6,13.7,30.6,30.6
		c0,6.8,5.5,12.3,12.3,12.3c6.8,0,12.3-5.5,12.3-12.3c0-30.4-24.7-55.1-55.1-55.1C225.6,63.8,200.9,88.5,200.9,118.9z"
            />
          </svg>
        </Icon>
        <Text>Logs</Text>
      </Button>
      <Button
        title="View Site"
        target="_blank"
        rel="noreferrer noopener"
        disabled={!stackUrl}
        href={stackUrl}
      >
        <Icon>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
            xmlSpace="preserve"
          >
            <path
              d="M117,170.6c3.2,0,6.4-1.3,8.7-3.6c2.3-2.3,3.6-5.4,3.6-8.7c0-3.2-1.3-6.4-3.6-8.7c-4.6-4.6-12.8-4.6-17.3,0
		c-2.3,2.3-3.6,5.4-3.6,8.7c0,3.2,1.3,6.4,3.6,8.7C110.6,169.2,113.8,170.6,117,170.6z"
            />
            <path
              d="M158.3,170.6c3.2,0,6.4-1.3,8.6-3.6c2.3-2.3,3.6-5.4,3.6-8.7c0-3.2-1.3-6.4-3.6-8.7c-4.6-4.6-12.8-4.6-17.3,0
		c-2.3,2.3-3.6,5.4-3.6,8.7c0,3.2,1.3,6.4,3.6,8.7C151.9,169.2,155.1,170.6,158.3,170.6z"
            />
            <path
              d="M199.7,170.6c3.2,0,6.4-1.3,8.7-3.6c2.3-2.3,3.6-5.5,3.6-8.7c0-3.2-1.3-6.4-3.6-8.7c-4.6-4.6-12.8-4.6-17.3,0
		c-2.3,2.3-3.6,5.4-3.6,8.7c0,3.2,1.3,6.4,3.6,8.7C193.3,169.2,196.4,170.6,199.7,170.6z"
            />
            <path
              d="M501.2,425.7V139c0-18.9-15.3-34.2-34.2-34.2H97.6c-18.9,0-34.2,15.4-34.2,34.2v286.7c0,18.9,15.3,34.2,34.2,34.2H467
		C485.9,459.9,501.2,444.5,501.2,425.7z M97.6,129.2H467c5.4,0,9.7,4.4,9.7,9.7v48.4H87.9V139C87.9,133.6,92.3,129.2,97.6,129.2z
		 M87.9,425.7V211.9h388.8v213.8c0,5.4-4.4,9.7-9.7,9.7H97.6C92.3,435.4,87.9,431,87.9,425.7z"
            />
            <path
              d="M10.8,86.3V373c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3V86.3c0-5.4,4.4-9.7,9.7-9.7h369.4c6.8,0,12.3-5.5,12.3-12.3
		s-5.5-12.2-12.3-12.2H45C26.1,52.1,10.8,67.5,10.8,86.3z"
            />
          </svg>
        </Icon>
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
        <Icon>
          <svg
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            enable-background="new 0 0 512 512"
            xmlSpace="preserve"
          >
            <path
              d="M397.4,259.4c-56.8,0-103.1,46.2-103.1,103.1s46.2,103.1,103.1,103.1s103.1-46.2,103.1-103.1S454.2,259.4,397.4,259.4z
		 M397.4,441c-43.3,0-78.6-35.3-78.6-78.6s35.3-78.6,78.6-78.6s78.6,35.3,78.6,78.6S440.7,441,397.4,441z"
            />
            <path
              d="M405.6,313.1c-4.7-4.3-11.8-4.3-16.5,0L360.8,339c-5,4.6-5.4,12.3-0.8,17.3c4.6,5,12.3,5.4,17.3,0.8l7.8-7.1v51.2
		c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-51.1l7.8,7.1c2.3,2.1,5.3,3.2,8.3,3.2c3.3,0,6.6-1.3,9.1-4c4.6-5,4.2-12.7-0.8-17.3
		L405.6,313.1z"
            />
            <path d="M325.3,103.1H211c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h114.4c6.8,0,12.3-5.5,12.3-12.3S332.1,103.1,325.3,103.1z" />
            <circle cx="117.5" cy="115.4" r="13" />
            <path
              d="M337.6,228.7c0-6.8-5.5-12.3-12.3-12.3H211c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h114.4
		C332.1,240.9,337.6,235.4,337.6,228.7z"
            />
            <circle cx="117.5" cy="228.7" r="13" />
            <path
              d="M11.5,342.2c0,37.9,30.8,68.7,68.7,68.7h184.6c6.8,0,12.3-5.5,12.3-12.3c0-6.8-5.5-12.3-12.3-12.3H80.2
		c-24.4,0-44.2-19.8-44.2-44.6c0-24.4,19.8-44.2,44.2-44.2h205.3c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H80.2
		c-24.4,0-44.2-19.8-44.2-44.6c0-24.4,19.8-44.2,44.2-44.2h269.5c24.4,0,44.2,19.8,44.2,44.6c0,6.8,5.5,12,12.3,12
		s12.3-5.7,12.3-12.5c0-23.3-11.7-43.9-29.5-56.3c17.8-12.4,29.5-32.9,29.5-56.2v-1c0-37.7-30.7-68.4-68.4-68.4h-270
		c-37.7,0-68.4,30.7-68.4,68.4v1c0,23.3,11.7,43.9,29.6,56.2c-17.8,12.5-29.6,33.2-29.6,56.8c0,23.4,11.8,44,29.6,56.4
		C23.3,297.8,11.5,318.5,11.5,342.2z M79.9,159.8c-24.2,0-43.9-19.7-43.9-43.9v-1C36,90.7,55.7,71,79.9,71h270
		c24.2,0,43.9,19.7,43.9,43.9v1c0,24.2-19.7,43.9-43.9,43.9h-0.3H80.2H79.9z"
            />
            <path d="M211,329.7c-6.8,0-12.3,5.5-12.3,12.3s5.5,12.3,12.3,12.3h51.8c6.8,0,12.3-5.5,12.3-12.3s-5.5-12.3-12.3-12.3H211z" />
            <circle cx="117.5" cy="342" r="13" />
          </svg>
        </Icon>
        <Text>Update</Text>
      </Button>
    </Footer>
  );
};

export default CardFooter;
