import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import styled from "styled-components";
import PageContent from "../components/PageContent";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  return (
    <Wrapper>
      <Sidebar />
      <PageContent />
    </Wrapper>
  );
};

export default StatusPage;
