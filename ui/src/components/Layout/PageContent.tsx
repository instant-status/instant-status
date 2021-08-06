import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router";
import styled from "styled-components";

import { ServerProps } from "../../../../types/globalTypes";
import apiRoutes from "../../api/apiRoutes";
import logo from "../../assets/logo.svg";
import { SmallButton } from "../../components/Controls/Buttons";
import CreateUpdateModal from "../../pages/UpdateSteps/CreateUpdateModal";
import { globalStoreContext } from "../../store/globalStore";
import theme from "../../utils/theme";
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

interface StacksQueryProps {
  0: string;
  1: ServerProps[];
}

const PageContent = observer(() => {
  const store = useContext(globalStoreContext);

  const refetchInterval = 8000; // Refetch the data every 8 seconds

  const history = useHistory();

  const stacksQuery = useQuery(`stacksData`, apiRoutes.apiGetStacks, {
    refetchInterval,
  });

  const stackUpdatesQuery = useQuery(
    `apiGetUpdatingStacks`,
    apiRoutes.apiGetUpdatingStacks,
    {
      refetchInterval,
    },
  );

  const updatingStacks = [...(stackUpdatesQuery.data?.updatingStacks || [])];

  const stacksStartingUpdate = [
    ...(stackUpdatesQuery.data?.startingUpdateStacks || []),
  ];

  const stacks = Object.entries(stacksQuery?.data || []) as StacksQueryProps[];

  return (
    <Page>
      <PageHeader
      // contentRight={
      //   <SmallButton
      //     onClick={() => history.push(`/admin/stacks`)}
      //     $color={theme.color.lightOne}
      //     $variant="ghost"
      //   >
      //     Administration
      //   </SmallButton>
      // }
      />
      <AnimateSharedLayout>
        <Grid>
          {stacks.length > 0 ? (
            stacks
              .filter((item) => {
                return (
                  store?.displayVersions === undefined ||
                  store.displayVersions.includes(item[1][0].server_app_version)
                );
              })
              .sort((a, b) => {
                const item1 = a[1][0]; // First server
                const item2 = b[1][0]; // First server

                const sortBy = store.orderBy.replace(
                  `!`,
                  ``,
                ) as keyof ServerProps;
                const sortByReverse = store.orderBy.startsWith(`!`);
                if (sortByReverse) {
                  return item1[sortBy] < item2[sortBy] ? 1 : -1;
                } else {
                  return item1[sortBy] > item2[sortBy] ? 1 : -1;
                }
              })
              .map((item) => {
                return (
                  <Card
                    key={item[0]}
                    isUpdating={updatingStacks.includes(item[0])}
                    isStartingUpdate={stacksStartingUpdate.includes(item[0])}
                    servers={item[1]}
                  />
                );
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
