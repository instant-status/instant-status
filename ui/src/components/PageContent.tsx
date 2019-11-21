import React, { useContext, useEffect } from "react";
import Sidebar from "./Sidebar";
import styled from "styled-components";
import { StateContext } from "../context/StateContext";
import Card from "./Card";
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
  display: grid;
  grid-template-columns: 3fr 3fr 3fr;
  grid-column-gap: 20px;
  grid-row-gap: 20px;
`;

const PageContent = () => {
  const { pageData, updatePageData } = useContext(StateContext);
  updatePageData();
  return (
    <>
      <Sidebar />
      <Page>
        <SearchBar />
        <Grid>
          {pageData.map(item => {
            return <Card key={item._id} stack={item} />;
          })}
        </Grid>
      </Page>
    </>
  );
};

export default PageContent;
