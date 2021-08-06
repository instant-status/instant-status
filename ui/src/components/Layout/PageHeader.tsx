import React from "react";
import styled from "styled-components";

import SearchBar from "../Controls/SearchBar";

const Grid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 200px 570px 200px;
  grid-column-gap: 16px;
  justify-content: center;

  & > img {
    align-self: center;
  }
`;

const ContentLeft = styled.div``;

const ContentRight = styled.div``;

interface PageHeaderProps {
  contentLeft?: React.ReactNode;
  contentRight?: React.ReactNode;
}

const PageHeader = (props: PageHeaderProps) => {
  return (
    <Grid>
      <ContentLeft>{props.contentLeft}</ContentLeft>
      <SearchBar />
      <ContentRight>{props.contentRight}</ContentRight>
    </Grid>
  );
};

export default PageHeader;
