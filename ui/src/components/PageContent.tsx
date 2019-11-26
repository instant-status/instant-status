import React, { useContext } from "react";
import Sidebar from "./sidebar/Sidebar";
import styled from "styled-components";
import { StateContext } from "../context/StateContext";
import Card from "./card/Card";
import SearchBar from "./SearchBar";

const Page = styled.main`
  background-color: ${({ theme }) => theme.color.darkTwo};
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

  return (
    <>
      <Sidebar />
      <Page>
        <SearchBar />
        <Grid>
          {Object.entries(pageData)
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
            })}
        </Grid>
      </Page>
    </>
  );
};

export default PageContent;
