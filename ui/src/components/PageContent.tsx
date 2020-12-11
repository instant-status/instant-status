import APP_CONFIG from "../../../config/appConfig";
import React, { useContext } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import logo from "../assets/logo.svg";
import { StateContext } from "../context/StateContext";
import fetchUrl from "../hooks/useFetch";
import Card from "./card/Card";
import SearchBar from "./SearchBar";

const Page = styled.main`
  background-color: ${(props) => props.theme.color.darkTwo};
  width: 100%;
  min-height: 100vh;
  border-radius: 40px 0 0 0;
  padding: 30px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 360px);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  justify-content: center;
  height: 100%;

  & > img {
    align-self: center;
  }
`;

const PageContent = () => {
  const { urlVersionParams, urlSortBy } = useContext(StateContext);

  const stacksQuery = useQuery(
    `stacksData`,
    () => fetchUrl(`${APP_CONFIG.DATA_URL}/instances?groupBy=stackName`),
    {
      refetchInterval: 10000, // Refetch the data every second
    },
  );

  const stacks = Object.entries(stacksQuery?.data || []);
  console.log(`stacks`, stacks);

  return (
    <Page>
      <SearchBar />
      <Grid>
        {stacks.length > 0 ? (
          stacks
            .filter((item) => {
              if (urlVersionParams.length > 0) {
                if (
                  urlVersionParams.includes(item[1][0].instanceVersion) ||
                  item[1][0].instanceVersion === undefined
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
                <Card key={item[0]} stackName={item[0]} instances={item[1]} />
              );
            })
        ) : (
          <img src={logo} alt="Loading..." />
        )}
      </Grid>
    </Page>
  );
};

export default PageContent;
