import { AnimatePresence, AnimateSharedLayout, motion } from "framer-motion";
import { useObserver } from "mobx-react-lite";
import React, { useContext } from "react";
import styled from "styled-components";

import { StateContext } from "../../context/StateContext";
import { globalStoreContext } from "../../store/globalStore";
import InstanceProps from "../../utils/InstanceProps";
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

const server_ids = (instances?: InstanceProps[]) => {
  const ids = instances.map((instance) => instance.server_id);
  return ids[0] ? ids : undefined;
};

const getChosenOne = (instances?: InstanceProps[]) => {
  const chosenOne = instances.filter(
    (instance) => instance.instanceIsChosenOne === true,
  );
  return chosenOne[0] || undefined;
};

const Card = (props: { instances: InstanceProps[]; stackName: string }) => {
  const store = useContext(globalStoreContext);

  return useObserver(() => (
    <CardBackground layout>
      <CardHeader stackName={props.stackName} />
      <AnimateSharedLayout>
        {props.instances
          .sort((a: InstanceProps, b: InstanceProps) => {
            if (a.instanceCreatedAt === b.instanceCreatedAt) {
              return a.instancePublicIP < b.instancePublicIP ? -1 : 1;
            }
            return a.instanceCreatedAt < b.instanceCreatedAt ? -1 : 1;
          })
          .slice(0, store.instanceDisplayCount)
          .map((instance, i) => {
            if (i + 1 <= store.instanceDisplayCount) {
              return (
                <motion.div key={instance.server_id}>
                  <CardInstance instanceNumber={i + 1} instance={instance} />
                </motion.div>
              );
            }
          })}
      </AnimateSharedLayout>

      <CardFooter
        chosenOne={getChosenOne(props.instances)}
        instancesToUpdate={server_ids(props.instances)}
      />
    </CardBackground>
  ));
};

export default Card;
