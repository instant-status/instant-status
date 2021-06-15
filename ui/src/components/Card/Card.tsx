import { AnimateSharedLayout, motion } from "framer-motion";
import { useObserver } from "mobx-react-lite";
import React, { useContext } from "react";
import styled from "styled-components";
import { globalStoreContext } from "../../store/globalStore";
import { InstanceProps } from "../../../../types/globalTypes";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import CardInstance from "./CardServerInfo";

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
  instances: InstanceProps[];
  isUpdating: boolean;
  isStartingUpdate: boolean;
}) => {
  const store = useContext(globalStoreContext);

  const stackLogsUrl = props.instances.find(
    (instance) => instance.stack_logs_url,
  )?.stack_logs_url;
  const stackAppUrl = props.instances.find(
    (instance) => instance.stack_app_url,
  )?.stack_app_url;
  const stackId = props.instances.find(
    (instance) => instance.stack_id,
  )?.stack_id;
  const stackLogo = props.instances.find(
    (instance) => instance.stack_logo,
  )?.stack_logo;
  const serverAppVersion = props.instances.find(
    (instance) => instance.server_app_version,
  )?.server_app_version;
  const serverXapiVersion = props.instances.find(
    (instance) => instance.server_xapi_version,
  )?.server_xapi_version;

  return useObserver(() => (
    <CardBackground layout>
      <CardHeader stackId={stackId} stackLogo={stackLogo} />
      <AnimateSharedLayout>
        {props.instances
          .sort((a: InstanceProps, b: InstanceProps) =>
            a.server_public_ip.localeCompare(b.server_public_ip),
          )
          .sort((a: InstanceProps, b: InstanceProps) =>
            a.server_is_chosen_one < b.server_is_chosen_one ? 1 : -1,
          )
          .slice(0, store.instanceDisplayCount)
          .map((instance, i) => {
            if (i + 1 <= store.instanceDisplayCount) {
              return (
                <motion.div key={instance.server_id}>
                  <CardInstance
                    instance={instance}
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
