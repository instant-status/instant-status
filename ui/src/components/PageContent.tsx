import React, { useContext } from "react";
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
`;

const PageContent = () => {
  const { pageData, urlVersionParams, urlEnvParams } = useContext(StateContext);
  const stacks = Object.entries(pageData);

  return (
    <Page>
      <SearchBar />
      <Grid>
        {stacks.length > 0 && !pageData.error ? (
          stacks
            .filter(item => {
              if (urlVersionParams.length > 0) {
                if (
                  urlVersionParams.includes(item[1][0].tag) ||
                  item[1][0].tag === undefined
                ) {
                  return true;
                }
                return false;
              }
              return true;
            })
            // .filter(item => {
            //   if (urlEnvParams.length > 0) {
            //     if (urlEnvParams.includes(item[1][0].environment)) {
            //       return true;
            //     }
            //     return false;
            //   }
            //   return true;
            // })
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
