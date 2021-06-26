import { AnimateSharedLayout, motion } from "framer-motion";
import { useObserver } from "mobx-react-lite";
import React, { useContext } from "react";
import styled from "styled-components";

import { ServerProps } from "../../../../types/globalTypes";
import { globalStoreContext } from "../../store/globalStore";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import CardServer from "./CardServerInfo";

const CardBackground = styled(motion.div)`
  background: ${(props) => props.theme.color.darkOne};
  color: ${(props) => props.theme.color.lightOne};
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.shadow.card};
  width: 360px;
  display: flex;
  flex-direction: column;
`;

const Card = (props: {
  servers: ServerProps[];
  isUpdating: boolean;
  isStartingUpdate: boolean;
}) => {
  const store = useContext(globalStoreContext);

  const stackLogsUrl = props.servers.find(
    (server) => server.stack_logs_url,
  )?.stack_logs_url;
  const stackAppUrl = props.servers.find(
    (server) => server.stack_app_url,
  )?.stack_app_url;
  const stackId = props.servers.find((server) => server.stack_id)?.stack_id;
  const stackLogo = props.servers.find(
    (server) => server.stack_logo,
  )?.stack_logo;
  const serverAppVersion = props.servers.find(
    (server) => server.server_app_version,
  )?.server_app_version;
  const serverXapiVersion = props.servers.find(
    (server) => server.server_xapi_version,
  )?.server_xapi_version;

  return useObserver(() => (
    <CardBackground layout>
      <CardHeader stackId={stackId} stackLogo={stackLogo} />
      <AnimateSharedLayout>
        {props.servers
          .sort((a: ServerProps, b: ServerProps) =>
            a.server_public_ip.localeCompare(b.server_public_ip),
          )
          .sort((a: ServerProps, b: ServerProps) =>
            a.server_is_chosen_one < b.server_is_chosen_one ? 1 : -1,
          )
          .slice(0, store.serverDisplayCount)
          .map((server, i) => {
            if (i + 1 <= store.serverDisplayCount) {
              return (
                <motion.div key={server.server_id}>
                  <CardServer
                    server={server}
                    isUpdating={props.isUpdating}
                    isStartingUpdate={props.isStartingUpdate}
                  />
                </motion.div>
              );
            }
          })}
      </AnimateSharedLayout>
      <CardFooter
        stackLogsUrl={stackLogsUrl}
        stackAppUrl={stackAppUrl}
        stackId={stackId}
        serverAppVersion={serverAppVersion}
        serverXapiVersion={serverXapiVersion}
        isUpdating={props.isUpdating}
      />
    </CardBackground>
  ));
};

export default Card;
