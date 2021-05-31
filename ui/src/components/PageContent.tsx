import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import { useObserver } from "mobx-react-lite";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";
import logo from "url:../assets/logo.svg";
import apiRoutes from "../api/apiRoutes";
import { StateContext } from "../context/StateContext";
import CreateUpdateModal from "../pages/CreateUpdateModal";
import { globalStoreContext } from "../store/globalStore";
import { InstanceProps } from "../../../types/globalTypes";
import Card from "./card/Card";
import SearchBar from "./SearchBar";

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

const PageContent = () => {
  const { urlVersionParams, urlSortBy } = useContext(StateContext);

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

  const stacksStartingUpdate = [...(stackUpdatesQuery.data?.startingUpdateStacks || [])];

  const stacks = Object.entries(stacksQuery?.data || []);

  return useObserver(() => (
    <Page>
      <SearchBar />
      <AnimateSharedLayout>
        <Grid>
          {stacks.length > 0 ? (
            stacks
              .filter((item) => {
                if (urlVersionParams.length > 0) {
                  if (
                    urlVersionParams.includes(item[1][0].server_app_version) ||
                    item[1][0].server_app_version === undefined
                  ) {
                    return true;
                  }
                  return false;
                }
                return true;
              })
              .sort((a, b) => {
                const item1 = a[1][0]; // First instance
                const item2 = b[1][0]; // First instance

                const sortBy = urlSortBy.replace(`!`, ``);
                const sortByReverse = urlSortBy.startsWith(`!`);
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
                    instances={item[1] as InstanceProps[]}
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
  ));
};

export default PageContent;
