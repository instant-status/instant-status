/* eslint-disable @typescript-eslint/ban-ts-comment */
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
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

const PageContent = observer(() => {
  const store = useContext(globalStoreContext);

  const refetchInterval = 8000; // Refetch the data every 8 seconds

  const stacksQuery = useQuery(`stacksData`, apiRoutes.apiGetStacksList, {
    refetchInterval,
  });

  const stacks = (stacksQuery?.data || []) as StackProps[];

  return (
    <Page>
      <PageHeader />
      <AnimateSharedLayout>
        <Grid>
          {stacks.length > 0 ? (
            stacks
              .filter((stack) => {
                return (
                  stack?.servers?.length > 0 &&
                  (store?.displayVersions === undefined ||
                    store.displayVersions.includes(
                      stack?.servers[0]?.server_app_version,
                    ))
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
              })
              .map((stack) => {
                return <Card key={stack.id} stack={stack} />;
              })
          ) : (
            <img src={logo} alt="Loading..." width="400px" />
          )}
        </Grid>
      </AnimateSharedLayout>

      <AnimatePresence>
        {store.isUpdateModalOpen && <CreateUpdateModal />}
      </AnimatePresence>
    </Page>
  );
});

export default PageContent;
