import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import { ServerProps } from "../../../../types/globalTypes";
import apiRoutes from "../../api/apiRoutes";
import logo from "../../assets/logo.svg";
import CreateUpdateModal from "../../containers/UpdateSteps/CreateUpdateModal";
import { globalStoreContext } from "../../store/globalStore";
import Card from "../Card/Card";
import SearchBar from "../Controls/SearchBar";

const Page = styled.main`
  background-color: ${(props) => props.theme.color.darkTwo};
  width: 100%;
  min-height: 100vh;
  border-radius: 40px 0 0 0;
  padding: 30px 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

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

  const refetchInterval = 5000; // Refetch the data every 5 seconds

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
      <SearchBar />
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
            <img src={logo} alt="Loading..." />
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
