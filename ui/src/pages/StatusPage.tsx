import React, { useState, useEffect, useContext } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import styled from "styled-components";
import PageContent from "../components/PageContent";
import Splash from "./Splash";
import { StateContext } from "../context/StateContext";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  const { pageData } = useContext(StateContext);

  const hasData = Object.entries(pageData).length > 0;

  if (localStorage.getItem("bearer")) {
    if (pageData[0] && pageData[0].error) {
      return <Splash />;
    }
    if (hasData) {
      return (
        <Wrapper>
          <Sidebar />
          <PageContent />
        </Wrapper>
      );
    }
    return <h1>Loading</h1>;
  }

  return <Splash />;
};

export default StatusPage;
