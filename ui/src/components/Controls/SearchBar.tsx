import React from "react";
import styled from "styled-components";

const StyledSearchBar = styled.input`
  background-color: var(--color-darkOne);
  border-radius: 10px;
  border: none;
  box-shadow: var(--shadow-medium);
  color: var(--color-lightOne);
  font-size: 24px;
  height: 40px;
  margin-bottom: 30px;
  text-align: center;
  width: 100%;
`;

const SearchBar = () => {
  return <StyledSearchBar type="text" disabled placeholder="Search" />;
};

export default SearchBar;
