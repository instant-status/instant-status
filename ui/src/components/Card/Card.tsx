import { motion } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import styled from "styled-components";

import { ServerProps, StackProps } from "../../globalTypes";
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

const Card = observer((props: { stack: StackProps }) => {
  const store = useContext(globalStoreContext);

  const servers = props.stack.servers;
  const serverCount = props.stack.servers.length;

  const isStartingUpdate = Boolean(
    !servers.length ||
      props.stack.updates.find((update) => update.server_count === 0),
  );

  const isUpdating = Boolean(
    !servers.length ||
      servers.find((server) => server.server_update_progress !== 100) ||
      props.stack.updates.find((update) => update.server_count === 0),
  );

  const serverAppVersion = servers.find(
    (server) => server.server_app_version,
  )?.server_app_version;

  return (
    <CardBackground layout>
      <CardHeader
        stackId={props.stack.name}
        stackLogo={props.stack.logo_url}
        stackServerCount={serverCount}
      />
      {servers
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
              <CardServer
                key={server.server_id}
                server={server}
                isUpdating={isUpdating}
                isStartingUpdate={isStartingUpdate}
              />
            );
          }
        })}
      <CardFooter
        stackLogsUrl={props.stack.logs_url}
        stackAppUrl={props.stack.app_url}
        stackId={props.stack.id}
        serverAppVersion={serverAppVersion}
        isUpdating={isUpdating}
        canUpdate={props.stack.canUpdate}
      />
    </CardBackground>
  );
});

export default Card;
