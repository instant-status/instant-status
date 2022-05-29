/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnimatePresence } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import apiRoutes from "../../api/apiRoutes";
import logo from "../../assets/logo.svg";
import { StackProps } from "../../globalTypes";
import CreateUpdateModal from "../../pages/UpdateSteps/CreateUpdateModal";
import { globalStoreContext } from "../../store/globalStore";
import Card from "../Card/Card";
import Page from "./Page";
import PageHeader from "./PageHeader";

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 360px);
  grid-column-gap: 16px;
  grid-row-gap: 16px;
  justify-content: center;

  & > img {
    align-self: center;
  }
`;

const NoResults = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-lightOne);
  opacity: 0.5;
`;

const PageContent = observer(() => {
  const store = useContext(globalStoreContext);

  const refetchInterval = 8000; // Refetch the data every 8 seconds

  const stacksQuery = useQuery(`stacksData`, apiRoutes.apiGetStacksList, {
    refetchInterval,
  });

  const allStacks = (stacksQuery?.data || []) as StackProps[];

  const stacksToDisplay = allStacks
    .filter((stack) => {
      return (
        stack?.servers?.length > 0 &&
        (store?.displayVersions === undefined ||
          store.displayVersions.includes(stack?.servers[0]?.server_app_version))
      );
    })
    .sort((a, b) => {
      let item1 = a; // First server
      let item2 = b; // First server

      let sortBy = store.orderBy.replace(`!`, ``);

      if (sortBy.startsWith(`stack.`)) {
        // @ts-ignore
        item1 = a.servers[0]; // First server
        // @ts-ignore
        item2 = b.servers[0]; // First server

        sortBy = sortBy.replace(`stack.`, ``);
      }

      const sortByReverse = store.orderBy.startsWith(`!`);

      if (sortByReverse) {
        // @ts-ignore
        return item1[sortBy] < item2[sortBy] ? 1 : -1;
      } else {
        // @ts-ignore
        return item1[sortBy] > item2[sortBy] ? 1 : -1;
      }
    });

  return (
    <Page>
      <PageHeader />
      <Grid>
        {stacksToDisplay.length > 0 ? (
          stacksToDisplay.map((stack) => {
            return <Card key={stack.id} stack={stack} />;
          })
        ) : (
          <NoResults>
            <img src={logo} alt="Loading..." width="400px" />
            {allStacks.length > 0 && store?.displayVersions === undefined
              ? `No Servers Found`
              : (store?.displayVersions ?? []).length < 1
              ? `No Matching Stacks`
              : `No Stacks Found`}
          </NoResults>
        )}
      </Grid>

      <AnimatePresence>
        {store.isUpdateModalOpen && <CreateUpdateModal />}
      </AnimatePresence>
    </Page>
  );
});

export default PageContent;
