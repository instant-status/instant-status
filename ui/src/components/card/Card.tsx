import { AnimateSharedLayout, motion } from "framer-motion";
import { useObserver } from "mobx-react-lite";
import React, { useContext } from "react";
import styled from "styled-components";

import { globalStoreContext } from "../../store/globalStore";
import { InstanceProps } from "../../../../types/globalTypes";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import CardInstance from "./CardInstance";

const CardBackground = styled(motion.div)`
  background: ${(props) => props.theme.color.darkOne};
  color: ${(props) => props.theme.color.lightOne};
  border-radius: 2px;
  box-shadow: ${(props) => props.theme.shadow.card};
  width: 360px;
  display: flex;
  flex-direction: column;
`;

const getChosenOne = (instances?: InstanceProps[]) => {
  const chosenOne = instances.filter(
    (instance) => instance.server_is_chosen_one === true,
  );
  return chosenOne[0] || undefined;
};

const Card = (props: { instances: InstanceProps[]; isUpdating: boolean }) => {
  const store = useContext(globalStoreContext);

  const firstInstance = props.instances[0];

  return useObserver(() => (
    <CardBackground layout>
      <CardHeader
        stackId={firstInstance.stack_id}
        stackLogo={firstInstance.stack_logo}
      />
      <AnimateSharedLayout>
        {props.instances
          .sort((a: InstanceProps, b: InstanceProps) => {
            if (a.instanceCreatedAt === b.instanceCreatedAt) {
              return a.server_public_ip < b.server_public_ip ? -1 : 1;
            }
            return a.instanceCreatedAt < b.instanceCreatedAt ? -1 : 1;
          })
          .sort((a: InstanceProps, b: InstanceProps) => {
            return a.server_is_chosen_one < b.server_is_chosen_one ? 1 : -1;
          })
          .slice(0, store.instanceDisplayCount)
          .map((instance, i) => {
            if (i + 1 <= store.instanceDisplayCount) {
              return (
                <motion.div key={instance.server_id}>
                  <CardInstance instance={instance} isUpdating={props.isUpdating} />
                </motion.div>
              );
            }
          })}
      </AnimateSharedLayout>

      <CardFooter
        chosenOne={getChosenOne(props.instances)}
        isUpdating={props.isUpdating}
      />
    </CardBackground>
  ));
};

export default Card;
