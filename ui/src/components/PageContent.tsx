import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { StateContext } from "../context/StateContext";
import Card from "./card/Card";
import SearchBar from "./SearchBar";

const Page = styled.main`
  background-color: ${props => props.theme.color.darkTwo};
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
`;

const PageContent = () => {
  const { pageData, setDataCalledAt, urlVersionParams, urlSortBy } = useContext(
    StateContext,
  );
  const stacks = Object.entries(pageData);

  useEffect(() => {
    const timer = setInterval(() => {
      setDataCalledAt(new Date().getTime());
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Page>
      <SearchBar />
      <Grid>
        {stacks.length > 0 && !pageData.error ? (
          stacks
            .filter(item => {
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

              const sortBy = urlSortBy.replace("!", "");
              const sortByReverse = urlSortBy.startsWith("!");
              if (sortByReverse) {
                return item1[sortBy] < item2[sortBy] ? 1 : -1;
              } else {
                return item1[sortBy] > item2[sortBy] ? 1 : -1;
              }
            })
            .map(item => {
              return (
                <Card key={item[0]} stackName={item[0]} instances={item[1]} />
              );
            })
        ) : (
          <p>loading</p>
        )}
      </Grid>
    </Page>
  );
};

export default PageContent;
